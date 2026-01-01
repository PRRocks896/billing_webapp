import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Box, Typography, LinearProgress, Button, CircularProgress } from '@mui/material';

import {
  registerStaffPhoto,
  attendanceStaff
} from "../service/staff";

// Liveness Challenges
const STEPS = {
    LOAD: 'LOADING_MODELS',
    START: 'READY_TO_START',
    DETECTING: 'DETECTING_FACE',
    BLINK: 'BLINK_EYES',
    LEFT: 'TURN_HEAD_LEFT',
    RIGHT: 'TURN_HEAD_RIGHT',
    UP: 'TURN_HEAD_UP',
    DOWN: 'TURN_HEAD_DOWN',
    SUCCESS: 'CAPTURING',
    API_CALL: 'PROCESSING_SERVER',
    DONE: 'COMPLETED',
    FAIL: 'FAILED'
};

const SIDE_MAP = {
    [STEPS.LEFT]: { side: 'LEFT', icon: '←', text: 'LOOK LEFT' },
    [STEPS.RIGHT]: { side: 'RIGHT', icon: '→', text: 'LOOK RIGHT' },
    [STEPS.UP]: { side: 'UP', icon: '↑', text: 'LOOK UP' },
    [STEPS.DOWN]: { side: 'DOWN', icon: '↓', text: 'LOOK DOWN' },
};

const INSTRUCTIONS = {
    [STEPS.DETECTING]: "Position your face in the oval",
    [STEPS.BLINK]: "Blink your eyes naturally",
    [STEPS.LEFT]: "Turn your head slightly LEFT",
    [STEPS.RIGHT]: "Turn your head slightly RIGHT",
    [STEPS.UP]: "Look UP slightly",
    [STEPS.DOWN]: "Look DOWN slightly",
    [STEPS.SUCCESS]: "Perfect! Hold still...",
};

const FaceLivenessAuth = ({mode = 'register', staffId = null, onComplete}) => {
    const webcamRef = useRef(null);
    // const [mode, setMode] = useState('attendance'); // register, attendance
    const [currentStep, setCurrentStep] = useState(STEPS.LOAD);
    const [msg, setMsg] = useState('Loading AI Models...');
    const [progress, setProgress] = useState(0);

    // Load Models on Mount
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`),
                    faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68`)
                ]);
                setCurrentStep(STEPS.START);
                setMsg("Ready. Press Start.");
            } catch (err) {
                console.error("Model Load Error", err);
                setMsg("Error loading models. Check public/models path.");
            }
        };
        loadModels();
    }, []);

    // --- Liveness Logic Helpers --- //

    // Helper: Euclidean Distance specifically handling the _x and _y keys
    const getDistance = (p1, p2) => {
        if (!p1 || !p2) return 0;
        // Using || to handle both _x and x formats
        const x1 = p1._x ?? p1.x;
        const y1 = p1._y ?? p1.y;
        const x2 = p2._x ?? p2.x;
        const y2 = p2._y ?? p2.y;

        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    // Calculate Eye Aspect Ratio (EAR)
    const getEyeRatio = (eyePoints) => {
        if (!eyePoints || eyePoints.length < 6) return 0;

        // The EAR formula uses the distance between vertical landmarks 
        // and horizontal landmarks of the eye
        const d1 = getDistance(eyePoints[1], eyePoints[5]); // Upper/Lower 1
        const d2 = getDistance(eyePoints[2], eyePoints[4]); // Upper/Lower 2
        const d3 = getDistance(eyePoints[0], eyePoints[3]); // Eye Width

        if (d3 === 0) return 0;

        const ear = (d1 + d2) / (2 * d3);
        
        // Debug to verify value (usually between 0.15 and 0.40)
        // console.log("Calculated EAR:", ear); 
        
        return ear;
    };

    // 2. Check Head Pose (Simple Geometry)
    const checkHeadPose = (landmarks) => {
        const nose = landmarks.getNose()[3]; // Tip of nose
        const leftEye = landmarks.getLeftEye()[0]; // Outer corner
        const rightEye = landmarks.getRightEye()[3]; // Outer corner
        const jaw = landmarks.getJawOutline();
        
        // Width of face
        const faceWidth = faceapi.euclideanDistance(jaw[0], jaw[16]);
        
        // Horizontal: distance from nose to left vs right edge
        const distToLeft = Math.abs(nose.x - jaw[0].x);
        const distToRight = Math.abs(nose.x - jaw[16].x);
        
        // Vertical: Nose position relative to eye line
        const eyeY = (leftEye.y + rightEye.y) / 2;
        const noseY = nose.y;

        // Ratios
        const turnRatio = distToLeft / (distToRight + 0.1); // Avoid div by 0
        const pitchDiff = noseY - eyeY;
        
        let pose = 'CENTER';
        if (turnRatio < 0.5) pose = 'RIGHT'; // User looks to their right (camera left)
        if (turnRatio > 2.0) pose = 'LEFT'; 
        if (pitchDiff < 25) pose = 'UP'; // Nose too close to eyes
        if (pitchDiff > 35) pose = 'DOWN';

        return pose;
    };

    // --- Main Detection Loop --- //
    const detect = useCallback(async () => {
        if (
            currentStep === STEPS.API_CALL || 
            currentStep === STEPS.DONE || 
            currentStep === STEPS.FAIL ||
            currentStep === STEPS.START
        ) return;

        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            
            // Detect Face
            const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();

            if (!detection) {
                setMsg("Face lost. Please position in center.");
                return; // Skip this frame
            }

            const landmarks = detection.landmarks;
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            // Liveness Checks based on Steps
            switch(currentStep) {
                case STEPS.DETECTING:
                    // Just wait for a stable face
                    if (detection.detection.score > 0.8) {
                        setCurrentStep(STEPS.BLINK);
                        setProgress(10);
                    }
                    break;

                case STEPS.BLINK:
                    const leftEAR = getEyeRatio(leftEye);
                    const rightEAR = getEyeRatio(rightEye);
                    // Threshold ~0.25 indicates closed eye
                    if (leftEAR < 0.36 && rightEAR < 0.30) {
                        setCurrentStep(STEPS.LEFT);
                        setProgress(30);
                    }
                    break;

                case STEPS.LEFT:
                    if (checkHeadPose(landmarks) === 'LEFT') {
                        setCurrentStep(STEPS.RIGHT);
                        setProgress(50);
                    }
                    break;

                case STEPS.RIGHT:
                    if (checkHeadPose(landmarks) === 'RIGHT') {
                        setCurrentStep(STEPS.UP);
                        setProgress(70);
                    }
                    break;
                
                case STEPS.UP:
                     // Note: 'UP' detection is tricky, adjust threshold in checkHeadPose if needed
                     if (checkHeadPose(landmarks) === 'UP') {
                        setCurrentStep(STEPS.DOWN);
                        setProgress(85);
                    }
                    break;

                case STEPS.DOWN:
                    if (checkHeadPose(landmarks) === 'DOWN') {
                        setCurrentStep(STEPS.SUCCESS);
                        setProgress(100);
                    }
                    break;

                case STEPS.SUCCESS:
                    // Process Request
                    handleServerRequest();
                    break;
                default:
                    break;
            }
        }
    }, [currentStep]);

    // Run Detection Loop
    useEffect(() => {
        const interval = setInterval(() => {
            detect();
        }, 200); // Check every 200ms
        return () => clearInterval(interval);
    }, [detect]);


    // --- API Interaction --- //
    const handleServerRequest = async () => {
        setCurrentStep(STEPS.API_CALL);
        setMsg("Verifying with Server...");

        const imageSrc = webcamRef.current.getScreenshot();
        
        try {
            let res;

            if (mode === 'register') {
                res = await registerStaffPhoto({
                    id: staffId,
                    image: imageSrc
                });
            } else {
                // Verification / Attendance
                res = await attendanceStaff({
                    id: staffId,
                    image: imageSrc
                });
            }
            if (res&& res.success) {
                onComplete(res.data);
                setMsg(mode === 'register' ? "Registration Successful!" : `Welcome ${res.message}`);
                setCurrentStep(STEPS.DONE);
            } else {
                setMsg(`${res.message}. Try Again.`);
                setCurrentStep(STEPS.FAIL);
            }

        } catch (error) {
            console.error(error);
            setMsg(error.response?.data?.message || "Server Error. Try Again.");
            setCurrentStep(STEPS.FAIL);
        }
    };

    const reset = () => {
        setCurrentStep(STEPS.DETECTING);
        setProgress(0);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', bgcolor: '#000' }}>
        {/* Camera Feed */}
        <Box sx={{ position: 'relative', height: { xs: '350px', sm: '450px' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentStep !== STEPS.LOAD ? (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    mirrored={true}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    videoConstraints={{ facingMode: "user" }}
                />
            ) : (
                <CircularProgress color="primary" />
            )}

            {/* Scanning Line (Final Capture) */}
            {currentStep === STEPS.SUCCESS && <div className="scanner-line" />}

            {/* Directional Side Indicators */}
            {SIDE_MAP[currentStep] && (
                <Box className={`side-indicator side-${SIDE_MAP[currentStep].side}`}>
                    <Typography variant="h3" className="indicator-text">{SIDE_MAP[currentStep].icon}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{SIDE_MAP[currentStep].side}</Typography>
                </Box>
            )}

            {/* Blink Icon */}
            {currentStep === STEPS.BLINK && (
                <Box sx={{ position: 'absolute', textAlign: 'center', zIndex: 10 }}>
                    <Typography sx={{ fontSize: '5rem' }}>👁️</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', textShadow: '0 2px 4px #000' }}>BLINK NOW</Typography>
                </Box>
            )}

            {/* Oval Guide Overlay */}
            <div className={`guideline-overlay 
                ${currentStep === STEPS.DETECTING ? 'outline-active' : ''}
                ${currentStep === STEPS.BLINK ? 'outline-blink' : ''}
                ${currentStep === STEPS.SUCCESS ? 'outline-success' : ''}`}>
            </div>
        </Box>

        {/* Info & Control Panel */}
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                {INSTRUCTIONS[currentStep] || msg}
            </Typography>

            {/* Progress Bar */}
            {![STEPS.DONE, STEPS.FAIL, STEPS.START, STEPS.LOAD].includes(currentStep) && (
                <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
            )}

            {/* Start/Retry Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                {currentStep === STEPS.START && (
                    <Button variant="contained" size="large" onClick={() => setCurrentStep(STEPS.DETECTING)} sx={{ borderRadius: 10 }}>
                        Begin Scan
                    </Button>
                )}
                {currentStep === STEPS.FAIL && (
                    <Button variant="outlined" color="error" onClick={reset}>
                        Retry Verification
                    </Button>
                )}
            </Box>
        </Box>
    </Box>
    );
};

export default FaceLivenessAuth;
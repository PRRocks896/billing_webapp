import React, { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import * as FaceDetection from '@mediapipe/face_detection';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';
import { useFaceDetection } from 'react-use-face-detection';
import {
  registerStaffPhoto,
  attendanceStaff
} from "../service/staff";

const AttendanceCapture = () => {
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  // Toggle between Registration and Attendance mode
  const [mode, setMode] = useState("attendance"); // 'register' or 'attendance'
  const blinkStateRef = useRef("OPEN"); // OPEN | CLOSED
  const apiLockRef = useRef(false);
  const headStateRef = useRef("CENTER");
  const headMoveCompletedRef = useRef(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const BLINK_THRESHOLD = 0.20;
  const NOSE_TIP = 1;

  // EAR calculation
  const distance = (p1, p2) =>
    Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const getEAR = (eye) => {
    const A = distance(eye[1], eye[5]);
    const B = distance(eye[2], eye[4]);
    const C = distance(eye[0], eye[3]);
    return (A + B) / (2.0 * C);
  };

  // Capture + API call
  const captureAndSend = async (mode) => {
    if (!webcamRef.current) return;

    const image = webcamRef.current.getScreenshot();
    setMsg("Processing...");

    const payload =
      mode === "register"
        ? { id: 1, image }
        : { image };

    try {
      const res =
        mode === "register"
          ? await registerStaffPhoto(payload)
          : await attendanceStaff(payload);

      if (res?.success) {
        setMode(mode === "register" ? "attendance" : "register");
        setMsg("Success ✔");
      } else {
        setMsg(res?.message || "Failed");
      }
    } catch (err) {
      setMsg("Server error");
    } finally {
      // 🔓 UNLOCK ONLY HERE
      apiLockRef.current = false;
    }
  };

  // Face Mesh setup
  useEffect(() => {
    if (!webcamRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.length) return;

      const landmarks = results.multiFaceLandmarks[0];
      if (!landmarks || landmarks.length < 468) return;
      const noseX = landmarks[NOSE_TIP].x;

      const CENTER_MIN = 0.45;
      const CENTER_MAX = 0.55;

      if (!headMoveCompletedRef.current) {
        if (headStateRef.current === "CENTER" && noseX < 0.35) {
          headStateRef.current = "LEFT";
          return;
        }

        if (headStateRef.current === "LEFT" && noseX > CENTER_MIN && noseX < CENTER_MAX) {
          headStateRef.current = "CENTER_1";
          return;
        }

        if (headStateRef.current === "CENTER_1" && noseX > 0.65) {
          headStateRef.current = "RIGHT";
          return;
        }

        if (headStateRef.current === "RIGHT" && noseX > CENTER_MIN && noseX < CENTER_MAX) {
          headMoveCompletedRef.current = true;
          console.log("✅ Head liveness passed");
        }
        if(!headMoveCompletedRef.current) {
          return; // ⛔ Block blink until movement done
        }
      }

      const LEFT_EYE = [33, 160, 158, 133, 153, 144];
      const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

      const leftEye = LEFT_EYE.map(i => landmarks[i]).filter(Boolean);
      const rightEye = RIGHT_EYE.map(i => landmarks[i]).filter(Boolean);

      if (leftEye.length < 6 || rightEye.length < 6) return;

      const ear = (getEAR(leftEye) + getEAR(rightEye)) / 2;

      // ----------------------------
      // BLINK STATE MACHINE
      // ----------------------------

      // OPEN → CLOSED
      if (ear < BLINK_THRESHOLD && blinkStateRef.current === "OPEN") {
        blinkStateRef.current = "CLOSED";
        return;
      }

      // CLOSED → OPEN  ✅ REAL BLINK
      if (ear >= BLINK_THRESHOLD && blinkStateRef.current === "CLOSED") {
        blinkStateRef.current = "OPEN";

        // 🔒 HARD LOCK (sync)
        if (apiLockRef.current) return;

        apiLockRef.current = true; // LOCK IMMEDIATELY
        captureAndSend(mode);
      }
    });


    cameraRef.current = new cam.Camera(
      webcamRef.current.video,
      {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      }
    );

    cameraRef.current.start();

    return () => {
      cameraRef.current?.stop();
    };
  }, [mode]);

  return (
    <div className="container">
      <h2>Blink to {mode === "register" ? "Register" : "Mark Attendance"}</h2>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
        audio={false}
      />

      <p style={{ color: "#0ff" }}>
        Blink your eyes to capture
      </p>

      <button onClick={() =>
        setMode(mode === "register" ? "attendance" : "register")
      }>
        Switch to {mode === "register" ? "Attendance" : "Register"}
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );

  // react-use-face-detection hook
  // const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
  //   faceDetectionOptions: {
  //     model: 'short',
  //   },
  //   faceDetection: new FaceDetection.FaceDetection({
  //     locateFile: (file) =>
  //       `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
  //   }),
  // });
  // console.log("webcamRef: ", webcamRef);
  // console.log("boundingBox: ", boundingBox);
  // console.log("isLoading: ", isLoading);
  // console.log("detected: ", detected);
  // console.log("facesDetected: ", facesDetected);

  // Handle Capture & API Call
  // const handleAction = async () => {
  //   if (!webcamRef.current) return;

  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setMsg("Processing...");

  //   // const endpoint = mode === "register" ? "http://localhost:3111/api/staff/register" : "http://localhost:3111/api/staff/attendance";
  //   const payload = mode === "register" ? { id: 1, image: imageSrc } : { image: imageSrc };

  //   try {
  //     const response = mode === 'register' ? await registerStaffPhoto(payload) : await attendanceStaff(payload);
  //     console.log(response);
  //     if(response && response.success) {
  //       if(mode === 'register') {
  //         setName("");
  //       }
  //     }
  //     // setMsg(data.message);

  //     // if(mode === 'register' && response.ok) setName(""); // Clear input on success

  //   } catch (error) {
  //     setMsg("Error connecting to server.");
  //   }
  // };

  // return (
  //   <div className="container">
  //     <h1>Face {mode === "register" ? "Registration" : "Attendance"} System</h1>

  //     {/* Camera View */}
  //     <div className="cam-wrapper">
  //       <Webcam
  //         ref={webcamRef}
  //         screenshotFormat="image/jpeg"
  //         width="640px"
  //         height="480px"
  //         style={{ position: 'absolute', left: 0, top: 0 }}
  //       />
  //       {/* Draw Box if detected */}
  //       {detected && boundingBox.map((box, index) => (
  //         <div
  //           key={index}
  //           className="overlay-box"
  //           style={{
  //             top: `${box.yCenter * 100}%`,
  //             left: `${box.xCenter * 100}%`,
  //             width: `${box.width * 100}%`,
  //             height: `${box.height * 100}%`,
  //           }}
  //         />
  //       ))}
  //       {isLoading && <div style={{position:'absolute', color:'white', top: 10, left: 10}}>Loading Model...</div>}
  //     </div>

  //     <div className="status" style={{ color: detected ? '#00ffcc' : 'red' }}>
  //       {detected ? `Face Detected (${facesDetected})` : "Please look at the camera"}
  //     </div>

  //     <div className="controls">
  //       {mode === "register" && (
  //         <input 
  //           type="text" 
  //           placeholder="Enter Name" 
  //           value={name} 
  //           onChange={(e) => setName(e.target.value)}
  //         />
  //       )}

  //       <button 
  //         onClick={handleAction} 
  //         disabled={(mode === "register" && !name)}
  //         className={mode === "register" ? "btn-primary" : "btn-success"}
  //       >
  //         {mode === "register" ? "Register Face" : "Mark Attendance"}
  //       </button>

  //       <button className="btn-toggle" onClick={() => setMode(mode === "register" ? "attendance" : "register")}>
  //         Switch to {mode === "register" ? "Attendance" : "Register"}
  //       </button>
  //     </div>

  //     {msg && <p className="status">{msg}</p>}
  //   </div>
  // )

};

export default AttendanceCapture;

// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";
// import { compareStaffPhoto } from "../service/staff";
// import { showToast } from "../utils/helper";

// const AttendanceCapture = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [image, setImage] = useState(null);
//   const [blinked, setBlinked] = useState(false);

//   // Load models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = '/models'; // put face-api.js models in public/models
//       // await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`);
//       await faceapi.nets.ssdMobilenetv1.loadFromUri(`${MODEL_URL}/ssd_mobilenetv1`);
//       await faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition`);
//       await faceapi.nets.faceLandmark68TinyNet.loadFromUri(`${MODEL_URL}/face_landmark_68_tiny`);
//     };

//     loadModels();
//   }, []);

//   // Start face detection
//   useEffect(() => {
//     const interval = setInterval(() => {
//         detect();
//     }, 100); // every 100ms

//     return () => clearInterval(interval);
//   });

//   // Eye aspect ratio (EAR)
//   const getEAR = (eye) => {
//     // const vertical1 = eye[1].y - eye[5].y;
//     // const vertical2 = eye[2].y - eye[4].y;
//     // const horizontal = eye[0].x - eye[3].x;
//     // return (Math.abs(vertical1) + Math.abs(vertical2)) / (2.0 * Math.abs(horizontal));
//     const euclideanDistance = (p1, p2) =>
//       Math.hypot(p2.x - p1.x, p2.y - p1.y);

//     const A = euclideanDistance(eye[1], eye[5]);
//     const B = euclideanDistance(eye[2], eye[4]);
//     const C = euclideanDistance(eye[0], eye[3]);

//     return (A + B) / (2.0 * C);
//   };

//   const detect = async () => {
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video;

//       const detections = await faceapi
//         .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks(true);
//       if (detections) {
//         const leftEye = detections.landmarks.getLeftEye();
//         const rightEye = detections.landmarks.getRightEye();

//         const leftEAR = getEAR(leftEye);
//         const rightEAR = getEAR(rightEye);
//         const ear = ((leftEAR + rightEAR) / 2).toFixed(3);

//         const BLINK_THRESHOLD = 0.25;
//         if(ear < 0.25) {
//         console.log("ear: ", ear);
//         console.log("blink: ", BLINK_THRESHOLD);
//         }
//         if (ear < BLINK_THRESHOLD && !blinked) {
//           setTimeout(() => {
//             setBlinked(true);

//             // Capture image
//             const imageSrc = webcamRef.current.getScreenshot();
//             setImage(imageSrc);
//             console.log("Blink detected and photo captured!");
//           }, 1000);
//         } else if (ear >= BLINK_THRESHOLD) {
//           setBlinked(false);
//           setImage(null);
//         }
//       }
//     }
//   };

//   const compare  = async () => {
//     try {
//         const response = await compareStaffPhoto({
//             staffID: 1,
//             image: image
//         });
//         console.log(response);
//         if(response.success) {
//             showToast('Staff Matched', true);
//         } else {
//             showToast(response.message, false);
//         }
//     } catch(error) {
//         console.error(error);
//         showToast(error?.message, false);
//     }
//   }

//   useEffect(() => {
//     if(image) {
//         setTimeout(() => {
//             compare();
//         }, 1000);
//     }
//   }, [image]);

//   return (
//     <div>
//       <h2>Blink to Capture</h2>
//       {!blinked &&
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         width={640}
//         height={480}
//       />}
//       <canvas ref={canvasRef} style={{ position: "absolute" }} />
//       {image && <img src={image} alt="Captured" />}
//     </div>
//   );
// };

// export default AttendanceCapture;

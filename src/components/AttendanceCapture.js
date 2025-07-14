import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { compareStaffPhoto } from "../service/staff";
import { showToast } from "../utils/helper";

const AttendanceCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [blinked, setBlinked] = useState(false);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // put face-api.js models in public/models
      await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`);
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(`${MODEL_URL}/face_landmark_68_tiny`);
    };

    loadModels();
  }, []);

  // Start face detection
  useEffect(() => {
    const interval = setInterval(() => {
        detect();
    }, 100); // every 100ms

    return () => clearInterval(interval);
  });

  // Eye aspect ratio (EAR)
  const getEAR = (eye) => {
    // const vertical1 = eye[1].y - eye[5].y;
    // const vertical2 = eye[2].y - eye[4].y;
    // const horizontal = eye[0].x - eye[3].x;
    // return (Math.abs(vertical1) + Math.abs(vertical2)) / (2.0 * Math.abs(horizontal));
    const euclideanDistance = (p1, p2) =>
      Math.hypot(p2.x - p1.x, p2.y - p1.y);

    const A = euclideanDistance(eye[1], eye[5]);
    const B = euclideanDistance(eye[2], eye[4]);
    const C = euclideanDistance(eye[0], eye[3]);

    return (A + B) / (2.0 * C);
  };

  const detect = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true);
      if (detections) {
        const leftEye = detections.landmarks.getLeftEye();
        const rightEye = detections.landmarks.getRightEye();

        const leftEAR = getEAR(leftEye);
        const rightEAR = getEAR(rightEye);
        const ear = ((leftEAR + rightEAR) / 2).toFixed(3);

        const BLINK_THRESHOLD = 0.25;
        if(ear < 0.25) {
        console.log("ear: ", ear);
        console.log("blink: ", BLINK_THRESHOLD);
        }
        if (ear < BLINK_THRESHOLD && !blinked) {
          setTimeout(() => {
            setBlinked(true);

            // Capture image
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);
            console.log("Blink detected and photo captured!");
          }, 1000);
        } else if (ear >= BLINK_THRESHOLD) {
          setBlinked(false);
          setImage(null);
        }
      }
    }
  };

  const compare  = async () => {
    try {
        const response = await compareStaffPhoto({
            staffID: 1,
            image: image
        });
        console.log(response);
        if(response.success) {
            showToast('Staff Matched', true);
        } else {
            showToast(response.message, false);
        }
    } catch(error) {
        console.error(error);
        showToast(error?.message, false);
    }
  }

  useEffect(() => {
    if(image) {
        setTimeout(() => {
            compare();
        }, 1000);
    }
  }, [image]);

  return (
    <div>
      <h2>Blink to Capture</h2>
      {!blinked &&
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />}
      <canvas ref={canvasRef} style={{ position: "absolute" }} />
      {image && <img src={image} alt="Captured" />}
    </div>
  );
};

export default AttendanceCapture;

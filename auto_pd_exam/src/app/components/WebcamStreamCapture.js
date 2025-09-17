'use client'

import React from "react";
import Webcam from "react-webcam";
import {
  FilesetResolver,
  HandLandmarker, 
  FaceLandmarker
} from "@mediapipe/tasks-vision";
import { handleDownload, drawHandLandmarks, drawFaceLandmarks, videoConstraints } from "../util/util";
import useRecorder from "../hooks/useRecorder"
import Link from 'next/link';
import {uploadVideo, getID} from '../lib/data';


export default function WebcamStreamCapture({task, message, nextPath, hand, isLast}) {
    const webcamRef = React.useRef(null);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [webcamReady, setWebcamReady] = React.useState(false);
    const capturingRef = React.useRef(false); 
    const noDetectionFramesRef = React.useRef(0);
    const [noHandsDetected, setNoHandsDetected] = React.useState(false);
    const [noFaceDetected, setNoFaceDetected] = React.useState(false);
    const [handLandmarker, setHandLandmarker] = React.useState(null);
    const [faceLandmarker, setFaceLandmarker] = React.useState(null);
    const [webcamRunning, setWebcamRunning] = React.useState(false);
    const canvasRef = React.useRef(null);
    const lastVideoTime = React.useRef(-1);
    const [fadeOutBlackScreen, setFadeOutBlackScreen] = React.useState(false);
    const [showBlackScreen, setShowBlackScreen] = React.useState(true);

    // Keep track of all the recorded chuncks
      const handleDataAvailable = ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    }

    const {
      capturing, 
      countdown,
      timer,
      timerActive,
      recordingComplete, 
      handleStartCaptureClick, 
      stopRecording
    } = useRecorder(webcamRef, noDetectionFramesRef, handleDataAvailable);

    React.useEffect(() => {
      if (webcamReady) {
        setFadeOutBlackScreen(true);
        setTimeout(() => {
          setShowBlackScreen(false);
        }, 1500);
      }
    }, [webcamReady]);

    React.useEffect(() => {
      capturingRef.current = capturing;
    }, [capturing]); // this syncs the ref whenever 'capturing' changes


    // Load the HandLandmarker once
    React.useEffect(() => {
      const createHandLandmarker = async () => {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const handLandmarkerInstance = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        setHandLandmarker(handLandmarkerInstance);
      };

      createHandLandmarker();
    }, []);

    // Load the FaceLandmarker once
    React.useEffect(() => {
      const createFaceLandmarker = async () => {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const faceLandmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1
        });
        setFaceLandmarker(faceLandmarkerInstance);
      };
    
      createFaceLandmarker();
    }, []);

    React.useEffect(() => {
      // Wait until the webcam is running and the handLandmarker and faceLandmarker
      // are fulled loaded
      if (!webcamRunning || (!handLandmarker && !faceLandmarker)) return;
    
      let animationFrameId;
      let cancelled = false;
      const predictWebcam = async () => {
        if (cancelled) return;
        const webcam = webcamRef.current;
        const canvas = canvasRef.current;
        
        if (!webcam || !canvas) {
          animationFrameId = requestAnimationFrame(predictWebcam);
          return;
        }
         const video = webcam.video;
        
        // Don't process anything until the video is loaded
        if (!video || video.readyState !== 4) {
          animationFrameId = requestAnimationFrame(predictWebcam);
          return;
        }
    
        // Avoid processing the same frame twice
        if (lastVideoTime.current === video.currentTime) {
          animationFrameId = requestAnimationFrame(predictWebcam);
          return;
        }
        lastVideoTime.current = video.currentTime;
    
        // Allows us to draw on the window
        const canvasCtx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        const startTimeMs = performance.now();
    
        // Clear the canvas on the next frame so multiple drawings aren't rendered
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        let handDetected = false
        let faceDetected = false
    
        // Draw hands if available
        if (handLandmarker) {
          const handResults = handLandmarker.detectForVideo(video, startTimeMs);
          if (handResults.landmarks) {
            if (handResults.landmarks.length > 0)
              handDetected = true
            for (const landmarks of handResults.landmarks) {
              drawHandLandmarks(canvasCtx, landmarks);
            }
          }
        } 
    
        // Draw face if available
        if (faceLandmarker) {
          const faceResults = faceLandmarker.detectForVideo(video, startTimeMs);
          if (faceResults && faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
            if (faceResults.faceLandmarks.length > 0)
              faceDetected = true
            for (const landmarks of faceResults.faceLandmarks) {
              drawFaceLandmarks(canvasCtx, landmarks);
            }
          }
        }
        
        // This block will stop the recording if a face or a hand isn't detected for 120
        // consecutive frames
        if ((!handDetected || !faceDetected) && capturingRef.current) {
          noDetectionFramesRef.current += 1;
          console.log(noDetectionFramesRef.current)
          if (noDetectionFramesRef.current >= 120 && capturingRef.current) {
            if(!handDetected && faceDetected) 
              setNoHandsDetected(true)
            else if(!faceDetected && handDetected)
              setNoFaceDetected(true)
            else {
              setNoHandsDetected(true)
              setNoFaceDetected(true)
            }
            console.log("Stopping due to 60 frames of no detection");
            stopRecording();
          }
        // If a hand or face is detected, reset the noDetectionFramesRef counter
        } else if (capturingRef.current) {
          noDetectionFramesRef.current = 0; // reset counter if either is detected
          setNoFaceDetected(false)
          setNoHandsDetected(false)
        }
    
        animationFrameId = requestAnimationFrame(predictWebcam);
      };
    
      animationFrameId = requestAnimationFrame(predictWebcam);
    
      // optional cleanup function that runs whenever this effect is called
      // or when the component unmounts
      return () => {
        cancelAnimationFrame(animationFrameId);
        cancelled = true;
    };
    }, [webcamRunning, handLandmarker, faceLandmarker]);
    

    // This is called once the webcam is fully loaded
    const handleWebcamLoadedMetadata = () => {
      setWebcamReady(true);
      setWebcamRunning(true);
    }

    let text = null;
    if(!capturing && !noHandsDetected && !noFaceDetected && !recordingComplete) 
      text = 'Record';
    else if (!capturing && !recordingComplete)
      text = 'Retry';
    else if (!capturing && recordingComplete) 
      text = 'Retake';
    let captureButton = 
      (<button 
        onClick={() => {
          handleStartCaptureClick();
          setNoFaceDetected(false);
          setNoHandsDetected(false);
          setRecordedChunks([]);
        }}
        className='bg-red-600/60 hover:bg-red-800/60 border-5 border-gray-200 text-l text-white size-24 rounded-full start-button'>
          {text}
      </button>)
    
    return (
      <>
        <div className='flex-col relative w-full text-left mb-15'>
          <div className="text-5xl text-gray-200 font-extrabold fade-in text-shadow-md overline mb-2"> {task}</div>
          <div className="text-5xl text-gray-200 font-extrabold fade-in text-shadow-md mb-2"> for {hand} hand</div>
          <div className="text-xl text-gray-200 font-extrabold ml-2 fade-in"> {message} </div>
        </div>
        <div className="recording-container mt-5">
          {capturing && (
            <div className="flex bg-black text-4xl justify-center items-center font-bold text-white size-24 rounded-full timer-button">{countdown}</div>
          )}
          {!capturing && noHandsDetected && !noFaceDetected && !timerActive &&(
            <div className="flex text-9xl justify-center items-center 
                            font-bold text-white timer-active">
                              No hands detected!
            </div>
          )}
          {!capturing && !noHandsDetected && noFaceDetected && !timerActive &&(
            <div className="flex text-9xl justify-center items-center 
                            font-bold text-white timer-active">
                              No face detected!
            </div>
          )}
          {!capturing && noHandsDetected && noFaceDetected && !timerActive &&(
            <div className="flex text-9xl justify-center items-center 
                            font-bold text-white timer-active">
                              No face or hands detected!
            </div>
          )}
          {timerActive && (
            <div className='flex text-9xl justify-center items-center font-bold text-black timer-active'>{timer}</div>
          )}
          <div className="relative w-[1104px] h-[621px] drop-shadow-2xl fade-in">
            {showBlackScreen && (
              <div
                className={`rounded-lg absolute inset-0 bg-black z-20 transition-opacity duration-[1500ms] 
                  ${fadeOutBlackScreen ? 'opacity-0' : 'opacity-100'}`}
              />
            )}
            <Webcam 
              audio={false} 
              ref={webcamRef} 
              className={`rounded-lg ${(timerActive || noFaceDetected || noHandsDetected) ? 'getting-ready' : 'recording-video'}`}
              videoConstraints={videoConstraints}
              onLoadedMetadata={handleWebcamLoadedMetadata}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 pointer-events-none"
              width={960}
              height={540}
            />
          </div>
          {webcamReady && !timerActive && !capturing && captureButton}
        </div>
        {recordedChunks.length > 0 && recordingComplete &&(
          <div className='flex relative w-full justify-left mt-5'> 
            <Link
              href={nextPath}
              onNavigate={(e) => {
                const date = new Date();
                const blob = handleDownload(recordedChunks, task, hand);
                const path = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + 
                             '/' + task.replaceAll(' ', '_') + '_' + hand + '.mp4';
                uploadVideo(blob, path);
              }}
              className="rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLast ? 'Submit Recordings' : 'Next Task'}
            </Link>
          </div>
        )}
      </>
    );
  };
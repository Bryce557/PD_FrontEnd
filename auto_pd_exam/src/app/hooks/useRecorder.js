import React from "react";

export default function useRecorder(webcamRef, noDetectionFramesRef, handleDataAvailable) {
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [countdown, setCountdown] = React.useState(10);
    const countdownRef = React.useRef(null);
    const [timer, setTimer] = React.useState(5);
    const timerRef = React.useRef(null);
    const [timerActive, setTimerActive] = React.useState(false);
    const [recordingComplete, setRecordingComplete] = React.useState(false);
    
    // When the recording stops, ensure that the countdown (from 10) and the timer
    // (that gives the user 5 seconds to get ready) are reset in case another recording
    // needs to be taken
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setCapturing(false);
          setCountdown(10);
          setTimer(5);
          clearInterval(countdownRef.current);
          clearInterval(timerRef.current);
        }
    };

    // This is the 10 second countdown that starts when the user
    // presses record
    const startCountdown = () => {
      clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 0) {
            clearInterval(countdownRef.current);
            stopRecording();
            setRecordingComplete(true)
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    // When the user presses the record button
    const handleStartCaptureClick = () => {
      noDetectionFramesRef.current = 0;
      setRecordingComplete(false)
      clearInterval(timerRef.current);
      setCountdown(10);
      setTimerActive(true);
      setTimer(5); // Reset timer state on start
      // Runs the encloses code once every second (1000ms)
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCapturing(true);
            try {
              mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, { mimeType });
            } catch (e) {
              mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream);
            }
            mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
            mediaRecorderRef.current.start();
            startCountdown();
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return {
        capturing, 
        countdown, 
        timer, 
        timerActive, 
        recordingComplete, 
        handleStartCaptureClick,
        stopRecording
    }
}
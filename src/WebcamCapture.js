import React, { useRef, useEffect } from 'react';

const WebcamCapture = ({ handleVideo }) => {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        handleVideo(videoRef.current);
      })
      .catch((error) => console.error('Error accessing webcam:', error));
  }, [handleVideo]);

  return <video ref={videoRef} autoPlay muted  width={640} height={480}/>;
};

export default WebcamCapture;


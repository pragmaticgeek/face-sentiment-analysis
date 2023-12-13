import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import WebcamCapture from './WebcamCapture';


const mapEmojiToSentiment = {
  happy: '😀',
  sad: '😔',
  angry: '😡',
  disgusted: '🤮',
  neutral: '😐',
  surprised: '😲'
}

const SentimentAnalysis = () => {
  const [videoElement, setVideoElement] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const camFeedRef = useRef(null);

  useEffect(() => {
    const startVideo = () => {
      setInterval(async () => {
        if (!videoElement) return;

        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions();

        const expressions = detections[0]?.expressions;

        if (expressions) {
          const maxExpression = Object.keys(expressions).reduce(
            (a, b) => (expressions[a] > expressions[b] ? a : b),
          );

          const detectionsForSize = faceapi.resizeResults(detections, { width: videoElement.width, height: videoElement.height })
          // draw them into a canvas
          const canvas = document.getElementById('overlay')
          canvas.width = videoElement.width
          canvas.height = videoElement.height
          faceapi.draw.drawDetections(canvas, detectionsForSize, { withScore: false })

          setSentiment(maxExpression);
        }
      }, 100);
    };

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(startVideo).catch((e) => console.log(e));
  }, [videoElement]);

  return (
    <div>
      <WebcamCapture ref={camFeedRef} handleVideo={setVideoElement} width={640} height={480} />
      <canvas style={{position: 'absolute', top: 0, left: 0}}id='overlay' width={640} height={480}/>
      {sentiment && (
        <div>
          <h2>Sentiment:</h2>
          <p style={{fontSize: '5em'}}>{mapEmojiToSentiment[sentiment]} ({sentiment})</p>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;


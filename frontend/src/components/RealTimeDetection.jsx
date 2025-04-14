import React, { useEffect, useRef } from 'react';

const RealTimeDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // For capturing video frame
  const processedCanvasRef = useRef(null); // For showing processed frame

  useEffect(() => {
    const video = videoRef.current;
    const captureCanvas = canvasRef.current;
    const processedCanvas = processedCanvasRef.current;
    const captureCtx = captureCanvas.getContext('2d');
    const processedCtx = processedCanvas.getContext('2d');

    let isProcessing = false;

    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        // Periodically capture and send frame
        const intervalId = setInterval(() => {
          if (isProcessing) return;
          isProcessing = true;

          // Draw current frame to hidden canvas
          captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

          captureCanvas.toBlob((blob) => {
            const formData = new FormData();
            formData.append('image', blob, 'frame.png');

            fetch('http://192.168.1.6:5000/upload-image', {
              method: 'POST',
              body: formData,
            })
              .then((res) => res.blob())
              .then((processedBlob) => {
                const img = new Image();
                img.onload = () => {
                  processedCtx.drawImage(img, 0, 0, processedCanvas.width, processedCanvas.height);
                  isProcessing = false;
                };
                img.src = URL.createObjectURL(processedBlob);
              })
              .catch((err) => {
                console.error('Error sending/receiving image:', err);
                isProcessing = false;
              });
          }, 'image/png');
        }, 30); // Adjust this for desired FPS (e.g. 300ms = ~3 FPS)

        
      })
      .catch((error) => {
        console.error('Webcam error:', error);
        alert('Could not access the webcam.');
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Real-Time Pothole Detection</h1>

      {/* Live Video Feed */}
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        playsInline
        style={{ borderRadius: '10px', marginBottom: '10px' }}
      />

      {/* Hidden Canvas to capture video frame */}
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: 'none' }}
      />

      {/* Processed Output Canvas */}
      <h3>Processed Frame</h3>
      <canvas
        ref={processedCanvasRef}
        width="640"
        height="480"
        style={{ border: '2px solid #ccc', borderRadius: '10px' }}
      />
    </div>
  );
};

export default RealTimeDetection;

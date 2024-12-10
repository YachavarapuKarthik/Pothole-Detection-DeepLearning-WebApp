//import React, { useEffect, useRef, useState } from "react";
//import { io } from "socket.io-client";
//
//function RealTimeDetection() {
//  const liveVideoRef = useRef(null);
//  const [socket, setSocket] = useState(null);
//  const [serverMessage, setServerMessage] = useState("");
//
//  // Initialize Socket.IO connection
//  useEffect(() => {
//    const socketInstance = io("http://localhost:5000/"); // Flask server address
//    setSocket(socketInstance);
//
//    // Listen for server messages
//    socketInstance.on("message", (data) => {
//      console.log("Message from server:", data);
//      setServerMessage(data.data); // Update the displayed message
//    });
//
//    // Cleanup on component unmount
//    return () => {
//      socketInstance.disconnect();
//    };
//  }, []);
//
//  // Start the webcam feed
//  useEffect(() => {
//    let stream;
//
//    const startWebcam = async () => {
//      try {
//        stream = await navigator.mediaDevices.getUserMedia({ video: true });
//        if (liveVideoRef.current) {
//          liveVideoRef.current.srcObject = stream;
//        }
//      } catch (error) {
//        console.error("Error accessing webcam:", error);
//      }
//    };
//
//    startWebcam();
//
//    return () => {
//      if (stream) {
//        stream.getTracks().forEach((track) => track.stop());
//      }
//    };
//  }, []);
//
//  // Send a message to the server
//  const sendMessage = () => {
//    if (socket) {
//      socket.emit("clientMessage", "Hello Flask, this is React!");
//    }
//  };
//
//  return (
//    <div style={{ textAlign: "center" }}>
//      <h1>Real-Time Detection</h1>
//      <button onClick={sendMessage}>Send Message to Flask</button>
//      <p>Server Response: {serverMessage}</p>
//
//      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
//        <div>
//          <h3>Live Video</h3>
//          <video ref={liveVideoRef} autoPlay muted playsInline style={{ width: "400px", height: "300px", border: "1px solid black" }} />
//        </div>
//        <div>
//          <h3>Processed Video</h3>
//          <video style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "#eee" }} />
//        </div>
//      </div>
//    </div>
//  );
//}
//
//export default RealTimeDetection;

//import React, { useState, useRef, useEffect } from 'react';
//import Webcam from 'react-webcam';
//
//function RealTimeDetection() {
//  const webcamRef = useRef(null);
//
//  const capture = async () => {
//    const imageSrc = webcamRef.current.getScreenshot();
//
//    try {
//      const response = await fetch('http://localhost:5000/detect', {
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({ image: imageSrc })
//      });
//
//      if (!response.ok) {
//        throw new Error('HTTP error! status: ${response.status}');
//      }
//
//      const data = await response.json();
//      console.log(data);
//    } catch (error) {
//      console.error('Error:', error);
//    }
//  };
//
//  useEffect(() => {
//    const intervalId = setInterval(() => {
//      capture();
//    }, 1000); // Adjust the interval as needed
//
//    return () => clearInterval(intervalId);
//  }, []);
//
//  return (
//    <div>
//      <Webcam audio={false} ref={webcamRef} />
//    </div>
//  );
//}
//
//export default RealTimeDetection;

//import React, { useRef, useEffect } from 'react';
//
//function RealTimeDetection() {
//  const videoRef = useRef(null);
//
//  useEffect(() => {
//    const video = videoRef.current;
//    const videoSrc = 'http://localhost:5000/video-stream';
//
//    video.src = videoSrc;
//    video.play();
//  }, []);
//
//  return (
//    <div>
//      <video ref={videoRef} autoPlay />
//    </div>
//  );
//}
//
//export default RealTimeDetection;

import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const RealTimeDetection = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Connect to backend WebSocket
        const socket = io('http://localhost:5000');

        // Listen for video frames
        socket.on('video_stream', (data) => {
            const frame = data.frame;

            // Get the canvas context and draw the frame
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = `data:image/jpeg;base64,${frame}`;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        });

        // Start the stream
        socket.emit('start_stream');

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Real-Time Video Stream</h1>
            <canvas ref={canvasRef} width="640" height="480" />
        </div>
    );
};

export default RealTimeDetection;

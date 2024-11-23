import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function RealTimeDetection() {
  const liveVideoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [serverMessage, setServerMessage] = useState("");

  // Initialize Socket.IO connection
  useEffect(() => {
    const socketInstance = io("http://localhost:5000/"); // Flask server address
    setSocket(socketInstance);

    // Listen for server messages
    socketInstance.on("message", (data) => {
      console.log("Message from server:", data);
      setServerMessage(data.data); // Update the displayed message
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Start the webcam feed
  useEffect(() => {
    let stream;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Send a message to the server
  const sendMessage = () => {
    if (socket) {
      socket.emit("clientMessage", "Hello Flask, this is React!");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Real-Time Detection</h1>
      <button onClick={sendMessage}>Send Message to Flask</button>
      <p>Server Response: {serverMessage}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        <div>
          <h3>Live Video</h3>
          <video ref={liveVideoRef} autoPlay muted playsInline style={{ width: "400px", height: "300px", border: "1px solid black" }} />
        </div>
        <div>
          <h3>Processed Video</h3>
          <video style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "#eee" }} />
        </div>
      </div>
    </div>
  );
}

export default RealTimeDetection;

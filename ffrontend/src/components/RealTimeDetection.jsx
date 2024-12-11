import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const RealTimeDetection = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Connect to backend WebSocket
        const socket = io('http://localhost:5000/');

        // Handle connection errors
        socket.on('connect_error', (error) => {
            console.error("Connection error: ", error);
            alert('Failed to connect to the server');
        });

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

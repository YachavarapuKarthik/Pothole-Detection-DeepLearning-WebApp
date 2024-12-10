import React, { useState } from 'react';
import ReactPlayer from 'react-player';
// import './VideoDetection.css';

function VideoDetection() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  //const videoSrc = "http://localhost:5000/upload-video"
  const [processedVideo, setProcessedVideo] = useState(null);

  // Handle video selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
    }
  };

  // Handle form submission and video upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVideo) {
      alert("Please select a video before uploading");
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo); // Append the selected video file to form data

    try {
      const response = await fetch('http://localhost:5000/upload-video', {
        method: 'POST',
        body: formData, // Send the video file to the Flask backend
      });

      if (response.ok) {
        alert("i got video");
//        const data = await response.json()
        const blob = await response.blob(); // Get the processed video as a blob
        const videoUrl = URL.createObjectURL(blob); // Create a URL for the processed video
        setProcessedVideo(videoUrl);
        console.log(processedVideo)
        // Display the processed video with the file name
      } else {
        const errorResponse = await response.json();
        alert("Video upload failed: " + (errorResponse.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error in video uploading");
      console.log("Video error:", error);
    }
  };

  return (
    <div className="VideoDetection">
      <h1>Video Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        <button type="submit">Upload Video</button>
      </form>

      {/* Show video preview before upload */}
      {selectedVideo && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Video Preview:</h3>
          <video width="640" height="480" controls>
            <source src={URL.createObjectURL(selectedVideo)} type={selectedVideo.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Show processed video once received */}
      {processedVideo && (
        <div style={{ marginTop: '20px' }}>
          <h3>Processed Video</h3>
          <video width="640" height="480" controls>
            <source src={processedVideo} type={selectedVideo.type} />
            Your browser does not support the video tag.
          </video>
          <br />
          <a href={processedVideo} download="processed_video.mp4">Download Processed Video</a>
        </div>
      )}
    </div>
  );
}

export default VideoDetection;

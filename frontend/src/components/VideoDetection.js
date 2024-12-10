import React, { useState, useRef } from 'react';
// import './VideoDetection.css';

function VideoDetection() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  //const videoSrc = "http://localhost:5000/upload-video"
  const [processedVideo, setProcessedVideo] = useState(null);
  const [loading, setLoading] = useState(false); // For the loading spinner
  const processedSectionRef = useRef(null); // Reference for the processed section

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

    setLoading(true); // Show loading spinner
    setProcessedVideo(null); // Reset processed video for new uploads

    // Scroll to processed section (loading container)
    processedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    const formData = new FormData();
    formData.append('video', selectedVideo);

    try {
      const response = await fetch('http://localhost:5000/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log("i got video");
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
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="VideoDetection">
      <h1>Video Detection</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="videoFileInput" className="custom-file-label">
          Choose File
        </label>
        <input
          id="videoFileInput"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="file-input"
        />
        <button type="submit">Upload Video</button>
      </form>

      {/* Video Preview */}
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
          <ReactPlayer
          url={processedVideo}
          playing={true}
          controls={true}
          width="640px"
          height="360px"
          onError={(error) => {
            console.error('Video playback error:', error);
            // Handle the error, e.g., display an error message
          }}
        />
          <br />
          <a href={processedVideo} download="processed_video.mp4">Download Processed Video</a>
        </div>
      )}
    </div>
  );
}

export default VideoDetection;

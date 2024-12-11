import React, { useState, useRef } from 'react';

function VideoDetection() {
  const [selectedVideo, setSelectedVideo] = useState(null);
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
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setProcessedVideo(videoUrl); // Set the processed video
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


      {/* Processed Section */}
      <div className="procontainer" ref={processedSectionRef} style={{ marginTop: '20px' }}>
        {/* Show the heading only if loading or processedVideo exists */}
        {(loading || processedVideo) && <h3>Processed Video</h3>}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Processing video, please wait...</p>
          </div>
        ) : (
          processedVideo && (
            <div className="Dcontainer">
              <a href={processedVideo} download="processed_video.mp4" className="down">
                Download Video
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default VideoDetection;
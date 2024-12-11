import React, { useState, useRef } from 'react';  // Import React, useState, and useRef hooks for state and reference management

const VideoDetection = () => {
  // State hooks for video selection, processed video, and loading state
  const [selectedVideo, setSelectedVideo] = useState(null);  // Holds the selected video file
  const [processedVideo, setProcessedVideo] = useState(null);  // Holds the processed video URL
  const [loading, setLoading] = useState(false); // For displaying a loading spinner during video processing
  const processedSectionRef = useRef(null); // Reference for scrolling to the processed section

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];  // Get the first file selected by the user
    if (file) {
      setSelectedVideo(file);  // Set the selected video in state
    }
  };

  // Handle form submission and video upload
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    // If no video is selected, alert the user
    if (!selectedVideo) {
      alert("Please select a video before uploading");
      return;
    }

    setLoading(true);  // Show loading spinner
    setProcessedVideo(null);  // Reset processed video for new uploads

    // Scroll to the processed section (for user experience)
    processedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Create FormData to send the video to the server
    const formData = new FormData();
    formData.append('video', selectedVideo);  // Append the selected video file to FormData

    try {
      // Make a POST request to upload the video to the server
      const response = await fetch('http://localhost:5000/upload-video', {
        method: 'POST',
        body: formData,
      });

      // If the response is successful
      if (response.ok) {
        const blob = await response.blob();  // Get the processed video as a blob
        const videoUrl = URL.createObjectURL(blob);  // Create a URL object for the video blob
        setProcessedVideo(videoUrl);  // Set the processed video URL for playback
      } else {
        const errorResponse = await response.json();  // Parse error response from server
        alert("Video upload failed: " + (errorResponse.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error in video uploading");  // Alert the user if an error occurs
      console.log("Video error:", error);  // Log the error to the console
    } finally {
      setLoading(false);  // Hide loading spinner once the upload is complete or failed
    }
  };

  return (
    <div className="VideoDetection">
      <h1>Video Detection</h1>  {/* Title of the page */}
      <form onSubmit={handleSubmit}>  {/* Form to upload video */}
        <label htmlFor="videoFileInput" className="custom-file-label">Choose File</label>  {/* Label for video input */}
        <input
          id="videoFileInput"
          type="file"
          accept="video/*"  // Restrict file selection to video files only
          onChange={handleVideoChange}  // Handle file change
          className="file-input"
        />
        <button type="submit">Upload Video</button>  {/* Submit button to upload video */}
      </form>

      {/* Video Preview Section */}
      {selectedVideo && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Video Preview:</h3>  {/* Display title for preview section */}
          <video width="640" height="480" controls>  {/* Video player for preview */}
            <source src={URL.createObjectURL(selectedVideo)} type={selectedVideo.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Processed Section */}
      <div className="procontainer" ref={processedSectionRef} style={{ marginTop: '20px' }}>
        {/* Show the heading only if the video is loading or processed */}
        {(loading || processedVideo) && <h3>Processed Video</h3>}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>  {/* Spinner for loading animation */}
            <p>Processing video, please wait...</p>  {/* Message while the video is processing */}
          </div>
        ) : (
          processedVideo && (  // Show the processed video if available
            <div className="Dcontainer">
              <a href={processedVideo} download="processed_video.mp4" className="down">  {/* Download link for processed video */}
                Download Video
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default VideoDetection;  // Export the VideoDetection component for use in other parts of the application

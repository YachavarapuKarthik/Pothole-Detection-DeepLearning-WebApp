// ImageDetection.js
import React, { useState } from 'react';
import './ImageDetection.css';

function ImageDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image before uploading");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);  // Create a URL for the processed image
        setProcessedImage(imageUrl);  // Display the processed image
      } else {
        const errorResponse = await response.json();
        alert("Image upload failed: " + (errorResponse.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error in image uploading");
      console.log("Image error:", error);
    }
  };

  return (
    <div className="ImageDetection">
      <h1>Image Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>

      {selectedImage && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Image Preview:</h3>
          <img
            className="image"
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded Preview"
          />
        </div>
      )}

      {processedImage && (
        <div style={{ marginTop: '20px' }}>
          <h3>Processed Image:</h3>
          <img
            className="image"
            src={processedImage}
            alt="Processed Preview"
          />
        </div>
      )}
    </div>
  );
}

export default ImageDetection;

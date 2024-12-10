import React, { useState, useEffect, useRef } from 'react';
// import './ImageDetection.css';

function ImageDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const processedImageRef = useRef(null); // Reference to the processed image container

  // Create a preview URL whenever the selected image changes
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setSelectedImagePreview(objectUrl);

      // Cleanup the object URL when component unmounts or new image is selected
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please select an image before uploading');
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
        const imageUrl = URL.createObjectURL(blob);
        setProcessedImage(imageUrl); // Display the processed image

        // Scroll to the processed image section
        setTimeout(() => {
          processedImageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Adding a slight delay ensures the state update completes
      } else {
        const errorResponse = await response.json();
        alert('Image upload failed: ' + (errorResponse.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error in image uploading');
      console.error('Image error:', error);
    }
  };

  return (
    <div className="ImageDetection">
      <h1>Image Detection</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fileInput" className="custom-file-label">Choose File</label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        <button type="submit">Upload Image</button>
      </form>

      {selectedImagePreview && (
        <div className="box">
          <h3>Uploaded Image Preview:</h3>
          <img
            className="image"
            src={selectedImagePreview}
            alt="Uploaded Preview"
          />
        </div>
      )}

      {processedImage && (
        <div className="box" ref={processedImageRef}>
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

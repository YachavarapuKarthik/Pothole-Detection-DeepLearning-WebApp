import React, { useState, useEffect, useRef } from 'react';  // Import React hooks for state management, side effects, and refs

function ImageDetection() {
  // State to store the selected image and its preview
  const [selectedImage, setSelectedImage] = useState(null); // For selected image to uploaded
  const [selectedImagePreview, setSelectedImagePreview] = useState(null); // Status of selected video 
  const [processedImage, setProcessedImage] = useState(null); // For storing the processed image 
  
  // Reference to the processed image container for smooth scrolling
  const processedImageRef = useRef(null);

  // useEffect hook to generate an object URL for image preview whenever the selected image changes
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);  // Create a temporary URL for the selected image
      setSelectedImagePreview(objectUrl);  // Set the preview URL for the image

      // Cleanup the object URL to avoid memory leaks when component unmounts or when a new image is selected
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);  // Dependency array to run this effect when 'selectedImage' changes

  // Handle image file change when the user selects an image
  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Get the selected file from the input
    if (file) {
      setSelectedImage(file);  // Set the selected image in the state
    }
    // Reset the input so that the same file can be selected again if needed
    e.target.value = '';
  };

  // Handle form submission for image upload
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    if (!selectedImage) {
      alert('Please select an image before uploading');  // Alert user if no image is selected
      return;
    }

    const formData = new FormData();  // Create a new FormData object to send the image
    formData.append('image', selectedImage);  // Append the selected image to the FormData

    try {
      // Make a POST request to upload the image
      const response = await fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {  // If the response is OK (successful)
        const blob = await response.blob();  // Get the response as a Blob (binary data)
        const imageUrl = URL.createObjectURL(blob);  // Create an object URL for the processed image
        setProcessedImage(imageUrl);  // Set the processed image URL to display it

        // Scroll to the processed image section after a slight delay
        setTimeout(() => {
          processedImageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);  // Delay ensures the state update completes before scrolling
      } else {
        const errorResponse = await response.json();  // Parse error response if upload fails
        alert('Image upload failed: ' + (errorResponse.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error in image uploading');  // Alert in case of any error during the upload process
      console.error('Image error:', error);  // Log the error for debugging
    }
  };

  return (
    <div className="ImageDetection">
      <h1>Image Detection</h1>
      
      {/* Form to upload an image */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="fileInput" className="custom-file-label">Choose File</label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"  // Only accept image files
          onChange={handleImageChange}  // Handle file selection
          className="file-input"
        />
        <button type="submit">Upload Image</button>  {/* Button to submit the form */}
      </form>

      {/* Display the preview of the selected image */}
      {selectedImagePreview && (
        <div className="box">
          <h3>Uploaded Image Preview:</h3>
          <img
            className="image"
            src={selectedImagePreview}
            alt="Uploaded Preview"  // Alt text for accessibility
          />
        </div>
      )}

      {/* Display the processed image after successful upload */}
      {processedImage && (
        <>
        <div className="box" ref={processedImageRef}>
          <h3>Processed Image:</h3>
          <img
            className="image"
            src={processedImage}
            alt="Processed Preview"  // Alt text for accessibility
          />
        </div>
        <div className="Dcontainer">
              <a href={processedImage} download="processed_image.jpg" className="down">  {/* Download link for processed video */}
                Download Image
              </a>
            </div>
        </>
        
      )}
    </div>
    
  );
}

export default ImageDetection;  // Export the ImageDetection component to be used in other parts of the app

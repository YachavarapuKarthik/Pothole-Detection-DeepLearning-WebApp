import os # For file path manipulation and directory management
import cv2  # type: ignore # For image and video processing
import json  # For handling JSON data
import base64  # For encoding video frames as base64 strings
import numpy as np  # For numerical operations
from flask import Flask, request, jsonify, send_file, send_from_directory  # For server and request handling
from flask_socketio import SocketIO  # For enabling WebSockets for real-time streaming
from flask_cors import CORS  # For allowing cross-origin requests

# Initialize Flask application and enable CORS
app = Flask(__name__)  # Create a Flask app instance
CORS(app)  # Allow cross-origin requests for all routes
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSockets and allow all origins to connect

# Set up directories for uploads and results
UPLOAD_FOLDER = 'uploads'  # Directory to store uploaded files
RESULTS_FOLDER = 'results'  # Directory to store processed results
if not os.path.exists(UPLOAD_FOLDER):  # Check if the upload folder exists
    os.makedirs(UPLOAD_FOLDER)  # Create the upload folder if it does not exist

# YOLO model setup
model_weights = 'project_files/yolov4_tiny.weights'  # Path to YOLO weights file
model_config = 'project_files/yolov4_tiny.cfg'  # Path to YOLO configuration file
classes_file = 'project_files/obj.names'  # Path to file containing class names

# Check if YOLO files exist
if not all(os.path.exists(file) for file in [model_weights, model_config, classes_file]):  # Ensure all required files exist
    raise FileNotFoundError("YOLO model files are missing! Ensure 'project_files/' has all required files.")

# Load YOLO model
net = cv2.dnn.readNet(model_weights, model_config)  # Load YOLO model weights and configuration
model = cv2.dnn_DetectionModel(net)  # Create detection model from network
model.setInputParams(scale=1 / 255, size=(416, 416), swapRB=True)  # Set input parameters for YOLO model

# Load class names
with open(classes_file, 'r') as f:  # Open file containing class names
    classes = f.read().strip().splitlines()  # Read and split class names into a list

# Initialize webcam for real-time detection
camera = cv2.VideoCapture(0)  # Open default webcam

# Function to process a single frame with YOLO ( Base Function for detection pothole)
def process_frame_yolo(frame):
    class_ids, scores, boxes = model.detect(frame, confThreshold=0.6, nmsThreshold=0.4)  # Detect objects in the frame
    for (class_id, score, box) in zip(class_ids, scores, boxes):  # Loop through detected objects
        cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), (0, 255, 0), 2)  # Draw bounding box
        label = f"{classes[class_id]}: {score:.2f}"  # Create label with class name and confidence score
        cv2.putText(frame, label, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)  # Draw label
    return frame  # Return processed frame

# Function to process and save an image

def process_image(image_path):
    img = cv2.imread(image_path)  # Read the input image
    if img is None:  # Check if image was loaded successfully
        raise ValueError(f"Failed to read image: {image_path}")  # Raise error if image loading fails
    processed_img = process_frame_yolo(img)  # Process image with YOLO
    output_path = os.path.join(UPLOAD_FOLDER, 'output_image.jpg')  # Define path for the output image
    cv2.imwrite(output_path, processed_img)  # Save the processed image
    return output_path  # Return path to processed image

# Function to process a video file frame-by-frame

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)  # Open video file
    if not cap.isOpened():  # Check if video was successfully opened
        raise ValueError(f"Failed to open video: {video_path}")  # Raise error if video loading fails

    output_path = os.path.join(UPLOAD_FOLDER, 'output_video.mp4')  # Define path for output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Define codec for output video
    out = cv2.VideoWriter(output_path, fourcc, cap.get(cv2.CAP_PROP_FPS), (int(cap.get(3)), int(cap.get(4))))  # Create video writer

    while cap.isOpened():  # Loop through video frames
        ret, frame = cap.read()  # Read a frame from video
        if not ret:  # Break loop if no frame is returned
            break
        processed_frame = process_frame_yolo(frame)  # Process frame with YOLO
        out.write(processed_frame)  # Write processed frame to output video

    cap.release()  # Release video capture
    out.release()  # Release video writer
    return output_path  # Return path to processed video

# Route to upload and process image
@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:  # Check if image file is in the request
        return jsonify({'message': 'No image provided'}), 400  # Return error if no image is provided
    file = request.files['image']  # Get the image file from request
    image_path = os.path.join(UPLOAD_FOLDER, file.filename)  # Save image to upload folder
    file.save(image_path)  # Save image file
    try: # Error handling
        processed_path = process_image(image_path)  # Process image
        return send_file(processed_path, mimetype='image/jpeg')  # Send processed image as response
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return error if processing fails

# Route to upload and process video
@app.route('/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:  # Check if video file is in the request
        return jsonify({'message': 'No video provided'}), 400  # Return error if no video is provided
    file = request.files['video']  # Get the video file from request
    video_path = os.path.join(UPLOAD_FOLDER, file.filename)  # Save video to upload folder
    file.save(video_path)  # Save video file
    try: # Exceptioon handling for failure
        processed_path = process_video(video_path)  # Process video
        return send_file(processed_path, mimetype='video/mp4')  # Send processed video as response
    except Exception as e:  # Returns error message
        return jsonify({'error': str(e)}), 500  # Return error if processing fails


# Process each frame from live camera
def generate_processed_frames():
    """Capture, process, and emit video frames."""
    while True: # Continous frame detection 
        success, frame = camera.read() # Reads frames through camera
        if not success: # If no camera device is detected
            print("Failed to capture video frame")
            break # Stops the Frame detection

        # Process the frame using YOLO
        processed_frame = process_frame_yolo(frame)

        # Encode processed frame as JPEG
        _, buffer = cv2.imencode('.jpg', processed_frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        # Emit the processed frame to the frontend
        socketio.emit('video_stream', {'frame': frame_base64})

        # Add delay to control frame rate (30 FPS)
        socketio.sleep(0.03)


# Connects with frontend throgh socket io (Camera as device)
@socketio.on('start_stream')
def start_stream():
    """Handle start streaming event."""
    generate_processed_frames()

# Function to handle connection out of socket disconnection/ failure
@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnect."""
    print("Client disconnected")

# Route for checking/testing the working of backend 
@app.route('/')
def index():
    # Return this message to Frontend
    return "Flask YOLO Backend is Running!"

# Main function to run the backend applcation 
if __name__ == '__main__':
    # Runs the app in 5000 port in host network
    # 0.0.0.0 -> Indicates as a network server
    app.run(host="0.0.0.0", port=5000) # opens in http://localhost:5000 or network


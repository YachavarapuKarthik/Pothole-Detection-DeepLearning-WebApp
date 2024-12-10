import os
import cv2
import json
import base64
import numpy as np
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS

# Flask setup
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Ensure directories exist
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# YOLO Model setup
model_weights = 'project_files/yolov4_tiny.weights'
model_config = 'project_files/yolov4_tiny.cfg'
classes_file = 'project_files/obj.names'

if not all(os.path.exists(file) for file in [model_weights, model_config, classes_file]):
    raise FileNotFoundError("YOLO model files are missing! Ensure 'project_files/' has all required files.")

net = cv2.dnn.readNet(model_weights, model_config)
model = cv2.dnn_DetectionModel(net)
model.setInputParams(scale=1 / 255, size=(416, 416), swapRB=True)

# Load class names
with open(classes_file, 'r') as f:
    classes = f.read().strip().splitlines()

# Initialize webcam
camera = cv2.VideoCapture(0)
#camera = cv2.VideoCapture('http://192.168.1.7:8080/video')

def process_frame_yolo(frame):
    """Process a single frame with YOLO object detection."""
    class_ids, scores, boxes = model.detect(frame, confThreshold=0.6, nmsThreshold=0.4)
    for (class_id, score, box) in zip(class_ids, scores, boxes):
        cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), (0, 255, 0), 2)
        label = f"{classes[class_id]}: {score:.2f}"
        cv2.putText(frame, label, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    return frame


def process_image(image_path):
    """Process an image and apply object detection."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Failed to read image: {image_path}")
    processed_img = process_frame_yolo(img)
    output_path = os.path.join(UPLOAD_FOLDER, 'output_image.jpg')
    cv2.imwrite(output_path, processed_img)
    return output_path


def process_video(video_path):
    """Process a video and apply object detection frame by frame."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Failed to open video: {video_path}")

    output_path = os.path.join(UPLOAD_FOLDER, 'output_video.mp4')
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, cap.get(cv2.CAP_PROP_FPS), (int(cap.get(3)), int(cap.get(4))))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        processed_frame = process_frame_yolo(frame)
        out.write(processed_frame)

    cap.release()
    out.release()
    return output_path


@app.route('/upload-image', methods=['POST'])
def upload_image():
    """Handle image uploads and return processed output."""
    if 'image' not in request.files:
        return jsonify({'message': 'No image provided'}), 400
    file = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(image_path)
    try:
        processed_path = process_image(image_path)
        return send_file(processed_path, mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/upload-video', methods=['POST'])
def upload_video():
    """Handle video uploads and return processed output."""
    if 'video' not in request.files:
        return jsonify({'message': 'No video provided'}), 400
    file = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(video_path)
    try:
        processed_path = process_video(video_path)
        return send_file(processed_path, mimetype='video/mp4')
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route('/upload-video', methods=['POST'])
# def upload_video():
#     """Handle video uploads and return processed output."""
#     if 'video' not in request.files:
#         return jsonify({'message': 'No video provided'}), 400
#
#     file = request.files['video']
#     video_path = os.path.join(UPLOAD_FOLDER, file.filename)
#     file.save(video_path)
#
#     try:
#         # Process the video and get the processed file name
#         processed_filename = process_video(video_path)
#
#         # Send the processed video using send_from_directory
#         return send_from_directory(RESULTS_FOLDER, processed_filename, mimetype='video/mp4')
#
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


def generate_processed_frames():
    """Capture, process, and emit video frames."""
    while True:
        success, frame = camera.read()
        if not success:
            print("Failed to capture video frame")
            break

        # Process the frame using YOLO
        processed_frame = process_frame_yolo(frame)

        # Encode processed frame as JPEG
        _, buffer = cv2.imencode('.jpg', processed_frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        # Emit the processed frame to the frontend
        socketio.emit('video_stream', {'frame': frame_base64})

        # Add delay to control frame rate (30 FPS)
        socketio.sleep(0.03)


@socketio.on('start_stream')
def start_stream():
    """Handle start streaming event."""
    generate_processed_frames()


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnect."""
    print("Client disconnected")


@app.route('/')
def index():
    return "Flask YOLO Backend is Running!"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)


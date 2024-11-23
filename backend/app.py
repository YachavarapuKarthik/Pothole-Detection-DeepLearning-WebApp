import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

# Ensure directories exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load YOLO model
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


def process_image(image_path):
    """Process an image and apply object detection."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Failed to read image: {image_path}")

    class_ids, scores, boxes = model.detect(img, confThreshold=0.6, nmsThreshold=0.4)
    for (class_id, score, box) in zip(class_ids, scores, boxes):
        cv2.rectangle(img, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), (0, 255, 0), 2)
        label = f"{classes[class_id]}: {score:.2f}"
        cv2.putText(img, label, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    output_path = 'output_image.jpg'
    cv2.imwrite(output_path, img)
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


def process_video(video_path):
    """Process a video and apply object detection frame by frame."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Failed to open video: {video_path}")

    output_path = 'output_video.mp4'
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, cap.get(cv2.CAP_PROP_FPS), (int(cap.get(3)), int(cap.get(4))))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        class_ids, scores, boxes = model.detect(frame, confThreshold=0.6, nmsThreshold=0.4)
        for (class_id, score, box) in zip(class_ids, scores, boxes):
            cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), (0, 255, 0), 2)
            label = f"{classes[class_id]}: {score:.2f}"
            cv2.putText(frame, label, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        out.write(frame)

    cap.release()
    out.release()
    return output_path


@app.route('/upload-video', methods=['POST'])
def upload_video():
    try:
        if 'video' not in request.files:
            return jsonify({'message': 'No video provided'}), 400

        file = request.files['video']
        video_path = os.path.join(UPLOAD_FOLDER, file.filename)

        # Save the video file
        file.save(video_path)
        print(f"Video saved at: {video_path}")

        # Process the video
        processed_path = process_video(video_path)
        print(f"Processed video saved at: {processed_path}")
        print("Completed processing all")
        # Serve the processed video as a response
        return send_file(processed_path, mimetype='video/mp4')

    except Exception as e:
        print(f"Error processing video: {e}")
        return jsonify({'message': 'Error processing video', 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)

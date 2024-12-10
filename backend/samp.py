# from flask import Flask, jsonify
# from flask_socketio import SocketIO, send, emit
#
# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")
#
# @app.route('/')
# def index():
#     print("Home")
#     return jsonify(message="Server is running")
#
# @socketio.on('message')
# def handle_message(message):
#     print(f"Received message: {message}")
#     send("Hello from the server")
#
# @socketio.on('connect')
# def handle_connect():
#     print("Client connected")
#     emit("message", "Welcome to the server!")
#
# @socketio.on('disconnect')
# def handle_disconnect():
#     print("Client disconnected")
#
# if __name__ == '__main__':
#     socketio.run(app, host="0.0.0.0", port=5000)
import os

# from flask import Flask, request, jsonify
# import cv2
#
# app = Flask(__name__)
#
# @app.route('/detect', methods=['POST'])
# def detect():
#   # data = request.get_json()
#   # image_data = data['image']
#   # # Decode the image data and process it using OpenCV
#   # # ..
#   print('Frame found')
#   return jsonify({'message': 'Frame processed successfully'})
#
# if __name__ == '__main__':
#   app.run(debug=True)


# from flask import Flask, request, jsonify, Response
# from flask_cors import CORS
# import cv2
# import numpy as np
# import base64
# from imutils.video import VideoStream
#
# app = Flask(__name__)
# CORS(app)
#
# # ... (existing YOLO model loading and class names)
# # Ensure directories exist
# UPLOAD_FOLDER = 'uploads'
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)
#
# # Load YOLO model
# model_weights = 'project_files/yolov4_tiny.weights'
# model_config = 'project_files/yolov4_tiny.cfg'
# classes_file = 'project_files/obj.names'
#
# if not all(os.path.exists(file) for file in [model_weights, model_config, classes_file]):
#     raise FileNotFoundError("YOLO model files are missing! Ensure 'project_files/' has all required files.")
#
# net = cv2.dnn.readNet(model_weights, model_config)
# model = cv2.dnn_DetectionModel(net)
# model.setInputParams(scale=1 / 255, size=(416, 416), swapRB=True)
#
# # Load class names
# with open(classes_file, 'r') as f:
#     classes = f.read().strip().splitlines()
#
# def process_frame(frame_data):
#     # Decode base64 data
#     decoded_bytes = base64.b64decode(frame_data)
#     frame = cv2.imdecode(np.fromstring(decoded_bytes, np.uint8), cv2.IMREAD_COLOR)
#
#     # Object detection logic
#     class_ids, scores, boxes = model.detect(frame, confThreshold=0.6, nmsThreshold=0.4)
#     for (class_id, score, box) in zip(class_ids, scores, boxes):
#         if classes[class_id] == "pothole":  # Assuming "pothole" is the class name
#             cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), (0, 0, 255), 2)
#             label = f"Pothole: {score:.2f}"
#             cv2.putText(frame, label, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
#
#     # Encode processed frame
#     retval, buffer = cv2.imencode('.jpg', frame)
#     processed_data = base64.b64encode(buffer).decode('utf-8')
#     return processed_data
#
# def get_video_stream():
#     vs = VideoStream(src=0).start()  # Replace 0 with your video source (e.g., webcam index)
#     while True:
#         frame = vs.read()
#         if frame is None:
#             break
#         processed_frame_data = process_frame(base64.b64encode(frame).decode('utf-8'))
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + processed_frame_data + b'\r\n')
#
# @app.route('/video-stream')
# def video_stream():
#     return Response(get_video_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')
#
# if __name__ == '__main__':
#     app.run(debug=True)

# from flask import Flask
# from flask_socketio import SocketIO
# import cv2
# import base64
# import time
#
# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")
#
# # Initialize the webcam
# camera = cv2.VideoCapture(0)
#
# @app.route('/')
# def index():
#     return "Flask Backend is Running!"
#
# # Start frame generation
# def generate_frames():
#     """Continuously capture frames from the webcam and emit them."""
#     while True:
#         # Capture frame from webcam
#         success, frame = camera.read()
#         if not success:
#             print("Failed to capture video frame")
#             break
#
#         # Encode frame as JPEG
#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_base64 = base64.b64encode(buffer).decode('utf-8')
#
#         # Emit frame to the frontend
#         socketio.emit('video_stream', {'frame': frame_base64})
#
#         # Add delay to control frame rate (30 FPS)
#         time.sleep(0.03)
#
# @socketio.on('start_stream')
# def start_stream():
#     """Start streaming video to the connected client."""
#     generate_frames()
#
# @socketio.on('disconnect')
# def handle_disconnect():
#     """Handle client disconnection."""
#     print("Client disconnected")
#
# if __name__ == '__main__':
#     if not camera.isOpened():
#         print("Error: Webcam not accessible")
#     else:
#         print("Starting video stream...")
#         socketio.run(app, host="0.0.0.0", port=5000)

# import cv2
# import base64
# import os
# from flask import Flask
# from flask_socketio import SocketIO
# from flask_cors import CORS
#
# # Flask setup
# app = Flask(__name__)
# CORS(app)
# socketio = SocketIO(app, cors_allowed_origins="*")
#
# # YOLO Model setup
# model_weights = 'project_files/yolov4_tiny.weights'
# model_config = 'project_files/yolov4_tiny.cfg'
# classes_file = 'project_files/obj.names'
#
# if not all(os.path.exists(file) for file in [model_weights, model_config, classes_file]):
#     raise FileNotFoundError("YOLO model files are missing! Ensure 'project_files/' has all required files.")
#
# net = cv2.dnn.readNet(model_weights, model_config)
# model = cv2.dnn_DetectionModel(net)
# model.setInputParams(scale=1 / 255, size=(416, 416), swapRB=True)
#
# # Load class names
# with open(classes_file, 'r') as f:
#     classes = f.read().strip().splitlines()
#
# # Initialize webcam
# camera = cv2.VideoCapture(0)
#
#
# def process_frame_yolo(frame):
#     """Process a single frame with YOLO object detection."""
#     class_ids, scores, boxes = model.detect(frame, confThreshold=0.6, nmsThreshold=0.4)
#     for (class_id, score, box) in zip(class_ids, scores, boxes):
#         cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), (0, 255, 0), 2)
#         label = f"{classes[class_id]}: {score:.2f}"
#         cv2.putText(frame, label, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
#     return frame
#
#
# @app.route('/')
# def index():
#     return "Flask YOLO Backend is Running!"
#
#
# def generate_processed_frames():
#     """Capture, process, and emit video frames."""
#     while True:
#         success, frame = camera.read()
#         if not success:
#             print("Failed to capture video frame")
#             break
#
#         # Process the frame using YOLO
#         processed_frame = process_frame_yolo(frame)
#
#         # Encode processed frame as JPEG
#         _, buffer = cv2.imencode('.jpg', processed_frame)
#         frame_base64 = base64.b64encode(buffer).decode('utf-8')
#
#         # Emit the processed frame to the frontend
#         socketio.emit('video_stream', {'frame': frame_base64})
#
#         # Add delay to control frame rate (30 FPS)
#         socketio.sleep(0.03)
#
#
# @socketio.on('start_stream')
# def start_stream():
#     """Handle start streaming event."""
#     generate_processed_frames()
#
#
# @socketio.on('disconnect')
# def handle_disconnect():
#     """Handle client disconnect."""
#     print("Client disconnected")
#
#
# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', port=5000)

# from flask import Flask, send_from_directory
# import os
#
# app = Flask(__name__)
#
# # Directory where videos are saved
# PROCESSED_FOLDER = os.path.join(app.root_path, 'static/processed_videos')
#
# @app.route('/video/<filename>')
# def serve_video(filename):
#     # Send the video file from the specified directory
#     return send_from_directory(PROCESSED_FOLDER, filename)
#
# if __name__ == "__main__":
#     app.run(debug=True)
#



from flask import Flask, send_from_directory

app = Flask(__name__)

# Serve the specific video file 'tested.mp4'
@app.route('/api/video/tested')
def serve_tested_video():
    return send_from_directory('uploads', 'tested.mp4')

if __name__ == '__main__':
    app.run(debug=True)

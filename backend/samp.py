from flask import Flask, jsonify
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    print("Home")
    return jsonify(message="Server is running")

@socketio.on('message')
def handle_message(message):
    print(f"Received message: {message}")
    send("Hello from the server")

@socketio.on('connect')
def handle_connect():
    print("Client connected")
    emit("message", "Welcome to the server!")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)

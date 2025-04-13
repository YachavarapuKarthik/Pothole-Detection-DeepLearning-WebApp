// Create video element
const video = document.createElement('video');
video.autoplay = true;
video.playsInline = true;
video.style.width = '320px';
video.style.height = '240px';
document.body.appendChild(video);

// Create canvas for snapshot
const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
canvas.style.display = 'none';
document.body.appendChild(canvas);

// Create image element to show captured photo
const img = document.createElement('img');
img.style.marginTop = '10px';
document.body.appendChild(img);

// Create button to capture photo
const button = document.createElement('button');
button.textContent = '📸 Take Photo';
button.style.display = 'block';
button.style.marginTop = '10px';
document.body.appendChild(button);

// Start webcam stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Error accessing webcam:', err);
    alert('Could not access webcam.');
  });

// Capture and show photo on button click
button.onclick = () => {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  img.src = canvas.toDataURL('image/png');
};

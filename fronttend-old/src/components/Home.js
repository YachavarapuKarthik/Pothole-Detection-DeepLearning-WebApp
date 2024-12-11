import React from 'react';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            {/* Header Section */}
            <header className="home-header">
                <h1>Pothole Detection System</h1>
                <p>Accurate, Efficient, and Real-Time Detection System</p>
            </header>

            {/* About Section */}
            <section className="about-section">
                <h2>About the Project</h2>
                <p>
                    This system aims to improve road safety by detecting potholes through 
                    advanced image, video, and real-time analysis. Join us in making roads safer!
                </p>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Key Features</h2>
                <ul>
                    <li>Image-Based Pothole Detection</li>
                    <li>Video Analysis for Dynamic Scenarios</li>
                    <li>Real-Time Monitoring and Alerts</li>
                </ul>
            </section>

            {/* Navigation Section */}
            <section className="navigation">
                <h2>Explore the System</h2>
                <div className="nav-buttons">
                    <button onClick={() => window.location.href = '/image-detection'}>Image Detection</button>
                    <button onClick={() => window.location.href = '/video-detection'}>Video Detection</button>
                    <button onClick={() => window.location.href = '/real-time-detection'}>Real-Time Detection</button>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="home-footer">
                <p>&copy; 2024 Developed by [Your Team Name]. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;

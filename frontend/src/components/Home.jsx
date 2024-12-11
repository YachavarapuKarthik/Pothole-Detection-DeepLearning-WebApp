import React from 'react';  // Import React to be able to use JSX and React features
import './Home.css';  // Import the CSS file for styling the Home component

// Functional component to render the Home page
function Home() {
    return (
        // The main container for the home page
        <div className="home-container">
        
            {/* Header Section */}
            <header className="home-header">
                {/* Title of the project */}
                <h1>Pothole Detection System</h1>
                {/* Description of the system */}
                <p>Accurate, Efficient, and Real-Time Detection System</p>
            </header>

            {/* About Section */}
            <section className="about-section">
                {/* Title for the About section */}
                <h2>About the Project</h2>
                {/* Paragraph describing the aim of the pothole detection system */}
                <p>
                    This system aims to improve road safety by detecting potholes through 
                    advanced image, video, and real-time analysis. Join us in making roads safer!
                </p>
            </section>

            {/* Features Section */}
            <section className="features">
                {/* Title for the Key Features section */}
                <h2>Key Features</h2>
                {/* List of key features of the pothole detection system */}
                <ul>
                    <li>Image-Based Pothole Detection</li>
                    <li>Video Analysis for Dynamic Scenarios</li>
                    <li>Real-Time Monitoring and Alerts</li>
                </ul>
            </section>

            {/* Navigation Section */}
            <section className="navigation">
                {/* Title for the Explore section */}
                <h2>Explore the System</h2>
                {/* Navigation buttons to guide the user to different features of the system */}
                <div className="nav-buttons">
                    {/* Button to navigate to Image Detection page */}
                    <button onClick={() => window.location.href = '/image-detection'}>Image Detection</button>
                    {/* Button to navigate to Video Detection page */}
                    <button onClick={() => window.location.href = '/video-detection'}>Video Detection</button>
                    {/* Button to navigate to Real-Time Detection page */}
                    <button onClick={() => window.location.href = '/live-detection'}>Real-Time Detection</button>
                </div>
            </section>

            {/* Footer Section */}
            {/* This section is empty in the current code, but it can be used for copyright information, 
                 additional links, or other footer content */}
        </div>
    );
}

// Export the Home component to be used in other parts of the application
export default Home;
import React from 'react';  // Import React to be able to use JSX and React features
import './Home.css';  // Import the CSS file for styling the Home component

// Functional component to render the Home page
function Home() {
    return (
        // The main container for the home page
        <div className="home-container">
        
            {/* Header Section */}
            <header className="home-header">
                {/* Title of the project */}
                <h1>Pothole Detection System</h1>
                {/* Description of the system */}
                <p>Accurate, Efficient, and Real-Time Detection System</p>
            </header>

            {/* About Section */}
            <section className="about-section">
                {/* Title for the About section */}
                <h2>About the Project</h2>
                {/* Paragraph describing the aim of the pothole detection system */}
                <p>
                    This system aims to improve road safety by detecting potholes through 
                    advanced image, video, and real-time analysis. Join us in making roads safer!
                </p>
            </section>

            {/* Features Section */}
            <section className="features">
                {/* Title for the Key Features section */}
                <h2>Key Features</h2>
                {/* List of key features of the pothole detection system */}
                <ul>
                    <li>Image-Based Pothole Detection</li>
                    <li>Video Analysis for Dynamic Scenarios</li>
                    <li>Real-Time Monitoring and Alerts</li>
                </ul>
            </section>

            {/* Navigation Section */}
            <section className="navigation">
                {/* Title for the Explore section */}
                <h2>Explore the System</h2>
                {/* Navigation buttons to guide the user to different features of the system */}
                <div className="nav-buttons">
                    {/* Button to navigate to Image Detection page */}
                    <button onClick={() => window.location.href = '/image-detection'}>Image Detection</button>
                    {/* Button to navigate to Video Detection page */}
                    <button onClick={() => window.location.href = '/video-detection'}>Video Detection</button>
                    {/* Button to navigate to Real-Time Detection page */}
                    <button onClick={() => window.location.href = '/live-detection'}>Real-Time Detection</button>
                </div>
            </section>

            {/* Footer Section */}
            {/* This section is empty in the current code, but it can be used for copyright information, 
                 additional links, or other footer content */}
        </div>
    );
}

// Export the Home component to be used in other parts of the application
export default Home;

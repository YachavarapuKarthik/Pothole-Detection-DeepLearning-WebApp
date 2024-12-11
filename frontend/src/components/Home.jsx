import React from 'react'; // No need for useEffect or useState as animation is removed
import './Home.css'; // Import the CSS file for styling the Home component
import PotholeSvg from "../assests/potholes_svg.svg";

// Functional component to render the Home page
function Home() {
    const fullText = "Be safe with potholes"; // Static text to be displayed

    return (
        <div className="home-container">
            {/* Highlight Section */}
            <section className="highlight-section">
                <div className="highlight-text">
                    <h1 className="static-text">{fullText}</h1> {/* Static text */}
                </div>
                <div className="highlight-image">
                    {/* Placeholder for the SVG (replace with actual SVG or an <img> tag) */}
                    <img src={PotholeSvg} alt="Pothole Detection SVG" className="highlight-svg" />
                </div>
            </section>

            {/* About and Features Section */}
            <section className="about-features-container">
                <div className="about-section">
                    <h2>About the Project</h2>
                    <p style={{ fontSize: '1.3rem' }}>
                        This system aims to improve road safety by detecting potholes through 
                        advanced image, video, and real-time analysis. Join us in making roads safer!
                    </p>
                </div>
                <div className="features">
                    <h2>Key Features</h2>
                    <ul>
                        <li>Image-Based Pothole Detection</li>
                        <li>Video Analysis for Dynamic Scenarios</li>
                        <li>Real-Time Monitoring and Alerts</li>
                    </ul>
                </div>
            </section>

            {/* Explore the System Section */}
            <section className="navigation">
                <h2>Explore the System</h2>
                <div className="nav-buttons">
                    <button onClick={() => window.location.href = '/image-detection'}>Image Detection</button>
                    <button onClick={() => window.location.href = '/video-detection'}>Video Detection</button>
                    <button onClick={() => window.location.href = '/live-detection'}>Real-Time Detection</button>
                </div>
            </section>
        </div>
    );
}

export default Home;

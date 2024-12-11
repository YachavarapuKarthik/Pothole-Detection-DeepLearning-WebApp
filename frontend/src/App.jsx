import React from 'react';  // Import the React library to use JSX and other React features
import NavBar from './components/NavBar';  // Import the NavBar component for the website's navigation bar
import Home from './components/Home';  // Import the Home component, which will be displayed at the root URL
import ImageDetection from './components/ImageDetection';  // Import the ImageDetection component to be displayed for image detection functionality
import VideoDetection from './components/VideoDetection';  // Import the VideoDetection component to be displayed for video detection functionality
import RealTimeDetection from './components/RealTimeDetection';  // Import the RealTimeDetection component for live detection functionality
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import React Router components to handle routing between different pages
import './App.css';  // Import the CSS file for styling the components
import Footer from './components/Footer';

// The App component is the root component for the application
const App = () => {
  return (
    // Router component provides the routing context for the entire application
    <Router>
      {/* The NavBar component will be displayed on all pages of the app */}
      <NavBar />

      {/* Routes component defines the different routes and maps them to specific components */}
      <Routes>
        {/* Route for the home page, which is displayed at the root URL "/" */}
        <Route path="/" element={<Home />} />

        {/* Route for image detection, accessible at "/image-detection" */}
        <Route path="/image-detection" element={<ImageDetection />} />

        {/* Route for video detection, accessible at "/video-detection" */}
        <Route path="/video-detection" element={<VideoDetection />} />

        {/* Route for live detection, accessible at "/live-detection" */}
        <Route path="/live-detection" element={<RealTimeDetection />} />
      </Routes>
      <Footer/>
    </Router>
    
  );
};

// Export the App component so that it can be used in other parts of the application
export default App;

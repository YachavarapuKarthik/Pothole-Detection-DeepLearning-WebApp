import React, { useState } from 'react';  // Import React and useState hook for state management
import { Link } from 'react-router-dom';  // Import Link from react-router-dom to navigate between pages
import './NavBar.css';  // Import custom CSS for styling the NavBar

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);  // State to track whether the mobile menu is open or closed

  // Toggle the menu's open/closed state when the hamburger icon is clicked
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the menu when a link is clicked
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="navbar">  {/* Main container for the navbar */}
      <div className="navin">  {/* Inner container to hold logo, links, and hamburger icon */}
        <div className="logo">Pothole Detector</div>  {/* Display the logo text */}
        
        {/* Links container with dynamic class based on menu state */}
        <div className={`links ${isOpen ? 'open' : ''}`}>
          {/* Navigation links to different pages with onClick to close the menu */}
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/image-detection" onClick={closeMenu}>Image Detection</Link>
          <Link to="/video-detection" onClick={closeMenu}>Video Detection</Link>
          <Link to="/live-detection" onClick={closeMenu}>Real Time Detection</Link>
        </div>

        {/* Hamburger icon for mobile navigation, toggles the menu */}
        <div className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Unicode character for hamburger icon */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;  // Export the NavBar component to be used in other parts of the application

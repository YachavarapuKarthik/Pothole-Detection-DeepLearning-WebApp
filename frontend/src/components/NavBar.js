import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar">
      <div className="navin">
        <div className="logo">Logo</div>
        <div className={`links ${isOpen ? 'open' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/image-detection">Image Detection</Link>
          <Link to="/video-detection">Video Detection</Link>
          <Link to="/real-time-detection">Real Time Detection</Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;

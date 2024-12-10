import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navin">
        <div className="logo">Pothole</div>
        <div className={`links ${isOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/image-detection" onClick={closeMenu}>Image Detection</Link>
          <Link to="/video-detection" onClick={closeMenu}>Video Detection</Link>
          <Link to="/live-detection" onClick={closeMenu}>Real Time Detection</Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;

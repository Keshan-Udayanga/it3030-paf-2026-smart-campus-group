import React, { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
  <div className="container navbar-container">

    {/* LEFT - LOGO */}
    <div className="navbar-logo">
      <img src="/assets/logo.png" alt="Brand Logo" />
    </div>

    {/* CENTER - MENU */}
    <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
      <a href="#home" className="nav-link" onClick={toggleMenu}>Home</a>
      <a href="#features" className="nav-link" onClick={toggleMenu}>Ticket</a>
      <a href="#services" className="nav-link" onClick={toggleMenu}>Resources</a>
      <a href="#services" className="nav-link" onClick={toggleMenu}>Services</a>
      <a href="#contact" className="nav-link" onClick={toggleMenu}>Contact Us</a>
    </div>

    {/* RIGHT - LOGIN BUTTON */}
    <div className="navbar-actions">
      <button className="login-btn">Login</button>
    </div>

    {/* HAMBURGER */}
    <div className="hamburger" onClick={toggleMenu}>
      <span className={`bar ${isOpen ? 'active' : ''}`}></span>
      <span className={`bar ${isOpen ? 'active' : ''}`}></span>
      <span className={`bar ${isOpen ? 'active' : ''}`}></span>
    </div>

  </div>
</nav>
  );
};

export default NavBar;
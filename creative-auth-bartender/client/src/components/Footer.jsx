import React from 'react';
import "../styles/Footer.css";

import WhiteLogo from "../assets/WhiteLogo.svg";
import InstaVector from "../assets/Insta-Vector.svg";
import FacebookVector from "../assets/Facebook-Vector.svg";
import YouTubeVector from "../assets/YouTube-Vector.svg";

const Footer = () => {
  return (
    <div className="footer">
        <div className="footer-logo">
            <img src={WhiteLogo} alt="Logo" className="footer-logo-image" />
        </div>
      <div className="footer-content">
        <h3>Long Necks, Strong Drinks</h3>
        <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#store">Store</a>
            <a href="#contact">Contact Us</a>
        </div>
      </div>
      <div className="footer-socials">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <img src={InstaVector} alt="Instagram" className="social-icon" id='Insta' />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <img src={FacebookVector} alt="Facebook" className="social-icon" id='Facebook' />
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
            <img src={YouTubeVector} alt="YouTube" className="social-icon" id='YouTube' />
          </a>
        </div>
</div>
    </div>
  );
}
export default Footer;
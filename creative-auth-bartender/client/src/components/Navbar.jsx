import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import LogoNoText from "../assets/Logo-no-text.svg";

export default function Navbar({ onLoginClick, showLogin = true, showProfile = false, onProfileClick, profilePic }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={LogoNoText} alt="Logo" className="logo" />
        <h3>The Drunken Giraffe</h3>
      </div>

      <div className="navLinksMiddle">
        <a href="/landing-page" className={location.pathname === "/landing-page" ? "active" : ""}>
          Home
        </a>
        <a href="/about" className={location.pathname === "/about" ? "active" : ""}>
          About
        </a>
        <a href="/store" className={location.pathname === "/store" ? "active" : ""}>
          Store
        </a>
      </div>

      <div className="navLinksRight">
  <div className="cart-icon" style={{ position: "relative", marginTop: "8px", cursor: "pointer" }}>
    <a href="/cart">
      <FaShoppingCart size={24} />
      {/* ...cart count badge if needed... */}
    </a>
  </div>
{showProfile && (
  <button
    className="navbar-profile-btn"
    onClick={onProfileClick}
    style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content' }}
  >
    {profilePic && (
      <img
        src={profilePic}
        alt="Profile"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #e1bb3e'
        }}
      />
    )}
    {/* Show username instead of "Profile" */}
    {typeof showProfile === "string" ? showProfile : (window.localStorage.getItem('loggedInUser') ? JSON.parse(window.localStorage.getItem('loggedInUser')).username : "Profile")}
  </button>
)}
  {!showProfile && showLogin && (
    <button className="navbar-login-btn" onClick={onLoginClick}>
      Login
    </button>
  )}
</div>
    </nav>
  );
};

import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import "../styles/Navbar.css";
import LogoNoText from "../assets/Logo-no-text.svg";
import { useCart } from "../context/CartContext"; // Import CartContext

export default function Navbar({ onLoginClick, showLogin = true, showProfile = false, onProfileClick, profilePic }) {
  const location = useLocation();
  const { cartItems } = useCart(); // Get cart items

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={LogoNoText} alt="Logo" className="logo" />
        <h3>The Drunken Giraffe</h3>
      </div>

      <div className="navLinksMiddle">
        <Link to="/landing-page" className={location.pathname === "/landing-page" ? "active" : ""}>
          Home
        </Link>
        <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
          About
        </Link>
        <Link to="/store" className={location.pathname === "/store" ? "active" : ""}>
          Store
        </Link>
      </div>

      <div className="navLinksRight">
        <div className="cart-icon" style={{ position: "relative", marginTop: "8px", cursor: "pointer" }}>
          <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
            <FaShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>
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
}

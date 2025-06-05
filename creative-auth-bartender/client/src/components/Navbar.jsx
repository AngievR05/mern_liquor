import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import LogoNoText from "../assets/Logo-no-text.svg";
import { useCart } from "../context/CartContext"; // Cart context

export default function Navbar({ onLoginClick, showLogin, showProfile, onProfileClick, profilePic }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Resolve uploaded image paths correctly from /uploads
  const getProfileImageSrc = (src) => {
    if (!src) return null;
    if (src.startsWith("/uploads")) {
      return `${process.env.PUBLIC_URL}${src}`; // for local static access
    }
    return src;
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={LogoNoText} alt="Logo" className="logo" />
        <h3>The Drunken Giraffe</h3>
      </div>

      <div className="navLinksMiddle">
        <Link
          to="/landing-page"
          className={location.pathname === "/landing-page" ? "active" : ""}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={location.pathname === "/about" ? "active" : ""}
        >
          About
        </Link>
        <Link
          to="/store"
          className={location.pathname === "/store" ? "active" : ""}
        >
          Store
        </Link>
      </div>

      <div className="navLinksRight">
        <div
          className="cart-icon"
          style={{ position: "relative", marginTop: "8px", cursor: "pointer" }}
        >
          <Link
            to="/cart"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <FaShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>
        </div>

        {showLogin !== false && (
          <button
            className="login-btn"
            onClick={onLoginClick}
            style={{
              marginLeft: 16,
              background: '#9b1c23',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        )}
        {showProfile && (
          <button
            className="profile-btn"
            onClick={onProfileClick}
            style={{
              marginLeft: 16,
              background: 'none',
              border: 'none',
              borderRadius: '50%',
              padding: 0,
              cursor: 'pointer'
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e1bb3e'
                }}
              />
            ) : (
              <span
                style={{
                  display: 'inline-block',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#eee',
                  color: '#9b1c23',
                  fontWeight: 700,
                  fontSize: 18,
                  textAlign: 'center',
                  lineHeight: '36px',
                  border: '2px solid #e1bb3e'
                }}
              >
                U
              </span>
            )}
          </button>
        )}
        <button
          className="become-seller-btn"
          style={{
            marginLeft: 16,
            background: "#e1bb3e",
            color: "#350b0f",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => {
            // You can navigate to a seller registration page or show a modal
            navigate("/become-seller");
          }}
        >
          Become a Seller
        </button>
      </div>
    </nav>
  );
}

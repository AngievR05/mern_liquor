import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import LogoNoText from "../assets/Logo-no-text.svg";

const Navbar = ({ onLoginClick, cartCount = 0 }) => {
  const location = useLocation();

  return (
    <nav>
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
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLoginClick && onLoginClick();
          }}
        >
          Login
        </a>
        <div className="cart-icon" style={{ position: "relative", marginTop: "8px", cursor: "pointer" }}>
          <a href="/cart">
            <FaShoppingCart size={24} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#e35537',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

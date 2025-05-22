import React from "react";
import { FaShoppingCart } from "react-icons/fa";  // Import cart icon
import "../styles/Navbar.css";
import LogoNoText from "../assets/Logo-no-text.svg";
const Navbar = ({ onLoginClick }) => {
  return (
    <nav>
      <div className="logo-container">
        <img src={LogoNoText} alt="Logo" className="logo" />
        <h3>The Drunken Giraffe</h3>
      </div>

      <div className="navLinksMiddle">
        <a href="/about">About</a>
        <a href="/store">Store</a>
      </div>

      <div className="navLinksRight">
        <a href="#" onClick={e => { e.preventDefault(); onLoginClick && onLoginClick(); }} > Login</a>
        <div className="cart-icon" style={{ marginTop: "8px", cursor: "pointer" }}>
          <a href="/cart"><FaShoppingCart size={24} /></a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

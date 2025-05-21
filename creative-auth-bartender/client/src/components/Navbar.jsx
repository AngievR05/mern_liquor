import React from "react";
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
        <a href="#">About</a>
        <a href="#">Store</a>
      </div>
      <div className="navLinksRight">
        <a href="#" onClick={e => { e.preventDefault(); onLoginClick && onLoginClick(); }}>Login</a>
      </div>
    </nav>
  );
}
export default Navbar;
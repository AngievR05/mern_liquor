import React from "react";
import "../styles/Navbar.css";
import LogoNoText from "../assets/Logo-no-text.svg";
import Store from "../pages/Store";
import About from "../pages/About";

const Navbar = ({ onLoginClick }) => {
  return (
    <nav>
      <div className="logo-container">
        <img src={LogoNoText} alt="Logo" className="logo" />
        <h3>The Drunken Giraffe</h3>
      </div>
      <div className="navLinksMiddle">
        <a href=<About />>About</a>
        <a href=<Store />>Store</a>
      </div>
      <div className="navLinksRight">
        <a href="#" onClick={e => { e.preventDefault(); onLoginClick && onLoginClick(); }}>Login</a>
      </div>
    </nav>
  );
}
export default Navbar;
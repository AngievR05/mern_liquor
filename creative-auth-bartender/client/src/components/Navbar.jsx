import React from "react";
import "../styles/Navbar.css";
import LogoNoText from "../assets/Logo-no-text.svg";

const Navbar = () => {
    <nav>
            <div className="logo-container">
              <img src={LogoNoText} alt="Logo" className="logo" />
              <h3>The Drunken Giraffe</h3>
            </div>
            <div className="navLinksMiddle">
              <a>About</a>
              <a>Store</a>
            </div>
            <div className="navLinksRight">
              <a>Login</a>
            </div>
    </nav>
}
export default Navbar;
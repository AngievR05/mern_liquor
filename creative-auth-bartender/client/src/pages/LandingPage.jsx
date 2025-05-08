import React from "react";
import "../styles/LandingPage.css";

// import BlackLogo from "../assets/BlackLogo.svg";
import WhiteLogo from "../assets/WhiteLogo.svg";
import HeroImage from "../assets/HeroImage.svg";
import OurStoryImage from "../assets/OurStoryImage.svg";
import OurProductsImage from "../assets/OurProductsImage.svg";
import LogoNoText from "../assets/Logo-no-text.svg";

const LandingPage = () => {
  return (
    <div className="landing-page">
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

      <div className="hero-section">
        <div className="hero-text">
          <h1>The Drunken Giraffe</h1>
        </div>
      </div>

      <div className="our-story-section">
        <img src={OurStoryImage} alt="Our Story" className="our-story-image" />
        <div className="our-story-text">
          <h2>Our Story</h2>
          <p>
            At The Drunken Giraffe, we believe that every cocktail tells a story. Our journey began with a passion for mixology and a desire to share the art of cocktail-making with the world. Join us as we explore the vibrant world of flavors, ingredients, and creativity that make each drink a masterpiece.
          </p>
          <button className="Read-more-button"><h3>Read More</h3></button>
        </div>
        </div>
    </div>
  );
};

export default LandingPage;
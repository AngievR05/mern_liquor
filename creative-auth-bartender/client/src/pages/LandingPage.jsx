import React from "react";
import "../styles/LandingPage.css";

// import BlackLogo from "../assets/BlackLogo.svg";
import WhiteLogo from "../assets/WhiteLogo.svg";
import HeroImage from "../assets/HeroImage.svg";
import OurStoryImage from "../assets/OurStoryImage.svg";
import OurProductsImage from "../assets/OurProductsImage.svg";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <img src={HeroImage} alt="Hero" className="hero-image" />
        <h1>Welcome to Our Brand</h1>
        <p>Discover the finest selection of beverages crafted with passion.</p>
      </section>

      {/* Our Story Section */}
      <section className="our-story-section">
        <img src={OurStoryImage} alt="Our Story" className="our-story-image" />
        <h2>Our Story</h2>
        <p>
          Learn about our journey and the inspiration behind our premium
          products.
        </p>
      </section>

      {/* Our Products Section */}
      <section className="our-products-section">
        <img
          src={OurProductsImage}
          alt="Our Products"
          className="our-products-image"
        />
        <h2>Our Products</h2>
        <p>
          Explore our wide range of beverages, each crafted to perfection.
        </p>
      </section>

      {/* Footer Section */}
      <footer className="landing-page-footer">
        <img src={WhiteLogo} alt="White Logo" className="logo" />
        <p>&copy; 2025 Our Brand. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
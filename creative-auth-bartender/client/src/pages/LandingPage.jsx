import React, { useState } from "react";
import "../styles/LandingPage.css";
import { Link } from "react-router-dom";

// import BlackLogo from "../assets/BlackLogo.svg";
import WhiteLogo from "../assets/WhiteLogo.svg";
import HeroImage from "../assets/HeroImage.svg";
import OurStoryImage from "../assets/OurStoryImage.svg";
import OurProductsImage from "../assets/OurProductsImage.svg";
import LogoNoText from "../assets/Logo-no-text.svg";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(true);

  return (
    <div className="landing-page">
      <nav>
        <Navbar onLoginClick={() => setShowAuthModal(true)} />
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
          At The Drunken Giraffe, we believe liquor should be more than just a drink — it should be a journey of craftsmanship, culture, and discovery. Born from a love for premium spirits and a respect for local artistry, we curate and craft a refined collection of in-house creations, rare imports, and standout local distillery gems. Whether you’re a seasoned connoisseur or simply crave something extraordinary, we’re here to elevate your experience, one sip at a time.
          </p>
          <button className="Read-more-button">
  <Link to="/about" className="read-more-link">
    <h3>Read More</h3>
  </Link>
</button>
        </div>
      </div>




      <div className="our-products-section">

        <div className="our-products-text">
          <h2>Our Products</h2>
          <p>
          Our collection is a testament to our commitment to quality and craftsmanship. From our in-house creations to rare imports and standout local distillery gems, we offer a diverse range of spirits that cater to every palate. Each bottle tells a story, and we invite you to explore the world of flavors, aromas, and experiences that await you at The Drunken Giraffe.
          </p>
          <button className="Read-more-button" id="view-collection">
  <Link to="/store" className="read-more-link">
    <h3>View the collection</h3>
  </Link>
</button>
        </div>
        <img src={OurProductsImage} alt="Our Products" className="our-products-image" />
      </div>

      <div className="footer-section">
        <Footer />
      </div>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>

  );
};

export default LandingPage;
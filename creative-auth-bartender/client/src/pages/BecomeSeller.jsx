import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cellarBackground from "../assets/cellarBackground.jpeg";

export default function BecomeSeller() {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    businessType: "",
    description: "",
    website: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Only allow negative offset (never positive)
      const offset = Math.min(0, -window.scrollY * 0.5);
      setParallaxOffset(offset);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: `url(${cellarBackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0",
    }}>
      {/* Hero/Banner Section */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)",
          color: "#350b0f",
          padding: "48px 0 32px 0",
          textAlign: "center",
          marginBottom: 32,
          position: "relative",
          zIndex: 2,
          transform: `translateY(${parallaxOffset}px)`,
          transition: "transform 0.1s linear",
          willChange: "transform",
        }}
      >
        <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0 }}>
          Sell Your Alcohol or Accessories on The Drunken Giraffe
        </h1>
        <p style={{ fontSize: 20, margin: "18px 0 32px 0", color: "#350b0f", fontWeight: 500 }}>
          Join our growing community of liquor brands, boutique distillers, and accessory makers. Start earning today.
        </p>
        <button
          style={{
            background: "#9b1c23",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 36px",
            fontWeight: 700,
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            transition: "background 0.2s"
          }}
          onClick={() => navigate("/become-seller/apply")}
        >
          Apply Now
        </button>
      </div>

      {/* How It Works Section */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto 40px auto",
          background: "rgba(0, 0, 0, 0.56)",
          borderRadius: 16,
          padding: "32px 16px 24px 16px",
          color: "#fff",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(2px)",
          mixBlendMode: "hard-light",
          border: "1px solid rgba(255, 255, 255, 0.47)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#e1bb3e", marginBottom: 28, fontWeight: 800 }}>
          How It Works
        </h2>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          gap: 24,
          flexWrap: "wrap"
        }}>
          <div style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 300,
            background: "rgba(0, 0, 0, 0.61)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ color: "#e1bb3e", fontWeight: 700, marginBottom: 10 }}>Step 1: Submit your application</h3>
            <p style={{ color: "#fff", fontSize: 16, margin: 0 }}>
              Fill out a quick form and tell us about your business.
            </p>
          </div>
          <div style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 300,
            background: "rgba(0, 0, 0, 0.61)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ color: "#e1bb3e", fontWeight: 700, marginBottom: 10 }}>Step 2: Get verified</h3>
            <p style={{ color: "#fff", fontSize: 16, margin: 0 }}>
              We’ll review your application, verify licensing, and contact you.
            </p>
          </div>
          <div style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 300,
            background: "rgba(0, 0, 0, 0.61)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ color: "#e1bb3e", fontWeight: 700, marginBottom: 10 }}>Step 3: Start selling</h3>
            <p style={{ color: "#fff", fontSize: 16, margin: 0 }}>
              Once approved, list your products and start earning.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto 40px auto",
          background: "rgba(0, 0, 0, 0.56)",
          borderRadius: 16,
          padding: "32px 16px 24px 16px",
          color: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          backdropFilter: "blur(2px)",
          mixBlendMode: "hard-light",
          border: "1px solid rgba(255, 255, 255, 0.47)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#e1bb3e", marginBottom: 28, fontWeight: 800, letterSpacing: 2 }}>
          Benefits of  Selling With Us
        </h2>
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: 24,
        }}>
          <li style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 300,
            background: "rgba(0, 0, 0, 0.56)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            fontSize: 24,
            color: "#fff",
            fontWeight: 700,
          }}>
            Easy inventory management
          </li>
          <li style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 300,
            background: "rgba(0, 0, 0, 0.56)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            fontSize: 24,
            color: "#fff",
            fontWeight: 700,
          }}>
            Access to thousands of customers
          </li>
          <li style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 300,
            background: "rgba(0, 0, 0, 0.56)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            fontSize: 24,
            color: "#fff",
            fontWeight: 700,
          }}>
            Secure and reliable payments
          </li>
          <li style={{
            flex: 1,
            // minWidth: 220,
            // maxWidth: 300,
            width: "100%",
            background: "rgba(0, 0, 0, 0.56)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            fontSize: 24,
            color: "#fff",
            fontWeight: 700,
          }}>
            Marketing and promotions for top sellers
          </li>
          <li style={{
            flex: 1,
            // minWidth: 220,
            // maxWidth: 300,
            width: "100%",
            background: "rgba(0, 0, 0, 0.56)",
            borderRadius: 12,
            padding: 24,
            margin: "0 8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            fontSize: 24,
            color: "#fff",
            fontWeight: 700,
            // mixBlendMode: "screen"
          }}>
            Compliance support for alcohol regulations
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto 40px auto",
          background: "rgba(0, 0, 0, 0.56)",
          borderRadius: 16,
          padding: "32px 16px 24px 16px",
          color: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          backdropFilter: "blur(2px)",
          mixBlendMode: "hard-light",
          border: "1px solid rgba(255, 255, 255, 0.47)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#e1bb3e", marginBottom: 28, fontWeight: 800 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#e1bb3e", fontWeight: 700, marginBottom: 8 }}>
              Do I need a liquor license?
            </h3>
            <p style={{ color: "#fff", fontSize: 16, margin: 0 }}>
              Yes, all sellers of alcohol must provide a valid liquor license. We will verify your documentation during the application process.
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#e1bb3e", fontWeight: 700, marginBottom: 8 }}>
              How are payments handled?
            </h3>
            <p style={{ color: "#fff", fontSize: 16, margin: 0 }}>
              Payments are processed securely through our platform. You’ll receive payouts directly to your nominated bank account on a regular schedule.
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#e1bb3e", fontWeight: 700, marginBottom: 8 }}>
              Can I sell from outside South Africa?
            </h3>
            <p style={{ color: "#fff", fontSize: 16, margin: 0 }}>
              Currently, only businesses registered and licensed in South Africa can sell on The Drunken Giraffe. We hope to expand internationally soon!
            </p>
          </div>
        </div>
      </div>
      {/* Start Selling Button */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "48px 0 32px 0" }}>
        <button
          style={{
            background: "linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)",
            color: "#350b0f",
            border: "none",
            borderRadius: 8,
            padding: "18px 48px",
            fontWeight: 800,
            fontSize: 22,
            cursor: "pointer",
            boxShadow: "inset 3px 3px 5px #2a070b25, inset -3px -3px 5px #2a070b25",
            transition: "background 0.2s",
            width: "100%",
            margin: "-50px 600px 0 600px",
          }}
          onClick={() => navigate("/become-seller/apply")}
        >
          Start Selling
        </button>
      </div>
    </div>
  );
}

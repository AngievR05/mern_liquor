import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cellarBackground from "../assets/cellarBackground.jpeg";

// Seller personalized dashboard component
function SellerDashboard({ seller }) {
  // Start fresh: remove all dashboard content
  return (
    <div
      style={{
        padding: 32,
        minHeight: "100vh",
        background: "#000",
        color: "#fff"
      }}
    >
      <h2 style={{ color: "#e1bb3e", marginBottom: 32 }}>
        Welcome, {seller.username}
      </h2>
      <div style={{
        background: "#181818",
        borderRadius: 12,
        padding: 32,
        maxWidth: 700,
        marginBottom: 32,
        color: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
      }}>
        <h3 style={{ color: "#e1bb3e", marginBottom: 18 }}>
          How to Add a Product to Your Store
        </h3>
        <div style={{ fontSize: 16, lineHeight: 1.7 }}>
          <b>Follow these simple steps to list your product for sale on the platform:</b>
          <ol style={{ marginTop: 16, marginBottom: 0, paddingLeft: 24 }}>
            <li style={{ marginBottom: 12 }}>
              <b>Navigate to the Store Page</b><br />
              Start by heading to the main Store page of your website.
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>Select the "My Store" Section</b><br />
              At the top of the page, you'll see two sections: "Home" and "My Store".<br />
              Click on "My Store" to manage your products and listings.
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>Click "Add Product"</b><br />
              Just below the filter options, you'll find a button labeled "Add Product".<br />
              Click it to open the product submission form.
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>Fill in Product Details</b><br />
              Enter all the required product information, including:
              <ul style={{ marginTop: 6, marginBottom: 6, paddingLeft: 20 }}>
                <li>Product name</li>
                <li>Description</li>
                <li>Category (Alcohol or Accessory)</li>
                <li>Price</li>
                <li>Product images</li>
                <li>Available stock</li>
                <li>Any relevant compliance or license info (for alcohol products)</li>
              </ul>
              Make sure all details are accurate and professional to appeal to buyers.
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>Submit Your Product</b><br />
              Once you've filled out the form, click "Submit".<br />
              Your product will go live immediately upon approval (if required), and will appear under your "My Store" section.
            </li>
            <li style={{ marginBottom: 12 }}>
              <b>Manage Your Listings</b><br />
              All your live products will be displayed under "My Store".<br />
              Each product card will have options to:
              <ul style={{ marginTop: 6, marginBottom: 6, paddingLeft: 20 }}>
                <li>Edit product details</li>
                <li>Delete the product if it's no longer available</li>
              </ul>
            </li>
            <li>
              <b>Preview Your Product as a Buyer</b><br />
              To see how your product appears to shoppers, return to the "Home" section.<br />
              Use the search bar to find your listing and view it as a buyer would.
            </li>
          </ol>
        </div>
      </div>
      {/* Seller Dashboard will be rebuilt here */}
    </div>
  );
}

function SellerLoginModal({ onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Replace with your backend seller login endpoint
      const res = await fetch("/api/sellers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      const seller = await res.json();
      // Save seller info to localStorage with isSeller: true
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          username: seller.username,
          email: seller.email,
          isSeller: true,
        })
      );
      setLoading(false);
      onLogin && onLogin(seller);
      onClose();
      window.location.reload(); // Optionally reload to update UI
    } catch {
      setError("Login failed");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 4000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          minWidth: 350,
          padding: 32,
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            fontSize: 22,
            color: "#9b1c23",
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2
          style={{
            color: "#9b1c23",
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          Seller Login
        </h2>
        <form
          onSubmit={handleSellerLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #e9c4b4",
              fontSize: 16,
              marginBottom: 8,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #e9c4b4",
              fontSize: 16,
              marginBottom: 8,
            }}
          />
          {error && (
            <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
          )}
          <button
            type="submit"
            style={{
              background: "#e1bb3e",
              color: "#350b0f",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontWeight: 700,
              fontSize: 18,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

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
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [sellerUser, setSellerUser] = useState(null);
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

  useEffect(() => {
    // Check if seller is logged in
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user && user.isSeller) {
        setSellerUser(user);
      }
    } catch {}
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (sellerUser) {
    return <SellerDashboard seller={sellerUser} />;
  }

  return (
    <div
      style={{
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
      }}
    >
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
        <div className="seller-banner" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)",
          padding: "32px 48px",
          borderRadius: 16,
          marginBottom: 40
        }}>
          <div>
            <h1 style={{ 
              color: "var(--Old-Brick)",
               fontWeight: 800,
                fontSize: 42,
                 margin: 0,
                 textShadow: "0 0 4px var(--Old-Brick)",
                  }}>
              Become a Seller
            </h1>
            <p style={{ color: "#350b0f", fontSize: 20, margin: "12px 0 0 0" }}>
              Join our marketplace and reach thousands of customers.
            </p>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <button
              style={{
                background: "var(--Old-Brick)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px 32px",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "inset 3px 3px 5px #2a070b25, inset -3px -3px 5px #2a070b25",
              }}
              onClick={() => window.location.href = "/become-seller/apply"}
            >
              Apply Now
            </button>
            <button
              style={{
                background: "var(--Anzac)",
                color: "var(--Aubergine)",
                border: "none",
                borderRadius: 8,
                padding: "14px 32px",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "inset 3px 3px 5px #2a070b25, inset -3px -3px 5px #2a070b25",
              }}
              onClick={() => setShowSellerLogin(true)}
            >
              Login
            </button>
          </div>
        </div>
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
        <h2
          style={{
            textAlign: "center",
            color: "#e1bb3e",
            marginBottom: 28,
            fontWeight: 800,
          }}
        >
          How It Works
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 220,
              maxWidth: 300,
              background: "rgba(0, 0, 0, 0.61)",
              borderRadius: 12,
              padding: 24,
              margin: "0 8px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                color: "#e1bb3e",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Step 1: Submit your application
            </h3>
            <p
              style={{
                color: "#fff",
                fontSize: 16,
                margin: 0,
              }}
            >
              Fill out a quick form and tell us about your business.
            </p>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 220,
              maxWidth: 300,
              background: "rgba(0, 0, 0, 0.61)",
              borderRadius: 12,
              padding: 24,
              margin: "0 8px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                color: "#e1bb3e",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Step 2: Get verified
            </h3>
            <p
              style={{
                color: "#fff",
                fontSize: 16,
                margin: 0,
              }}
            >
              We’ll review your application, verify licensing, and contact you.
            </p>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 220,
              maxWidth: 300,
              background: "rgba(0, 0, 0, 0.61)",
              borderRadius: 12,
              padding: 24,
              margin: "0 8px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                color: "#e1bb3e",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Step 3: Start selling
            </h3>
            <p
              style={{
                color: "#fff",
                fontSize: 16,
                margin: 0,
              }}
            >
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
        <h2
          style={{
            textAlign: "center",
            color: "#e1bb3e",
            marginBottom: 28,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          Benefits of Selling With Us
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: 24,
          }}
        >
          <li
            style={{
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
            }}
          >
            Easy inventory management
          </li>
          <li
            style={{
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
            }}
          >
            Access to thousands of customers
          </li>
          <li
            style={{
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
            }}
          >
            Secure and reliable payments
          </li>
          <li
            style={{
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
            }}
          >
            Marketing and promotions for top sellers
          </li>
          <li
            style={{
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
            }}
          >
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
        <h2
          style={{
            textAlign: "center",
            color: "#e1bb3e",
            marginBottom: 28,
            fontWeight: 800,
          }}
        >
          Frequently Asked Questions
        </h2>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <h3
              style={{
                color: "#e1bb3e",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Do I need a liquor license?
            </h3>
            <p
              style={{
                color: "#fff",
                fontSize: 16,
                margin: 0,
              }}
            >
              Yes, all sellers of alcohol must provide a valid liquor license. We
              will verify your documentation during the application process.
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3
              style={{
                color: "#e1bb3e",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              How are payments handled?
            </h3>
            <p
              style={{
                color: "#fff",
                fontSize: 16,
                margin: 0,
              }}
            >
              Payments are processed securely through our platform. You’ll
              receive payouts directly to your nominated bank account on a regular
              schedule.
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3
              style={{
                color: "#e1bb3e",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Can I sell from outside South Africa?
            </h3>
            <p
              style={{
                color: "#fff",
                fontSize: 16,
                margin: 0,
              }}
            >
              Currently, only businesses registered and licensed in South Africa
              can sell on The Drunken Giraffe. We hope to expand internationally
              soon!
            </p>
          </div>
        </div>
      </div>
      {/* Start Selling Button */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "48px 0 32px 0",
        }}
      >
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
            boxShadow:
              "inset 3px 3px 5px #2a070b25, inset -3px -3px 5px #2a070b25",
            transition: "background 0.2s",
            width: "100%",
            margin: "-50px 600px 0 600px",
          }}
          onClick={() => navigate("/become-seller/apply")}
        >
          Start Selling
        </button>
      </div>
      {showSellerLogin && (
        <SellerLoginModal
          onClose={() => setShowSellerLogin(false)}
          onLogin={() => {}}
        />
      )}
    </div>
  );
}

function LiquorLicenseUpload() {
  return (
    <>
      <label
        htmlFor="liquorLicenseFile"
        style={{
          fontWeight: 700,
          color: "#e1bb3e",
          marginBottom: 8,
          display: "block"
        }}
      >
        Upload Liquor License
      </label>
      <div style={{ color: "#000", fontSize: 14, marginBottom: 8 }}>
        File type must be: <b>jpg, jpeg, img, or png</b>
      </div>
      <input
        type="file"
        id="liquorLicenseFile"
        name="liquorLicenseFile"
        accept=".jpg,.jpeg,.png,.img,image/jpeg,image/png,image/jpg"
        required
        style={{ marginBottom: 8 }}
      />
    </>
  );
}

// In your seller application form (where you upload the liquor license), use the <LiquorLicenseUpload /> component:

<div style={{ marginTop: 24 }}>
  <h3 style={{ color: "#e1bb3e", marginBottom: 12 }}>Liquor License</h3>
  <LiquorLicenseUpload />
</div>

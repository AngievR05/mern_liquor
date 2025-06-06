import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({ user, onClose, onLogout, onProfilePicChange }) {
  const [profilePic, setProfilePic] = useState(() => {
    // Try to get from loggedInUser first, then fallback to localStorage
    try {
      const userObj = JSON.parse(localStorage.getItem('loggedInUser'));
      if (userObj && userObj.profilePic) return userObj.profilePic;
      return localStorage.getItem('profilePic') || null;
    } catch {
      return null;
    }
  });
  const [preview, setPreview] = useState(user.profilePic || null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Always reload wishlist from localStorage when showWishlist changes to true
  useEffect(() => {
    if (showWishlist) {
      try {
        setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
      } catch {
        setWishlist([]);
      }
    }
  }, [showWishlist]);

  // Also reload wishlist when window regains focus (in case user hearts in another tab)
  useEffect(() => {
    const syncWishlist = () => {
      if (showWishlist) {
        try {
          setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
        } catch {
          setWishlist([]);
        }
      }
    };
    window.addEventListener('focus', syncWishlist);
    return () => window.removeEventListener('focus', syncWishlist);
  }, [showWishlist]);

  // Keep profilePic in sync with loggedInUser/profilePic in localStorage
  useEffect(() => {
    try {
      const userObj = JSON.parse(localStorage.getItem('loggedInUser'));
      if (userObj && userObj.profilePic) {
        setProfilePic(userObj.profilePic);
      } else {
        setProfilePic(localStorage.getItem('profilePic') || null);
      }
    } catch {
      setProfilePic(localStorage.getItem('profilePic') || null);
    }
  }, []);

  // Save profilePic to localStorage and to loggedInUser on change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const url = event.target.result;
      setProfilePic(url);
      localStorage.setItem('profilePic', url);
      // Also update loggedInUser in localStorage
      try {
        const userObj = JSON.parse(localStorage.getItem('loggedInUser'));
        if (userObj) {
          localStorage.setItem('loggedInUser', JSON.stringify({ ...userObj, profilePic: url }));
        }
      } catch {}
      if (onProfilePicChange) onProfilePicChange(url, file);
    };
    reader.readAsDataURL(file);
  };

  if (showWishlist) {
    return (
      <div className="profile-modal">
        <button onClick={() => setShowWishlist(false)} style={{ float: "right", margin: 8 }}>Back</button>
        <h2 style={{ marginTop: 0 }}>My Wishlist</h2>
        {wishlist.length === 0 ? (
          <div style={{ color: "#888", margin: 24 }}>No products in your wishlist.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {wishlist.map(product => (
              <div key={product._id} style={{
                border: "1px solid #e1bb3e",
                borderRadius: 10,
                padding: 16,
                width: 220,
                background: "#fff",
                color: "#350b0f"
              }}>
                <img src={product.image} alt={product.title} style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />
                <h4 style={{ margin: "8px 0" }}>{product.title}</h4>
                <div style={{ fontWeight: 500, color: "#9b1c23" }}>R{product.price}</div>
                <div style={{ fontSize: 14, color: "#888", margin: "8px 0" }}>{product.category}</div>
                {/* Optionally: Add remove from wishlist button here */}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        minWidth: 400,
        minHeight: 300,
        padding: 32,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 18, right: 18,
            background: 'none', border: 'none', fontSize: 26, color: '#9b1c23', cursor: 'pointer'
          }}
          aria-label="Close"
        >×</button>
        <h2 style={{ marginBottom: 18, color: '#350b0f', fontWeight: 800 }}>Profile</h2>
        <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e1bb3e'
                }}
              />
            ) : (
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: "#9b1c23"
              }}>
                ?
              </div>
            )}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 15,
                color: "#9b1c23"
              }}
            >
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
            </label>
          </div>
        </div>
        <div style={{ marginBottom: 18, fontSize: 18 }}>
          <b>Username:</b> {user.username}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'center' }}>
          <button
            onClick={() => {
              onClose && onClose();
              navigate("/wishlist");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#9b1c23",
              background: "#fff",
              border: "1px solid #e1bb3e",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              marginTop: 16
            }}
          >
            View Wishlist
          </button>
          <button style={{
            width: '80%',
            background: '#e1bb3e',
            color: '#350b0f',
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer'
          }}>
            View Purchase History
          </button>
        </div>
        <button
          onClick={onLogout}
          style={{
            marginTop: 32,
            width: '80%',
            background: '#9b1c23',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

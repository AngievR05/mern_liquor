import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({ user, onClose, onLogout, onProfilePicChange }) {
  const [profilePic, setProfilePic] = useState(() => {
    try {
      const userObj = JSON.parse(localStorage.getItem('loggedInUser'));
      return userObj?.profilePic || localStorage.getItem('profilePic') || null;
    } catch {
      return null;
    }
  });
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (showWishlist) {
      try {
        setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
      } catch {
        setWishlist([]);
      }
    }
  }, [showWishlist]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await fetch('/api/users/upload-profile-pic', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.imagePath) {
        const imgPath = `/uploads/${data.imagePath}`;
        setProfilePic(imgPath);
        localStorage.setItem('profilePic', imgPath);
        const userObj = JSON.parse(localStorage.getItem('loggedInUser'));
        if (userObj) {
          localStorage.setItem('loggedInUser', JSON.stringify({ ...userObj, profilePic: imgPath }));
        }
        if (onProfilePicChange) onProfilePicChange(imgPath);
      } else {
        alert('Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload profile picture.');
    }
  };

  return (
    <div className="profile-modal-wrapper">
      <div className="profile-modal">
        <button onClick={onClose} className="close-btn">×</button>
        <h2>Profile</h2>
        <div className="profile-pic-wrapper">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-placeholder">?</div>
          )}
          <label className="change-pic-btn">
            Change Profile Picture
            <input type="file" accept="image/*" hidden onChange={handleProfilePicChange} />
          </label>
        </div>
        <div className="user-info">
          <b>Username:</b> {user.username}
        </div>
        <button className="wishlist-btn" onClick={() => setShowWishlist(true)}>View Wishlist</button>
        {user?.isAdmin && (
          <button onClick={() => { onClose(); navigate("/dashboard"); }} className="admin-btn">
            Dashboard
          </button>
        )}
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

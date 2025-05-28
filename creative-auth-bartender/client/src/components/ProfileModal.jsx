import React, { useState } from 'react';

export default function ProfileModal({ user, onClose, onLogout, onProfilePicChange }) {
  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  const [preview, setPreview] = useState(user.profilePic || null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfilePic(file);
    setPreview(url);
    if (onProfilePicChange) onProfilePicChange(url, file);
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
          <label htmlFor="profile-pic-input" style={{ cursor: 'pointer' }}>
            {preview ? (
              <img src={preview} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '2px solid #e1bb3e' }} />
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: '#eee', marginBottom: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 32, border: '2px solid #e1bb3e'
              }}>+</div>
            )}
          </label>
          <input
            id="profile-pic-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('profile-pic-input').click()}
            style={{
              background: '#e1bb3e',
              color: '#350b0f',
              border: 'none',
              borderRadius: 8,
              padding: '6px 16px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              marginTop: 4
            }}
          >
            {preview ? "Change Profile Picture" : "Set Profile Picture"}
          </button>
        </div>
        <div style={{ marginBottom: 18, fontSize: 18 }}>
          <b>Username:</b> {user.username}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'center' }}>
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

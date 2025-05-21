import React, { useState } from 'react';
import LogoNoText from '../assets/Logo-no-text.svg';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        minWidth: 700,
        minHeight: 400,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Left column: Intro */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #350b0f 0%, #9b1c23 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '48px 36px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={LogoNoText} alt="Logo" style={{ width: 68, height: 68 }} />
            <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: 1 }}>
              Welcome to The Drunken Giraffe
            </h2>
          </div>
          <p style={{ marginTop: 18, fontSize: 18, lineHeight: 1.5, color: '#e9c4b4' }}>
            Discover, collect and enjoy premium spirits.<br />
            Log in or create an account to purchase, review or become a seller.
          </p>
        </div>
        {/* Right column: Auth form */}
        <div style={{
          flex: 1,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 36px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 18, right: 18,
              background: 'none', border: 'none', fontSize: 26, color: '#9b1c23', cursor: 'pointer'
            }}
            aria-label="Close"
          >×</button>
          <div style={{ display: 'flex', width: '100%', marginBottom: 32 }}>
            <button
              onClick={() => setTab('login')}
              style={{
                flex: 1,
                fontWeight: tab === 'login' ? 700 : 400,
                fontSize: 18,
                background: 'none',
                border: 'none',
                borderBottom: tab === 'login' ? '3px solid #e1bb3e' : '3px solid transparent',
                color: tab === 'login' ? '#350b0f' : '#9b1c23',
                padding: '8px 0',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              style={{
                flex: 1,
                fontWeight: tab === 'register' ? 700 : 400,
                fontSize: 18,
                background: 'none',
                border: 'none',
                borderBottom: tab === 'register' ? '3px solid #e1bb3e' : '3px solid transparent',
                color: tab === 'register' ? '#350b0f' : '#9b1c23',
                padding: '8px 0',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              Register
            </button>
          </div>
          <div style={{ width: '100%' }}>
            {tab === 'login' ? (
              <div>
                <h3 style={{ margin: '0 0 18px 0', fontWeight: 700, color: '#350b0f', fontSize: 22 }}>Welcome back!</h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <input
                    type="text"
                    placeholder="Email or Phone Number"
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e9c4b4',
                      fontSize: 16,
                      marginBottom: 8
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e9c4b4',
                      fontSize: 16,
                      marginBottom: 8
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)',
                      color: '#350b0f',
                      border: 'none',
                      borderRadius: 8,
                      padding: '12px 0',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    Log In
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {/* Replace with your register form */}
                <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <input
                    type="text"
                    placeholder="Username"
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e9c4b4',
                      fontSize: 16,
                      marginBottom: 8
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Email or Phone Number"
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e9c4b4',
                      fontSize: 16,
                      marginBottom: 8
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e9c4b4',
                      fontSize: 16,
                      marginBottom: 8
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)',
                      color: '#350b0f',
                      border: 'none',
                      borderRadius: 8,
                      padding: '12px 0',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    Register
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

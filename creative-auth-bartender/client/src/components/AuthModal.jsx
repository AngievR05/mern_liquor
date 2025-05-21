import React, { useState } from 'react';
import LogoNoText from '../assets/Logo-no-text.svg';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [showVerification, setShowVerification] = useState(false);
  const [registerContact, setRegisterContact] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [registerUserId, setRegisterUserId] = useState(null);
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    emailOrPhone: "",
    username: "",
    password: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Register step 1: send code
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);
    try {
      // Use the correct backend URL for your setup
      // If your backend is running on port 3000 (same as frontend), use relative path
      // If your backend is running on a different port, use the full URL
      const apiUrl = "/api/users/register";

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerForm.emailOrPhone.includes('@') ? registerForm.emailOrPhone : undefined,
          phone: !registerForm.emailOrPhone.includes('@') ? registerForm.emailOrPhone : undefined,
          username: registerForm.username || registerForm.firstName,
        })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(
          'Server error: Your frontend cannot reach the backend. ' +
          'Make sure your backend is running at http://localhost:3000 ' +
          'and your API route /api/users/register is available.'
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setRegisterUserId(data.userId);
      setRegisterContact(registerForm.emailOrPhone);
      setShowVerification(true);
    } catch (err) {
      setRegisterError(err.message === "Failed to fetch"
        ? "Could not connect to backend. Make sure your backend server is running and accessible at http://localhost:3000."
        : err.message
      );
    }
    setRegisterLoading(false);
  }

  // Register step 2: verify code and set password
  async function handleVerifySubmit(e) {
    e.preventDefault();
    setVerifyError("");
    setVerifyLoading(true);
    try {
      const code = verificationCode.join('');
      const res = await fetch('/api/users/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: registerUserId,
          code,
          password: registerForm.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      // Optionally: save token, close modal, or redirect
      alert("Registration complete! You can now log in.");
      setShowVerification(false);
      setTab('login');
    } catch (err) {
      setVerifyError(err.message);
    }
    setVerifyLoading(false);
  }

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
                    value={registerForm.emailOrPhone}
                    onChange={e => setRegisterForm(f => ({ ...f, emailOrPhone: e.target.value }))}
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
                    Continue
                  </button>
                </form>
                <div style={{ textAlign: 'center', margin: '18px 0 0 0', color: '#888', fontSize: 15 }}>
                  Or continue with Socials
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center' }}>
                  <button
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      background: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      padding: '10px 0',
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#222',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 22, height: 22 }} />
                    Google
                  </button>
                  <button
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      background: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      padding: '10px 0',
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#222',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
                  >
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" style={{ width: 22, height: 22 }} />
                    Facebook
                  </button>
                </div>
                <div style={{ marginTop: 32, textAlign: 'center', fontSize: 15, color: '#888' }}>
                  Don't have an account?
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9b1c23',
                      fontWeight: 700,
                      marginLeft: 8,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: 15
                    }}
                  >
                    Create One
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {showVerification ? (
                  <form onSubmit={handleVerifySubmit}>
                    <h3 style={{ margin: '0 0 18px 0', fontWeight: 700, color: '#350b0f', fontSize: 22 }}>Verify email or phone number and set password</h3>
                    <div style={{ marginBottom: 18, color: '#888', fontSize: 16 }}>
                      Code sent to <span style={{ color: '#350b0f', fontWeight: 600 }}>{registerContact}</span>
                    </div>
                    <div style={{ marginBottom: 10, fontWeight: 600, color: '#350b0f', fontSize: 16 }}>Verification code</div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                      {verificationCode.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={e => {
                            const code = [...verificationCode];
                            code[idx] = e.target.value.replace(/[^0-9]/g, "");
                            setVerificationCode(code);
                            // Auto-focus next
                            if (e.target.value && idx < 5) {
                              document.getElementById(`verif-code-${idx+1}`)?.focus();
                            }
                          }}
                          id={`verif-code-${idx}`}
                          style={{
                            width: 40,
                            height: 48,
                            fontSize: 24,
                            textAlign: 'center',
                            border: '1px solid #e9c4b4',
                            borderRadius: 8,
                            outline: 'none',
                            background: '#faf8f6',
                            fontWeight: 700
                          }}
                        />
                      ))}
                    </div>
                    <input
                      type="password"
                      placeholder="Set Password"
                      value={registerForm.password}
                      onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '1px solid #e9c4b4',
                        fontSize: 16,
                        marginBottom: 16
                      }}
                      required
                    />
                    {verifyError && <div style={{ color: 'red', marginBottom: 8 }}>{verifyError}</div>}
                    <button
                      type="submit"
                      disabled={verifyLoading}
                      style={{
                        background: 'linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)',
                        color: '#350b0f',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 0',
                        fontWeight: 700,
                        fontSize: 18,
                        cursor: 'pointer',
                        width: '100%',
                        opacity: verifyLoading ? 0.7 : 1
                      }}
                    >
                      {verifyLoading ? "Verifying..." : "Verify & Finish"}
                    </button>
                  </form>
                ) : (
                  <>
                    <h3 style={{ margin: '0 0 18px 0', fontWeight: 700, color: '#350b0f', fontSize: 22 }}>Hi, Let's get started</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleRegisterSubmit}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <input
                          type="text"
                          placeholder="First Name"
                          value={registerForm.firstName}
                          onChange={e => setRegisterForm(f => ({ ...f, firstName: e.target.value }))}
                          style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: 8,
                            border: '1px solid #e9c4b4',
                            fontSize: 16,
                            marginBottom: 8
                          }}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={registerForm.lastName}
                          onChange={e => setRegisterForm(f => ({ ...f, lastName: e.target.value }))}
                          style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: 8,
                            border: '1px solid #e9c4b4',
                            fontSize: 16,
                            marginBottom: 8
                          }}
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Email or Phone Number"
                        value={registerForm.emailOrPhone}
                        onChange={e => setRegisterForm(f => ({ ...f, emailOrPhone: e.target.value }))}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: '1px solid #e9c4b4',
                          fontSize: 16,
                          marginBottom: 8
                        }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Username"
                        value={registerForm.username}
                        onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: '1px solid #e9c4b4',
                          fontSize: 16,
                          marginBottom: 8
                        }}
                        required
                      />
                      <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 0 0' }}>
                        <input id="terms" name="terms" type="checkbox" style={{ marginRight: 8 }} required />
                        <label htmlFor="terms" style={{ fontSize: 14, color: '#555' }}>
                          I agree to the <a href="#" style={{ color: '#9b1c23', textDecoration: 'underline' }}>Terms and Conditions</a>
                        </label>
                      </div>
                      {registerError && <div style={{ color: 'red', marginBottom: 8 }}>{registerError}</div>}
                      <button
                        type="submit"
                        disabled={registerLoading}
                        style={{
                          background: 'linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)',
                          color: '#350b0f',
                          border: 'none',
                          borderRadius: 8,
                          padding: '12px 0',
                          fontWeight: 700,
                          fontSize: 18,
                          cursor: 'pointer',
                          marginTop: 8,
                          opacity: registerLoading ? 0.7 : 1
                        }}
                      >
                        {registerLoading ? "Sending code..." : "Accept and Continue"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

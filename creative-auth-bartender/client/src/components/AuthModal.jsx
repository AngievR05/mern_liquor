import React, { useState } from 'react';
import LogoNoText from '../assets/Logo-no-text.svg';
import '../styles/AuthModal.css';
import whiskeyImg from '../assets/whiskey.png'; // Use your whiskey bottle image
import notWhiskeyImg from '../assets/wine.png'; // Use a non-whiskey image
import tequilaAudio from '../assets/audio/tequila.mp3';
import redWineAudio from '../assets/audio/redwine.mp3';
import ginJuiceAudio from '../assets/audio/gaj.mp3';
import cheersAudio from '../assets/audio/cheers.mp3';
import sha256 from 'crypto-js/sha256'; // npm install crypto-js
import ProfileModal from './ProfileModal'; // <-- import the new profile modal component
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showContactHint, setShowContactHint] = useState(false);
  const [emailError, setEmailError] = useState(""); // <-- add this state
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [usernameValid, setUsernameValid] = useState({ capital: false, noSpaces: false });
  const [showUsernameHint, setShowUsernameHint] = useState(false);
  // Add password validation state and hint
  const [passwordValid, setPasswordValid] = useState({ capital: false, special: false });
  const [showPasswordHintBox, setShowPasswordHintBox] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Trivia questions for registration
  const triviaQuestions = [
    { key: "favDrink", label: "What is your favorite drink?" },
    { key: "firstPet", label: "What was the name of your first pet?" },
    { key: "birthCity", label: "In what city were you born?" }
  ];
  const [triviaAnswers, setTriviaAnswers] = useState({
    favDrink: "",
    firstPet: "",
    birthCity: ""
  });

  // Remove trivia from login process
  const [loginStep, setLoginStep] = useState(0); // 0: email, 1: password
  const [loginContact, setLoginContact] = useState(""); // email only
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Add these state hooks for login
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  function shuffleArray(array) {
    // Fisher-Yates shuffle
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Registration submit with trivia
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);

    // Password validation: at least 1 capital letter and 1 special character
    const password = registerForm.password;
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setRegisterError("Password must have at least 1 capital letter and 1 special character.");
      setRegisterLoading(false);
      return;
    }

    try {
      // Check if username or email already exists
      const checkRes = await fetch('/api/users/check-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email
        })
      });

      // Only treat as server error if status is 500+ or fetch fails
      if (!checkRes.ok && checkRes.status >= 500) {
        setRegisterError("A server error occurred. Please try again later.");
        setRegisterLoading(false);
        return;
      }
      let checkData;
      try {
        // Defensive: check for HTML response
        const text = await checkRes.text();
        if (text.startsWith('<!DOCTYPE')) {
          setRegisterError("A server error occurred. Please try again later.");
          setRegisterLoading(false);
          return;
        }
        checkData = JSON.parse(text);
      } catch {
        setRegisterError("A server error occurred. Please try again later.");
        setRegisterLoading(false);
        return;
      }

      if (checkData.exists) {
        setRegisterError("You are already a user. Please login.");
        setRegisterLoading(false);
        return;
      }

      // Hash trivia answers
      const hashedTrivia = {};
      for (const q of triviaQuestions) {
        hashedTrivia[q.key] = sha256(triviaAnswers[q.key].trim().toLowerCase()).toString();
      }

      // Save user to backend with all required fields
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
          trivia: hashedTrivia
        })
      });

      if (!res.ok && res.status >= 500) {
        setRegisterError("A server error occurred. Please try again later.");
        setRegisterLoading(false);
        return;
      }
      let data;
      try {
        // Defensive: check for HTML response
        const text = await res.text();
        if (text.startsWith('<!DOCTYPE')) {
          setRegisterError("A server error occurred. Please try again later.");
          setRegisterLoading(false);
          return;
        }
        data = JSON.parse(text);
      } catch {
        setRegisterError("A server error occurred. Please try again later.");
        setRegisterLoading(false);
        return;
      }
      if (!res.ok) {
        setRegisterError(data.message || "Registration failed");
        setRegisterLoading(false);
        return;
      }
      setShowSuccess(true);
      const userObj = {
        username: registerForm.username,
        email: registerForm.email,
      };
      setTimeout(() => {
        setShowSuccess(false);
        onClose(userObj); // Pass user to parent
      }, 2000);
    } catch (err) {
      setRegisterError("A server error occurred. Please try again later.");
    }
    setRegisterLoading(false);
  }

  // Login process: step-by-step (order: email -> trivia -> password)
  async function handleLoginContactSubmit(e) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    // Only allow login by email (never username)
    const email = loginContact.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setLoginError("Please enter a valid email address.");
      setLoginLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/check-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email
        })
      });
      const data = await res.json();
      if (!data.exists) {
        setLoginError("User not found.");
        setLoginLoading(false);
        return;
      }
      setLoginStep(1); // Show password field directly
    } catch {
      setLoginError("A server error occurred. Please try again later.");
    }
    setLoginLoading(false);
  }

  async function handleLoginPasswordSubmit(e) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    // Log the password being sent for debugging
    console.log('DEBUG: Password sent to backend:', loginPassword);

    // Use the dedicated /login endpoint for password check
    const email = loginContact.trim().toLowerCase();
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: loginPassword // This must be the plain password, not a hash!
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.message || "Incorrect email or password.");
        setLoginLoading(false);
        return;
      }
      const user = await res.json();
      if (!user || !user.email) {
        setLoginError("User not found.");
        setLoginLoading(false);
        return;
      }
      // Success: pass user to parent and redirect to homepage
      const userObj = {
        username: user.username,
        email: user.email,
      };
      setLoginSuccess(true); // Show login success message
      // Fire a custom event so Navbar can update immediately
      setTimeout(() => {
        setLoginSuccess(false);
        // Fire event for Navbar to update state
        document.dispatchEvent(new Event('auth-login'));
        onClose(userObj);
        navigate("/landing-page");
      }, 1200);
    } catch {
      setLoginError("A server error occurred. Please try again later.");
    }
    setLoginLoading(false);
  }

  // Email validation handler
  function handleEmailBlur(e) {
    setShowContactHint(false);
    if (!e.target.value.includes("@")) {
      setEmailError("please enter a valid email address");
    } else {
      setEmailError("");
    }
  }

  function handleEmailChange(e) {
    setRegisterForm(f => ({ ...f, email: e.target.value }));
    if (emailError && e.target.value.includes("@")) {
      setEmailError("");
    }
  }

  // Username validation handler
  function handleUsernameChange(e) {
    const value = e.target.value;
    setRegisterForm(f => ({ ...f, username: value }));
    setUsernameValid({
      capital: /^[A-Z]/.test(value),
      noSpaces: !/\s/.test(value) && value.length > 0
    });
  }

  // Password validation handler
  function handlePasswordChange(e) {
    const value = e.target.value;
    setRegisterForm(f => ({ ...f, password: value }));
    setPasswordValid({
      capital: /[A-Z]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    });
  }

  return (
    <>
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
            position: 'relative',
            minHeight: 400,
            minWidth: 700,
            // Add maxHeight and overflow for scrollable registration
            maxHeight: 600,
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
            <div style={{
              width: '100%',
              // Make registration modal scrollable if needed
              overflowY: tab === 'register' ? 'auto' : 'visible',
              maxHeight: tab === 'register' ? 500 : 'none',
              paddingRight: tab === 'register' ? 8 : 0
            }}>
              {showSuccess ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 300,
                  width: '100%',
                  textAlign: 'center'
                }}>
                  <h2 style={{ color: '#350b0f', fontWeight: 800, marginBottom: 16 }}>
                    Registration complete!
                  </h2>
                  <h3 style={{ color: '#9b1c23', fontWeight: 700 }}>
                    {registerForm.username}
                  </h3>
                  <p style={{ fontSize: 20, color: '#350b0f', marginTop: 12 }}>
                    You are now a member.
                  </p>
                  <p style={{ color: '#888', marginTop: 24 }}>
                    Redirecting to homepage...
                  </p>
                </div>
              ) : loginSuccess ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  width: '100%',
                  textAlign: 'center'
                }}>
                  <h2 style={{ color: '#2e7d32', fontWeight: 800, marginBottom: 16 }}>
                    Login successful!
                  </h2>
                  <p style={{ color: '#888', marginTop: 24 }}>
                    Redirecting...
                  </p>
                </div>
              ) : (
                tab === 'register' ? (
                  // Registration form (no audio game)
                  <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleRegisterSubmit}>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={registerForm.firstName}
                      onChange={e => setRegisterForm(f => ({ ...f, firstName: e.target.value }))}
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
                      placeholder="Last Name"
                      value={registerForm.lastName}
                      onChange={e => setRegisterForm(f => ({ ...f, lastName: e.target.value }))}
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
                      type="email"
                      placeholder="Email"
                      value={registerForm.email}
                      onChange={handleEmailChange}
                      onFocus={() => setShowContactHint(true)}
                      onBlur={handleEmailBlur}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '1px solid #e9c4b4',
                        fontSize: 16,
                        marginBottom: 8
                      }}
                      required
                    />
                    {emailError && (
                      <div style={{
                        color: '#b71c1c',
                        fontSize: 14,
                        marginBottom: 8,
                        background: '#fffbe7',
                        borderRadius: 6,
                        padding: '6px 10px'
                      }}>
                        {emailError}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Username"
                      value={registerForm.username}
                      onChange={handleUsernameChange}
                      onFocus={() => setShowUsernameHint(true)}
                      onBlur={() => setShowUsernameHint(false)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '1px solid #e9c4b4',
                        fontSize: 16,
                        marginBottom: 4
                      }}
                      required
                    />
                    {showUsernameHint && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{
                          color: usernameValid.capital ? "#2e7d32" : "#b71c1c",
                          fontWeight: 500,
                          fontSize: 14,
                          marginRight: 12
                        }}>
                          {usernameValid.capital ? "✔" : "✖"} Starts with a capital letter
                        </span>
                        <span style={{
                          color: usernameValid.noSpaces ? "#2e7d32" : "#b71c1c",
                          fontWeight: 500,
                          fontSize: 14
                        }}>
                          {usernameValid.noSpaces ? "✔" : "✖"} No spaces
                        </span>
                      </div>
                    )}
                    {/* Trivia questions */}
                    {triviaQuestions.map(q => (
                      <input
                        key={q.key}
                        type="text"
                        placeholder={q.label}
                        value={triviaAnswers[q.key]}
                        onChange={e => setTriviaAnswers(a => ({ ...a, [q.key]: e.target.value }))}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: '1px solid #e9c4b4',
                          fontSize: 16,
                          marginBottom: 8
                        }}
                        required
                      />
                    ))}
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Set Password"
                        value={registerForm.password}
                        onChange={handlePasswordChange}
                        onFocus={() => setShowPasswordHintBox(true)}
                        onBlur={() => setShowPasswordHintBox(false)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: '1px solid #e9c4b4',
                          fontSize: 16,
                          marginBottom: 4,
                          width: '100%',
                          paddingRight: 40
                        }}
                        required
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: 16,
                          cursor: 'pointer',
                          color: '#9b1c23'
                        }}
                        onClick={() => setShowRegisterPassword(v => !v)}
                        tabIndex={0}
                        aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                      >
                        {/* Show open eye when showing password, crossed eye when hidden */}
                        {showRegisterPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    {showPasswordHintBox && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{
                          color: passwordValid.capital ? "#2e7d32" : "#b71c1c",
                          fontWeight: 500,
                          fontSize: 14,
                          marginRight: 12
                        }}>
                          {passwordValid.capital ? "✔" : "✖"} At least 1 capital letter
                        </span>
                        <span style={{
                          color: passwordValid.special ? "#2e7d32" : "#b71c1c",
                          fontWeight: 500,
                          fontSize: 14
                        }}>
                          {passwordValid.special ? "✔" : "✖"} At least 1 special character
                        </span>
                      </div>
                    )}
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
                        cursor: registerLoading ? 'not-allowed' : 'pointer',
                        marginTop: 8,
                        opacity: registerLoading ? 0.7 : 1
                      }}
                    >
                      {registerLoading ? "Registering..." : "Register"}
                    </button>
                    {registerError && <div style={{ color: 'red', marginBottom: 8 }}>{registerError}</div>}
                  </form>
                ) : (
                  // Login form: step-by-step (email -> trivia -> password)
                  <div>
                    <h3 style={{ margin: '0 0 18px 0', fontWeight: 700, color: '#350b0f', fontSize: 22 }}>Welcome back!</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {loginStep === 0 && (
                        <>
                          <input
                            type="email"
                            placeholder="Email"
                            value={loginContact}
                            onChange={e => setLoginContact(e.target.value)}
                            style={{
                              padding: '12px 16px',
                              borderRadius: 8,
                              border: '1px solid #e9c4b4',
                              fontSize: 16,
                              marginBottom: 8
                            }}
                            required
                          />
                          {loginError && <div style={{ color: 'red', marginBottom: 8 }}>{loginError}</div>}
                          <button
                            type="button"
                            className='login-btn'
                            disabled={loginLoading}
                            onClick={handleLoginContactSubmit}
                          >
                            {loginLoading ? "Checking..." : "Continue"}
                          </button>
                        </>
                      )}
                      {loginStep === 1 && (
                        <>
                          <input
                            type="email"
                            value={loginContact}
                            disabled
                            style={{
                              padding: '12px 16px',
                              borderRadius: 8,
                              border: '1px solid #e9c4b4',
                              fontSize: 16,
                              marginBottom: 8,
                              background: "#f3f3f3"
                            }}
                          />
                          <div style={{ position: 'relative', width: '100%' }}>
                            <input
                              type={showLoginPassword ? "text" : "password"}
                              placeholder="Password"
                              value={loginPassword}
                              onChange={e => setLoginPassword(e.target.value)}
                              style={{
                                padding: '12px 16px',
                                borderRadius: 8,
                                border: '1px solid #e9c4b4',
                                fontSize: 16,
                                marginBottom: 8,
                                width: '100%',
                                paddingRight: 40
                              }}
                              required
                            />
                            <span
                              style={{
                                position: 'absolute',
                                right: 12,
                                top: 16,
                                cursor: 'pointer',
                                color: '#9b1c23'
                              }}
                              onClick={() => setShowLoginPassword(v => !v)}
                              tabIndex={0}
                              aria-label={showLoginPassword ? "Hide password" : "Show password"}
                            >
                              {/* Show open eye when showing password, crossed eye when hidden */}
                              {showLoginPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                          </div>
                          {loginError && <div style={{ color: 'red', marginBottom: 8 }}>{loginError}</div>}
                          <button
                            type="button"
                            className='login-btn'
                            disabled={loginLoading}
                            onClick={handleLoginPasswordSubmit}
                          >
                            {loginLoading ? "Logging in..." : "Login"}
                          </button>
                        </>
                      )}
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
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {showProfileModal && loggedInUser && (
        <ProfileModal
          user={loggedInUser}
          onClose={() => setShowProfileModal(false)}
          onLogout={() => {
            setShowProfileModal(false);
            setLoggedInUser(null);
            setTab('login');
            setTimeout(() => onClose(), 0); // Close profile, then show login modal
          }}
        />
      )}
    </>
  );
}

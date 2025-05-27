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

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [showGame, setShowGame] = useState(false);
  const [gameError, setGameError] = useState('');
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    emailOrPhone: "",
    username: "",
    password: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passMessage, setPassMessage] = useState(""); // <-- add this state
  const [showContactHint, setShowContactHint] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // Audio game setup
  const audioClips = [
    { name: "Tequila", src: tequilaAudio, chorusStart: 30, chorusDuration: 3 },
    { name: "Red Red Wine", src: redWineAudio, chorusStart: 40, chorusDuration: 3 },
    { name: "Gin and Juice", src: ginJuiceAudio, chorusStart: 35, chorusDuration: 3 },
    { name: "Cheers", src: cheersAudio, chorusStart: 45, chorusDuration: 3 }
  ];

  const [sequenceOrder, setSequenceOrder] = useState([]);
  const [sequencePlayed, setSequencePlayed] = useState(false);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualFallback, setShowVisualFallback] = useState(false);

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

  // Trivia for login
  const [loginTriviaIdx, setLoginTriviaIdx] = useState(null);
  const [loginTriviaAnswer, setLoginTriviaAnswer] = useState("");
  const [loginError, setLoginError] = useState("");

  // Add state for login password and login step
  const [loginPassword, setLoginPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  function shuffleArray(array) {
    // Fisher-Yates shuffle
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function handleStartGame(e) {
    e.preventDefault();
    setShowGame(true);
    setGameError('');
    setUserSequence([]);
    setShowVisualFallback(false);
    // Always randomize the sequence order
    setSequenceOrder(shuffleArray([0, 1, 2, 3]));
    setSequencePlayed(false);
  }

  async function playSequence() {
    setIsPlaying(true);
    for (let i = 0; i < sequenceOrder.length; i++) {
      const idx = sequenceOrder[i];
      const { src, chorusStart, chorusDuration } = audioClips[idx];
      const audio = new Audio(src);
      audio.currentTime = chorusStart;
      audio.play();
      await new Promise(res => {
        const stop = () => {
          audio.pause();
          audio.currentTime = 0;
          res();
        };
        audio.onended = stop;
        setTimeout(stop, chorusDuration * 1000);
      });
    }
    setIsPlaying(false);
    setSequencePlayed(true);
  }

  function handleUserInput(idx) {
    if (isPlaying) return;
    setUserSequence(seq => {
      const newSeq = [...seq, idx];
      // Only visually indicate selection, do not play audio
      // Check if sequence is complete
      if (newSeq.length === sequenceOrder.length) {
        setTimeout(() => checkSequence(newSeq), 500);
      }
      return newSeq;
    });
  }

  function checkSequence(seq) {
    if (seq.length !== sequenceOrder.length) return;
    const correct = seq.every((val, i) => val === sequenceOrder[i]);
    if (correct) {
      setShowGame(false);
      setGameError('');
      setPassMessage("✅ You passed the audio challenge!");
      setTimeout(() => setPassMessage(""), 2000);
    } else {
      setGameError('Incorrect sequence! Try again or replay the sequence.');
      setPassMessage("❌ Try again!");
      setTimeout(() => setPassMessage(""), 2000);
      setUserSequence([]);
    }
  }

  function handleShowVisualFallback() {
    setShowVisualFallback(true);
    setGameError('');
    setUserSequence([]);
  }

  function handleVisualInput(idx) {
    if (isPlaying) return;
    setUserSequence(seq => {
      const newSeq = [...seq, idx];
      if (newSeq.length === sequenceOrder.length) {
        setTimeout(() => checkSequence(newSeq), 300);
      }
      return newSeq;
    });
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
      // Check if username or email/phone already exists
      const checkRes = await fetch('/api/users/check-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerForm.username,
          emailOrPhone: registerForm.emailOrPhone
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
          emailOrPhone: registerForm.emailOrPhone,
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
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        window.location.href = "/landing-page";
      }, 5000);
    } catch (err) {
      setRegisterError("A server error occurred. Please try again later.");
    }
    setRegisterLoading(false);
  }

  // Login trivia check
  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    // Get user from backend by email/phone (simulate)
    let user;
    try {
      const userRes = await fetch('/api/users/get-by-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: registerForm.emailOrPhone })
      });
      user = await userRes.json();
    } catch {
      setLoginError("A server error occurred. Please try again later.");
      setLoginLoading(false);
      return;
    }
    if (!user || !user.trivia) {
      setLoginError("User not found.");
      setLoginLoading(false);
      return;
    }
    // Check answer
    const q = triviaQuestions[loginTriviaIdx];
    const hashed = sha256(loginTriviaAnswer.trim().toLowerCase()).toString();
    if (hashed === user.trivia[q.key]) {
      setLoginError("");
      setShowPasswordField(true);
    } else {
      setLoginError("Incorrect answer. Try again.");
    }
    setLoginLoading(false);
  }

  // Login password check
  async function handlePasswordLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    // Get user from backend by email/phone (simulate)
    let user;
    try {
      const userRes = await fetch('/api/users/get-by-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: registerForm.emailOrPhone })
      });
      user = await userRes.json();
    } catch {
      setLoginError("A server error occurred. Please try again later.");
      setLoginLoading(false);
      return;
    }
    if (!user || !user.password) {
      setLoginError("User not found.");
      setLoginLoading(false);
      return;
    }
    // Compare password (plain for demo; in production, use hashing)
    if (loginPassword === user.password) {
      setLoginError("");
      window.location.href = "/landing-page";
    } else {
      setLoginError("Incorrect password. Try again.");
    }
    setLoginLoading(false);
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
            ) : (
              tab === 'register' ? (
                showGame ? (
                  <div>
                    <h3 style={{ margin: '0 0 18px 0', fontWeight: 700, color: '#350b0f', fontSize: 22 }}>
                      Listen to the sequence of choruses and repeat it by clicking the buttons below.
                    </h3>
                    <button
                      onClick={playSequence}
                      disabled={isPlaying}
                      style={{
                        marginBottom: 16,
                        background: '#e1bb3e',
                        color: '#350b0f',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 24px',
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: isPlaying ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isPlaying
                        ? "Playing..."
                        : sequencePlayed
                          ? "Replay Sequence"
                          : "Play Sequence"}
                    </button>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 18, justifyContent: 'center' }}>
                      {audioClips.map((clip, idx) => (
                        <button
                          key={clip.name}
                          onClick={() => handleUserInput(idx)}
                          disabled={isPlaying}
                          style={{
                            background: userSequence.includes(idx) ? '#e1bb3e' : '#fff',
                            border: '2px solid #e1bb3e',
                            borderRadius: 8,
                            padding: '12px 18px',
                            fontWeight: 700,
                            fontSize: 16,
                            color: '#350b0f',
                            cursor: isPlaying ? 'not-allowed' : 'pointer',
                            opacity: userSequence.includes(idx) ? 0.7 : 1
                          }}
                        >
                          {clip.name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleShowVisualFallback}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9b1c23',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        marginBottom: 8
                      }}
                    >
                      Can't hear? Use visual fallback
                    </button>
                    {showVisualFallback && (
                      <div>
                        <h4 style={{ color: '#350b0f', marginBottom: 8 }}>Repeat the sequence visually:</h4>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 18, justifyContent: 'center' }}>
                          {audioClips.map((clip, idx) => (
                            <button
                              key={clip.name}
                              onClick={() => handleVisualInput(idx)}
                              style={{
                                background: userSequence.includes(idx) ? '#e1bb3e' : '#fff',
                                border: '2px solid #e1bb3e',
                                borderRadius: 8,
                                padding: '12px 18px',
                                fontWeight: 700,
                                fontSize: 16,
                                color: '#350b0f',
                                cursor: 'pointer',
                                opacity: userSequence.includes(idx) ? 0.7 : 1
                              }}
                            >
                              {clip.name}
                            </button>
                          ))}
                        </div>
                        <div style={{ marginBottom: 8, color: '#888' }}>
                          Sequence: {sequenceOrder.map(idx => audioClips[idx].name).join(' → ')}
                        </div>
                      </div>
                    )}
                    {gameError && <div style={{ color: 'red', marginBottom: 8 }}>{gameError}</div>}
                    {passMessage && (
                      <div style={{
                        color: passMessage.startsWith("✅") ? "#2e7d32" : "#b71c1c",
                        background: passMessage.startsWith("✅") ? "#e8f5e9" : "#ffebee",
                        borderRadius: 8,
                        padding: "8px 16px",
                        marginBottom: 10,
                        fontWeight: 700,
                        fontSize: 18,
                        textAlign: "center"
                      }}>
                        {passMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleStartGame}>
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
                      type="text"
                      placeholder="Email or Phone Number"
                      value={registerForm.emailOrPhone}
                      onChange={e => setRegisterForm(f => ({ ...f, emailOrPhone: e.target.value }))}
                      onFocus={() => setShowContactHint(true)}
                      onBlur={() => setShowContactHint(false)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '1px solid #e9c4b4',
                        fontSize: 16,
                        marginBottom: 8
                      }}
                      required
                    />
                    {showContactHint && (
                      <div style={{
                        color: '#9b1c23',
                        fontSize: 14,
                        marginBottom: 8,
                        background: '#fffbe7',
                        borderRadius: 6,
                        padding: '6px 10px'
                      }}>
                        If entering a phone number, it must start with the country code (e.g. <b>+27</b>).<br />
                        If entering an email, it must contain an <b>@</b> symbol.
                      </div>
                    )}
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
                    {registerError && <div style={{ color: 'red', marginBottom: 8 }}>{registerError}</div>}
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
                      Start Audio Game
                    </button>
                  </form>
                )
              ) : (
                // Login form with trivia and password
                <div>
                  <h3 style={{ margin: '0 0 18px 0', fontWeight: 700, color: '#350b0f', fontSize: 22 }}>Welcome back!</h3>
                  <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={
                    showPasswordField ? handlePasswordLogin : (e) => {
                      e.preventDefault();
                      if (loginTriviaIdx === null) {
                        setLoginTriviaIdx(Math.floor(Math.random() * triviaQuestions.length));
                      } else {
                        handleLoginSubmit(e);
                      }
                    }
                  }>
                    <input
                      type="text"
                      placeholder="Email or Phone Number"
                      value={registerForm.emailOrPhone}
                      onChange={e => setRegisterForm(f => ({ ...f, emailOrPhone: e.target.value }))}
                      onFocus={() => setShowContactHint(true)}
                      onBlur={() => setShowContactHint(false)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '1px solid #e9c4b4',
                        fontSize: 16,
                        marginBottom: 8
                      }}
                      required
                      disabled={showPasswordField}
                    />
                    {showContactHint && (
                      <div style={{
                        color: '#9b1c23',
                        fontSize: 14,
                        marginBottom: 8,
                        background: '#fffbe7',
                        borderRadius: 6,
                        padding: '6px 10px'
                      }}>
                        If entering a phone number, it must start with the country code (e.g. <b>+27</b>).<br />
                        If entering an email, it must contain an <b>@</b> symbol.
                      </div>
                    )}
                    {!showPasswordField && loginTriviaIdx !== null && (
                      <input
                        type="text"
                        placeholder={triviaQuestions[loginTriviaIdx].label}
                        value={loginTriviaAnswer}
                        onChange={e => setLoginTriviaAnswer(e.target.value)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: '1px solid #e9c4b4',
                          fontSize: 16,
                          marginBottom: 8
                        }}
                        required
                      />
                    )}
                    {showPasswordField && (
                      <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: '1px solid #e9c4b4',
                          fontSize: 16,
                          marginBottom: 8
                        }}
                        required
                      />
                    )}
                    {loginError && <div style={{ color: 'red', marginBottom: 8 }}>{loginError}</div>}
                    <button
                      type="submit"
                      className='login-btn'
                      disabled={loginLoading}
                    >
                      {showPasswordField
                        ? (loginLoading ? "Logging in..." : "Login")
                        : (loginTriviaIdx === null ? "Continue" : (loginLoading ? "Checking..." : "Submit Answer"))}
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
              )
            )}
            {/* After game, show password set form */}
            {tab === 'register' && !showGame && !registerLoading && !showSuccess && (
              <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleRegisterSubmit}>
                <input
                  type="password"
                  placeholder="Set Password"
                  value={registerForm.password}
                  onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                  onFocus={() => setShowPasswordHint(true)}
                  onBlur={() => setShowPasswordHint(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #e9c4b4',
                    fontSize: 16,
                    marginBottom: 8
                  }}
                  required
                />
                {showPasswordHint && (
                  <div style={{
                    color: '#9b1c23',
                    fontSize: 14,
                    marginBottom: 8,
                    background: '#fffbe7',
                    borderRadius: 6,
                    padding: '6px 10px'
                  }}>
                    Password must have at least <b>1 capital letter</b> and <b>1 special character</b> (like <b>!</b> or <b>@</b>).
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
                    cursor: 'pointer',
                    marginTop: 8,
                    opacity: registerLoading ? 0.7 : 1
                  }}
                >
                  {registerLoading ? "Registering..." : "Set Password & Register"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

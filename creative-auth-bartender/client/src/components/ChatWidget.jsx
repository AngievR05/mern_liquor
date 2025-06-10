
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatWidget.css';
import ShinyText from './ShinyText';
import { FaComments, FaQuestionCircle, FaTimes } from 'react-icons/fa';

const socket = io();

const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('chatMessages');
    return stored
      ? JSON.parse(stored)
      : [{ text: 'Hi! Welcome to The Drunken Giraffe 🦒🍷. You can ask for pages like "about", "store", or "cart"!', sender: 'bot' }];
  });
  const [botTyping, setBotTyping] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, { text: msg, sender: 'other' }]);
    });
    return () => socket.off('receiveMessage');
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    function handleScroll() {
      const footer = document.getElementById('footer');
      if (!footer) return;
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setBottomOffset(footerRect.top < windowHeight ? (windowHeight - footerRect.top + 20) : 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleNavigation = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('about')) {
      navigate('/about'); return 'Taking you to the About page!';
    } else if (lower.includes('store') || lower.includes('product')) {
      navigate('/store'); return 'Taking you to the Store!';
    } else if (lower.includes('cart')) {
      navigate('/cart'); return 'Taking you to your Cart!';
    } else if (lower.includes('home') || lower.includes('landing')) {
      navigate('/landing-page'); return 'Heading to the Home page!';
    } else if (lower.includes('help')) {
      return 'Try: "about us", "store", "cart", or "home".';
    } else if (lower.includes('hello') || lower.includes('hi')) {
      return 'Hello there! 👋 What can I help you with today?';
    }
    return null;
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const userMsg = { text: message, sender: 'user' };
      setMessages((prev) => [...prev, userMsg]);
      socket.emit('sendMessage', message);
      setMessage('');
      const navResponse = handleNavigation(message);
      setBotTyping(true);
      setTimeout(async () => {
        if (navResponse) {
          setMessages((prev) => [...prev, { text: navResponse, sender: 'bot' }]);
          setBotTyping(false);
        } else {
          try {
            const res = await fetch('/api/ai-chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: userMsg.text })
            });
            const data = await res.json();
            const aiReply = data.reply || "Hmm... I’m not sure how to help with that.";
            setMessages((prev) => [...prev, { text: aiReply, sender: 'bot' }]);
          } catch (err) {
            console.error("AI fetch failed:", err);
            setMessages((prev) => [...prev, { text: "Sorry! AI is currently unavailable.", sender: 'bot' }]);
          } finally {
            setBotTyping(false);
          }
        }
      }, 1200);
    }
  };

  return (
    <div className="chat-widget" style={{ right: 20, bottom: bottomOffset, zIndex: 2000 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
          <FaComments style={{ marginRight: 6 }} />
          <ShinyText text={showChat ? 'Close Chat' : 'Chat'} disabled={false} speed={3} className="chat-shiny-text" />
        </button>
        <button
          className="contact-toggle"
          title="Contact Us"
          onClick={() => setShowContact(true)}
          style={{ background: '#fff', border: '1px solid #e1bb3e', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <FaQuestionCircle color="#9b1c23" size={20} />
        </button>
      </div>
      {showChat && (
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>{msg.text}</div>
            ))}
            {botTyping && <div className="chat-message bot typing">The Drunken Giraffe is typing...</div>}
          </div>
          <div className="chat-input">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

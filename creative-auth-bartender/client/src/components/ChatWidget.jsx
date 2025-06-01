import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatWidget.css';

const socket = io();

const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hi! Welcome to The Drunken Giraffe 🦒🍷. How can we assist you today? You can ask for pages like "about us", "store", or "cart"!', sender: 'bot' }
  ]);
  const [botTyping, setBotTyping] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, { text: msg, sender: 'other' }]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const handleNavigation = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('about')) {
      navigate('/about');
      return 'Taking you to the About page!';
    } else if (lowerText.includes('product') || lowerText.includes('store')) {
      navigate('/store');
      return 'Taking you to the Store!';
    } else if (lowerText.includes('cart')) {
      navigate('/cart');
      return 'Taking you to your Cart!';
    } else if (lowerText.includes('home') || lowerText.includes('landing')) {
      navigate('/landing-page');
      return 'Heading to the Home page!';
    } else if (lowerText.includes('help')) {
      return 'You can ask for "about us", "store", "cart", or "home".';
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return 'Hello there! 👋 What can I help you with today?';
    }
    return null;
  };

  const sendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { text: message, sender: 'user' }]);
      socket.emit('sendMessage', message);
      setMessage('');

      const navResponse = handleNavigation(message);
      setBotTyping(true);
      setTimeout(() => {
        if (navResponse) {
          setMessages(prev => [...prev, { text: navResponse, sender: 'bot' }]);
        } else {
          setMessages(prev => [...prev, { text: 'I\'m here to help! Try asking for "about us", "store", or "cart".', sender: 'bot' }]);
        }
        setBotTyping(false);
      }, 1200); // 1.2 second delay
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-widget">
      <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
        {showChat ? 'Close Chat' : 'Chat'}
      </button>

      {showChat && (
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {botTyping && (
              <div className="chat-message bot typing">
                The Drunken Giraffe is typing...
              </div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

import dotenv from 'dotenv';
dotenv.config(); // <-- Add this at the very top, before any use of process.env

import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs'; // Make sure this is at the top

const router = express.Router();

// Email transporter setup (use your real credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail app password
  }
});

// Remove all verification code logic and always save the password provided in the registration request
// Registration: hash password with bcrypt
router.post('/register', async (req, res) => {
  const { email, username, firstName, lastName, password, trivia } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const userExists = await User.findOne({ $or: [{ email: cleanEmail }, { username }] });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash trivia answers with sha256 (or bcrypt if you want, but keep consistent)
    let hashedTrivia = {};
    if (trivia && typeof trivia === 'object') {
      for (const key in trivia) {
        if (trivia[key]) {
          hashedTrivia[key] = trivia[key]; // Already hashed on frontend, or use sha256 here if needed
        }
      }
    }

    const user = await User.create({
      email: cleanEmail,
      username,
      firstName,
      lastName,
      password: hashedPassword,
      trivia: hashedTrivia
    });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Check if user exists
router.post('/check-exists', async (req, res) => {
  const { email } = req.body;
  try {
    // Defensive: ensure email is a string and not empty
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: 'No email provided' });
    }
    // Debug: log the incoming email and all emails in the DB
    const incoming = email.trim().toLowerCase();
    const allUsers = await User.find({}, { email: 1 });
    console.log('DEBUG: Incoming email:', incoming);
    console.log('DEBUG: All emails in DB:', allUsers.map(u => u.email));
    // Always check email as lowercased and trimmed
    const user = await User.findOne({ email: incoming });
    res.json({ exists: !!user });
  } catch (err) {
    console.error('check-exists error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route to allow trivia lookup by email only
// Password check in login: compare with bcrypt
router.post('/get-by-contact', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'No email provided' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password is provided, check it
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
    }

    res.json({
      username: user.username,
      email: user.email,
      password: user.password // Only for demo; in production, never send password!
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

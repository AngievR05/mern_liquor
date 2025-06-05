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
    // Enforce password conditions: at least 1 capital letter and 1 special character
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ message: 'Password must have at least 1 capital letter and 1 special character.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash trivia answers with sha256 (or bcrypt if you want, but keep consistent)
    let hashedTrivia = {};
    if (trivia && typeof trivia === 'object') {
      for (const key in trivia) {
        if (trivia[key]) {
          hashedTrivia[key] = trivia[key]; // Already hashed on frontend, or hash here if needed
        }
      }
    }

    const user = await User.create({
      email: cleanEmail,
      username,
      firstName,
      lastName,
      password: hashedPassword, // Save hashed password
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

// Remove password from /get-by-contact response and add a dedicated login endpoint
router.post('/get-by-contact', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'No email provided' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Do NOT send password hash to client
    res.json({
      username: user.username,
      email: user.email,
      // Do not send password!
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a dedicated login endpoint that checks password securely
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
      // Add token or other info if needed
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Check if user exists
router.post('/check-exists', async (req, res) => {
  // Defensive: check both username and email if provided
  const { email, username } = req.body;
  try {
    if (email && typeof email === "string" && email.trim()) {
      // Always check email as lowercased and trimmed
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      return res.json({ exists: !!user });
    }
    if (username && typeof username === "string" && username.trim()) {
      const user = await User.findOne({ username: username.trim() });
      return res.json({ exists: !!user });
    }
    return res.status(400).json({ message: 'No email or username provided' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

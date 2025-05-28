import dotenv from 'dotenv';
dotenv.config(); // <-- Add this at the very top, before any use of process.env

import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Helper to generate a 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Email transporter setup (use your real credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail app password
  }
});

// Step 1: Register and send verification code
router.post('/register', async (req, res) => {
  const { email, username, firstName, lastName, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = await User.create({
      email,
      username,
      firstName,
      lastName,
      password,
      isVerified: true // skip verification for now
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

// Step 2: Verify code and set password
router.post('/verify', async (req, res) => {
  const { userId, code, password } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid code' });

  user.password = password;
  user.isVerified = true;
  user.verificationCode = undefined;
  await user.save();

  res.status(201).json({
    _id: user._id,
    email: user.email,
    token: generateToken(user._id)
  });
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
  const { email, username } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

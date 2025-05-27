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
  console.log('Register req.body:', req.body);

  const { email, phone, username, firstName, lastName } = req.body;

  // Validate required fields for registration
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  // Only check for users who have set a password (i.e., completed registration)
  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });
  if (username) query.push({ username });

  if (query.length === 0) {
    return res.status(400).json({ message: 'Email, phone, or username required' });
  }

  const userExists = await User.findOne({
    $or: query,
    password: { $exists: true, $ne: '' }
  });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Remove any previous incomplete registration (no password set)
  await User.deleteMany({
    $or: query,
    $or: [
      { password: { $exists: false } },
      { password: '' }
    ]
  });

  const code = generateVerificationCode();

  // Save user with verification code, no password yet
  let user;
  try {
    user = await User.create({
      email,
      phone,
      username,
      firstName,
      lastName,
      password: '', // Will be set after verification
      isVerified: false,
      verificationCode: code,
    });
    console.log('Created user:', user);
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ message: 'Failed to create user: ' + err.message });
  }

  // Send code via email or (optionally) SMS
  if (email) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`
      });
      console.log(`Verification code sent to email: ${email} - Code: ${code}`);
    } catch (err) {
      console.error('Error sending email:', err);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }
  } else if (phone) {
    // For SMS, you must integrate with an SMS provider here if needed.
    // For now, just log the code for demo/testing.
    console.log(`Verification code sent to phone: ${phone} - Code: ${code}`);
  }

  res.status(200).json({ message: 'Verification code sent', userId: user._id });
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

export default router;

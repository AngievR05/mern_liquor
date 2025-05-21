import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// Helper to generate a 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register (step 1: send verification code)
router.post('/register', async (req, res) => {
  const { email, phone, username } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const code = generateVerificationCode();

  // Save code and user details temporarily (not yet verified)
  let user = await User.create({
    email,
    phone,
    username,
    password: '', // Will be set after verification
    isVerified: false,
    verificationCode: code,
  });

  // TODO: Send code via email or SMS
  // await sendEmailOrSMS(email, phone, code);

  res.status(200).json({ message: 'Verification code sent', userId: user._id });
});

// Verify code and set password (step 2)
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

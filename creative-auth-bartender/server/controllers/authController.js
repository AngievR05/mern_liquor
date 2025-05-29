import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  try {
    // Check if user exists by username or email
    const userExists = await User.findOne({ $or: [{ email: email.trim().toLowerCase() }, { username }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Defensive: check for missing required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      username,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Defensive: check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.error('Login failed: user not found for email', cleanEmail);
      // Debug: list all emails in DB for troubleshooting
      const allUsers = await User.find({}, { email: 1, password: 1, username: 1 });
      console.log('DEBUG: All users in DB:', allUsers);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Debug: log the hashed password in DB and the password being checked
    console.log('DEBUG: User email:', cleanEmail);
    console.log('DEBUG: Hashed password in DB:', user.password);
    console.log('DEBUG: Password provided:', password);

    // Extra debug: check password length and type
    console.log('DEBUG: typeof password:', typeof password, 'length:', password.length);

    // Check for double-hashing or frontend bug
    if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
      console.error('WARNING: The password sent from the frontend is already a bcrypt hash! You must send the plain password, not the hash.');
      return res.status(401).json({ message: 'Frontend is sending a hashed password. Please send the plain password.' });
    }

    // Use bcrypt.compare directly
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('DEBUG: bcrypt.compare result:', passwordMatch);
    if (!passwordMatch) {
      console.error('Login failed: password mismatch for email', cleanEmail);
      // Debug: show what bcrypt would hash the plain password to
      const testHash = await bcrypt.hash(password, 10);
      console.log('DEBUG: Hash of provided password (for troubleshooting):', testHash);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: false,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    unique: false,
    trim: true
  },
  username: {
    type: String,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

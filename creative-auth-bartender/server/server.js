import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js'; // <-- Add this import

dotenv.config(); // Load .env

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/public')));

// Debug log: Check if MONGO_URI is loading
console.log('MONGO_URI:', process.env.MONGO_URI);

// Multer upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'client/public/uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // <-- Add this line

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

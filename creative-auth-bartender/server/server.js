import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import nodemailer from 'nodemailer';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend static files (client/public)
app.use(express.static(path.join(__dirname, 'client/public')));

// ✅ Multer upload config — saves to React's public folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'client/public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ✅ Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ filePath: `/uploads/${req.file.filename}` }); // <-- frontend will use this path
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Serve uploaded files from /client/public/uploads (handled by React, no extra config needed)

// === Keep all your admin, seller, and application routes here as-is ===
// (You don’t need to modify those unless the uploads are failing)

// ... (your admin, seller, application, and email code remains unchanged) ...

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected');
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Example dynamic product route (optional)
app.get('/api/products', async (req, res) => {
  try {
    const filter = {};
    if (req.query.seller) filter.seller = req.query.seller;
    if (req.query.companyName && !req.query.seller) filter.companyName = req.query.companyName;
    const products = await mongoose.model('Product').find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

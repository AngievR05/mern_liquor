import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import productRoutes from './routes/productRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/apiDocumentation.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// Serve static files (images, etc.)
app.use(express.static(path.join(__dirname, 'client/public')));

// Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'client/public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ filePath });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/products', productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

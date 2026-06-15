import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
import Counter from './models/Counter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import playerRoutes from './routes/playerRoutes.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cricket-form-lac.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static('uploads'));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const existingCounter = await Counter.findById("playerId");

    if (!existingCounter) {
      await Counter.create({
        _id: "playerId",
        seq: 0,
      });

      console.log("Counter initialized");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(err);
  }
};

startServer();
  
app.use('/api', playerRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
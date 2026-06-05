import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
dotenv.config();

console.log(process.env.MONGO_URI);


import playerRoutes from './routes/playerRoutes.js';

const app = express();
app.use(cors(),
allowedOrigins = [ 'https://cricket-form-lac.vercel.app'],

);
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error(err);
  });
  
app.use('/api', playerRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
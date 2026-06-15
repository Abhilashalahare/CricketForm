import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
import Counter from './models/Counter.js';

console.log(process.env.MONGO_URI);


import playerRoutes from './routes/playerRoutes.js';

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


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error(err);
  });

  const initializeCounter = async () => {
  const existingCounter = await Counter.findById('playerId');
  if (!existingCounter) {
    await Counter.create({ _id: 'playerId', seq: 0 });
    console.log("Counter initialized.");
  }
};

initializeCounter();
  
app.use('/api', playerRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
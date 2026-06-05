import express from 'express';
const router = express.Router();
import Player from '../models/Player.js';
import { verifyToken } from '../middleware/authMiddlewares.js';


router.post('/register', async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json({ message: 'Registration Successful!' });
  } catch (error) {
    // MongoDB duplicate key error code is 11000
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]; // Identifies which field caused the block
      return res.status(400).json({ 
        error: `Registration failed: This ${field} is already registered.` 
      });
    }
    res.status(500).json({ error: 'Server Error. Please try again later.' });
  }
});


router.get('/admin/players', verifyToken, async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player data.' });
  }
});


router.get('/admin/players/:id', verifyToken, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found.' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Server Error.' });
  }
});

router.delete('/admin/players/:id', verifyToken, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

export default router;
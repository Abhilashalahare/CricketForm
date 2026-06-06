import Player from '../models/Player.js';

// REGISTER PLAYER
export const registerPlayer = async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Backend Validation Error:", error);

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages[0] });
    }

    // Handle Duplicate Key Errors (Unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate field value entered." });
    }

    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// GET ALL PLAYERS
export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player data.' });
  }
};

// GET SINGLE PLAYER
export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found.' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Server Error.' });
  }
};

// DELETE PLAYER
export const deletePlayer = async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
};
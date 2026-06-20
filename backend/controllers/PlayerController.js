import Player from '../models/Player.js';
import Counter from '../models/Counter.js';
import {sendWhatsAppMessage} from '../services/whatsappService.js'
import GiftConfig from '../models/GiftConfig.js';

// REGISTER PLAYER
export const registerPlayer = async (req, res) => {
 let whatsappNumber;
  const rawNumber = req.body.whatsappNumber.replace(/\D/g, "");

  if (rawNumber.length === 10) {
    whatsappNumber = `91${rawNumber}`;
  } else if (rawNumber.length === 12 && rawNumber.startsWith("91")) {
    whatsappNumber = rawNumber;
  } else {
    return res.status(400).json({
      error: "Invalid WhatsApp number"
    });
  }
  try {
    // 1. Validate that files were uploaded by the middleware
    if (!req.files || !req.files['photo']) {
      return res.status(400).json({
        error: "Please upload profile photo."
      });
    }

    if (
      req.body.paymentMethod === "UPI" &&
      (!req.files['utrReceipt'] || req.files['utrReceipt'].length === 0)
    ) {
      return res.status(400).json({
        error: "Please upload payment receipt for UPI payment."
      });
    }

    // 2. Find and increment the serial number counter
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'playerId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const formattedSerial = `JYCC-${counter.seq.toString().padStart(3, '0')}`;

    // 3. Extract file paths from Multer
    const photoPath = req.files['photo'][0].path;
    // const receiptPath = req.files['utrReceipt'][0].path;
    const receiptPath = req.files['utrReceipt']
      ? req.files['utrReceipt'][0].path
      : null;


     let giftAllocated = false;

    // Atomic update (safe for concurrent registrations)
    const gift = await GiftConfig.findOneAndUpdate(
      {
        claimed: { $lt: 50 }
      },
      {
        $inc: { claimed: 1 }
      },
      {
        new: true
      }
    );

    if (gift) {
      giftAllocated = true;
    }

    // 4. Create new player instance
    // We spread req.body to get all text fields, then override files and serial
    const newPlayer = new Player({
      ...req.body,
        cricheroesId: req.body.cricheroesId || undefined,
        instagramId: req.body.instagramId || undefined,
      whatsappNumber,
      submissionDate: req.body.submissionDate || new Date(),
      photo: photoPath,
      utrReceipt: receiptPath,
      serialNumber: formattedSerial,
      giftAllocated,
      aadharNumber: req.body.aadharNumber


    });

    await newPlayer.save();

    // Background me WhatsApp bhejo
    sendWhatsAppMessage(
      newPlayer.whatsappNumber,
      newPlayer.fullName,
      formattedSerial,
      giftAllocated,
    ).catch(err => {
      console.error("WhatsApp Error:", err.message);
    });

    // User ko turant response
    res.status(201).json({
      message: "Registration Successful",
      serial: formattedSerial
    });

  } catch (error) {
    console.error("Backend Error:", error);

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages[0] });
    }

    // Handle Duplicate Key Errors (Unique constraint)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const formattedField = field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());

      return res.status(400).json({
        error: `${formattedField === 'Aadhar Number' ? '[Aadhaar Redacted]' : formattedField} is already registered.`
      });
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
    console.error("FULL ERROR:", error);
    console.error("MESSAGE:", error.message);

    res.status(500).json({
      error: "Failed to fetch player data",
      details: error.message
    });
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

export const getGiftStatus = async (req, res) => {
  try {

    let gift = await GiftConfig.findOne();

    if (!gift) {

      gift = await GiftConfig.create({
        name: "First 50 Gift Offer",
        limit: 50,
        claimed: 0
      });

    }

    res.json({
      totalSlots: gift.limit,
      claimedSlots: gift.claimed,
      remainingSeats: gift.limit - gift.claimed,
      giftAvailable: gift.claimed < gift.limit
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
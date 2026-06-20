import express from 'express';
import { verifyToken } from '../middleware/authMiddlewares.js';
import { 
  registerPlayer, 
  getAllPlayers, 
  getPlayerById, 
  deletePlayer, 
  getGiftStatus
} from '../controllers/PlayerController.js';
import Counter from '../models/Counter.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

 const uploadFields = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'utrReceipt', maxCount: 1 }]);

router.post('/register', uploadFields, registerPlayer);
router.post('/admin/init-counter', async (req, res) => {
  try {
    const counter = await Counter.findById('playerId');
    if (!counter) {
      await Counter.create({ _id: 'playerId', seq: 0 });
      return res.status(200).json({ message: "Counter initialized to 0" });
    }
    res.status(200).json({ message: "Counter already exists" });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize" });
  }
});
router.get('/admin/players', verifyToken, getAllPlayers);
router.get('/admin/players/:id', verifyToken, getPlayerById);
router.delete('/admin/players/:id', verifyToken, deletePlayer);

router.get("/gift-status", getGiftStatus);

export default router;
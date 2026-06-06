import express from 'express';
import { verifyToken } from '../middleware/authMiddlewares.js';
import { 
  registerPlayer, 
  getAllPlayers, 
  getPlayerById, 
  deletePlayer 
} from '../controllers/PlayerController.js';

const router = express.Router();

router.post('/register', registerPlayer);
router.get('/admin/players', verifyToken, getAllPlayers);
router.get('/admin/players/:id', verifyToken, getPlayerById);
router.delete('/admin/players/:id', verifyToken, deletePlayer);

export default router;
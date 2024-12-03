// src/routes/playerRoutes.ts
import { Router } from 'express';
import { createPlayer, updatePlayer, deletePlayer, getPlayers } from '../controllers/playerController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Route to get all players
router.get('/', authenticateJWT, getPlayers);

// Route to create a new player
router.post('/', authenticateJWT, createPlayer);

// Route to update a player by ID
router.put('/:id', authenticateJWT, updatePlayer);

// Route to delete a player by ID
router.delete('/:id', authenticateJWT, deletePlayer);

export default router;

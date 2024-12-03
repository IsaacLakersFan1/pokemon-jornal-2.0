// src/controllers/playerController.ts
import { Request, Response } from 'express';
import prisma from '../prismaClient';

interface AuthenticatedRequest extends Request {
    user?: {
      userId: number; // The type of `userId` that you'll get from the JWT payload
    };
  }

// Create a new player
export const createPlayer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { name, pokemonId } = req.body;
    const userId = req.user?.userId;  // Extract userId from the authenticated user
  
    if (!userId) {
      res.status(400).json({ error: 'User not authenticated' });
      return;
    }
  
    try {
      const newPlayer = await prisma.player.create({
        data: {
          name,
          pokemonId,
          userId,  // Associate player with authenticated user
        },
      });
  
      res.status(201).json({ message: 'Player created successfully', player: newPlayer });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create player' });
    }
  };
  

// Update a player's information
export const updatePlayer = async (req: Request, res: Response): Promise<void> => {
  const playerId = parseInt(req.params.id);
  const { name, pokemonId } = req.body;

  try {
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { name, pokemonId },
    });

    res.status(200).json({ message: 'Player updated successfully', player: updatedPlayer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update player' });
  }
};

// Delete a player by ID
export const deletePlayer = async (req: Request, res: Response): Promise<void> => {
  const playerId = parseInt(req.params.id);

  try {
    await prisma.player.delete({
      where: { id: playerId },
    });

    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
};

// Get all players for the authenticated user
export const getPlayers = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Fetch players with related Pokémon data
    const players = await prisma.player.findMany({
      where: { userId },
      include: {
        pokemon: true,  // Include the related Pokémon data
      },
    });

    // Return players along with Pokémon information
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

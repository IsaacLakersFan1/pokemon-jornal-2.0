import { Request, Response } from 'express';
import prisma from '../prismaClient';

// Create a new Pokémon
export const createPokemon = async (req: Request, res: Response): Promise<void> => {
  const { nationalDex, name, form, type1, type2, total, hp, attack, defense, specialAttack, specialDefense, speed, generation } = req.body;

  try {
    const newPokemon = await prisma.pokemon.create({
      data: {
        nationalDex,
        name,
        form,
        type1,
        type2,
        total,
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        generation,
      },
    });

    res.status(201).json({ message: 'Pokémon created successfully', pokemon: newPokemon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Pokémon' });
  }
};

// Get all Pokémon
export const getAllPokemon = async (req: Request, res: Response): Promise<void> => {
  try {
    const pokemons = await prisma.pokemon.findMany();
    res.status(200).json({ pokemons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pokémon' });
  }
};

// Get a Pokémon by ID
export const getPokemonById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pokemon) {
      res.status(404).json({ error: 'Pokémon not found' });
      return;
    }

    res.status(200).json({ pokemon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pokémon' });
  }
};

// Update a Pokémon by ID
export const updatePokemon = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, form, type1, type2, total, hp, attack, defense, specialAttack, specialDefense, speed, generation } = req.body;

  try {
    const updatedPokemon = await prisma.pokemon.update({
      where: { id: parseInt(id) },
      data: {
        name,
        form,
        type1,
        type2,
        total,
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        generation,
      },
    });

    res.status(200).json({ message: 'Pokémon updated successfully', pokemon: updatedPokemon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Pokémon' });
  }
};

// Delete a Pokémon by ID
export const deletePokemon = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedPokemon = await prisma.pokemon.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Pokémon deleted successfully', pokemon: deletedPokemon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Pokémon' });
  }
};

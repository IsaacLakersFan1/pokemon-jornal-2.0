import { Router } from 'express';
import { createPokemon, getAllPokemon, getPokemonById, updatePokemon, deletePokemon } from '../controllers/pokemonController';

const router = Router();

// POST: Create a new Pokémon
router.post('/pokemon', createPokemon);

// GET: Get all Pokémon
router.get('/pokemon', getAllPokemon);

// GET: Get Pokémon by ID
router.get('/pokemon/:id', getPokemonById);

// PUT: Update Pokémon by ID
router.put('/pokemon/:id', updatePokemon);

// DELETE: Delete Pokémon by ID
router.delete('/pokemon/:id', deletePokemon);

export default router;

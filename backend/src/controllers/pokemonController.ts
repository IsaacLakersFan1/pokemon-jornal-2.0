import { Request, Response } from 'express';
import prisma from '../prismaClient';
import multer from "multer";
import path from "path";


// Set up Multer storage (save images to "public" folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public")); // Save to "public" folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${Date.now()}-${file.fieldname}${ext}`); // Generate unique filename
  },
});

// Validate file type (only PNG)
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only PNG files are allowed!"), false);
  }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

// Create a new Pokémon
export const createPokemon = async (req: Request, res: Response): Promise<void> => {
  const { 
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
    generation 
  } = req.body;

  try {
    // Generate the image and shinyImage fields based on the name
    const lowerCaseName = name.toLowerCase();
    const image = lowerCaseName;
    const shinyImage = `${lowerCaseName}-shiny`;

    // Create Pokémon with the generated image fields
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
        image,        // Auto-filled field
        shinyImage,   // Auto-filled field
      },
    });

    res.status(201).json({ message: 'Pokémon created successfully', pokemon: newPokemon });
  } catch (error) {
    console.error("Error creating Pokémon:", error);
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

// Updated endpoint to handle image uploads and Pokémon updates
export const updatePokemon = async (req: Request, res: Response): Promise<void> => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { id } = req.params;
    const {
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
    } = req.body;

    try {
      const data: any = {
        name,
        form,
        type1,
        type2,
        total: parseInt(total),
        hp: parseInt(hp),
        attack: parseInt(attack),
        defense: parseInt(defense),
        specialAttack: parseInt(specialAttack),
        specialDefense: parseInt(specialDefense),
        speed: parseInt(speed),
        generation: parseInt(generation),
      };

      // If a file was uploaded, update the image field
      if (req.file) {
        data.image = req.file.filename; // Save the image filename to DB
      }

      const updatedPokemon = await prisma.pokemon.update({
        where: { id: parseInt(id) },
        data,
      });

      res.status(200).json({ message: "Pokémon updated successfully", pokemon: updatedPokemon });
    } catch (error) {
      console.error("Error updating Pokémon:", error);
      res.status(500).json({ error: "Failed to update Pokémon" });
    }
  });
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

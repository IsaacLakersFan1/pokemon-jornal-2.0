import { Request, Response } from 'express';
import prisma from '../prismaClient';
import multer from "multer";
import path from "path";


// Set up Multer storage (save images to "public" folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/PokemonImages")); // Save to "PokemonImages" folder inside public
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const baseName = Date.now() + "-" + file.fieldname; // Use only the base name without extension
    cb(null, `${baseName}${ext}`); // Save file with extension, but store only the base name in the DB
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
  // Handle the image upload via multer middleware
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { nationalDex, name, form, type1, type2, hp, attack, defense, specialAttack, specialDefense, speed, generation } = req.body;

    // Calculate total points
    const total = parseInt(hp) + parseInt(attack) + parseInt(defense) + parseInt(specialAttack) + parseInt(specialDefense) + parseInt(speed);

    // Generate image names
    const lowerCaseName = name.toLowerCase();
    const image = lowerCaseName;
    const shinyImage = `${lowerCaseName}-shiny`;

    try {
      // Create Pokémon record in the DB
      const newPokemon = await prisma.pokemon.create({
        data: {
          nationalDex: parseInt(nationalDex),
          name,
          form,
          type1,
          type2,
          total,
          hp: parseInt(hp),
          attack: parseInt(attack),
          defense: parseInt(defense),
          specialAttack: parseInt(specialAttack),
          specialDefense: parseInt(specialDefense),
          speed: parseInt(speed),
          generation: parseInt(generation),
          image,
          shinyImage,
        },
      });

      // If an image was uploaded, update the image field
      if (req.file) {
        const imageNameWithoutExtension = path.basename(req.file.filename, path.extname(req.file.filename));
        newPokemon.image = imageNameWithoutExtension; // Save only the base name without extension
      }

      res.status(201).json({ message: 'Pokémon created successfully', pokemon: newPokemon });
    } catch (error) {
      console.error('Error creating Pokémon:', error);
      res.status(500).json({ error: 'Failed to create Pokémon' });
    }
  });
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

      // If a file was uploaded, update the image field (save without extension)
      if (req.file) {
        const imageNameWithoutExtension = path.basename(req.file.filename, path.extname(req.file.filename));
        data.image = imageNameWithoutExtension; // Save only the name without the extension
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

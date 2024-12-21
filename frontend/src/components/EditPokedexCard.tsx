import React, { useState } from "react";
import axios from "axios";
import { Pokemon } from "../types/types";

interface EditPokedexCardProps {
  pokemon: Pokemon;
  onUpdate: (updatedPokemon: Pokemon) => void;
  onClose: () => void;
}

const EditPokedexCard: React.FC<EditPokedexCardProps> = ({
  pokemon,
  onUpdate,
  onClose,
}) => {
  const [editedPokemon, setEditedPokemon] = useState(pokemon);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const token = localStorage.getItem("authToken");

  const handleChange = (key: keyof Pokemon, value: string | number) => {
    setEditedPokemon({ ...editedPokemon, [key]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", editedPokemon.name);
    formData.append("form", editedPokemon.form || "");
    formData.append("type1", editedPokemon.type1 || "");
    formData.append("type2", editedPokemon.type2 || "");
    formData.append("total", editedPokemon.total.toString());
    formData.append("hp", editedPokemon.hp.toString());
    formData.append("attack", editedPokemon.attack.toString());
    formData.append("defense", editedPokemon.defense.toString());
    formData.append("specialAttack", editedPokemon.specialAttack.toString());
    formData.append("specialDefense", editedPokemon.specialDefense.toString());
    formData.append("speed", editedPokemon.speed.toString());
    formData.append("generation", editedPokemon.generation.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/pokemons/pokemon/${pokemon.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data.pokemon);
        onClose();
      }
    } catch (error) {
      console.error("Error updating Pokémon:", error);
    }
  };

  return (
    <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          Edit {pokemon.name}
        </h2>

        {/* Image */}
        <div className="mb-4 flex flex-col items-center">
          <img
            src={`http://localhost:3000/public/PokemonImages/${pokemon.image}.png`}
            alt={pokemon.name}
            className="w-24 h-24 mb-2"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md mb-4"
          />
        </div>

        {/* Name */}
        <input
          type="text"
          value={editedPokemon.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Form */}
        <input
          type="text"
          value={editedPokemon.form || ""}
          onChange={(e) => handleChange("form", e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Type 1 */}
        <select
          value={editedPokemon.type1 || ""}
          onChange={(e) => handleChange("type1", e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Select Type</option>
          <option value="">Select Type 1</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Grass">Grass</option>
          <option value="Electric">Electric</option>
          <option value="Bug">Bug</option>
          <option value="Normal">Normal</option>
          <option value="Fairy">Fairy</option>
          <option value="Fighting">Fighting</option>
          <option value="Psychic">Psychic</option>
          <option value="Ghost">Ghost</option>
          <option value="Dragon">Dragon</option>
          <option value="Dark">Dark</option>
          <option value="Steel">Steel</option>
          <option value="Ice">Ice</option>
          <option value="Rock">Rock</option>
          <option value="Ground">Ground</option>
          <option value="Flying">Flying</option>
          {/* Add more types */}
        </select>

        {/* Type 2 */}
        <select
          value={editedPokemon.type2 || ""}
          onChange={(e) => handleChange("type2", e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Select Type</option>
          <option value="">Select Type 1</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Grass">Grass</option>
          <option value="Electric">Electric</option>
          <option value="Bug">Bug</option>
          <option value="Normal">Normal</option>
          <option value="Fairy">Fairy</option>
          <option value="Fighting">Fighting</option>
          <option value="Psychic">Psychic</option>
          <option value="Ghost">Ghost</option>
          <option value="Dragon">Dragon</option>
          <option value="Dark">Dark</option>
          <option value="Steel">Steel</option>
          <option value="Ice">Ice</option>
          <option value="Rock">Rock</option>
          <option value="Ground">Ground</option>
          <option value="Flying">Flying</option>
          {/* Add more types */}
        </select>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <input
            type="number"
            value={editedPokemon.hp || ""}
            onChange={(e) => handleChange("hp", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            placeholder="HP"
          />
          <input
            type="number"
            value={editedPokemon.attack || ""}
            onChange={(e) => handleChange("attack", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            placeholder="Attack"
          />
          <input
            type="number"
            value={editedPokemon.defense || ""}
            onChange={(e) => handleChange("defense", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            placeholder="Defense"
          />
          <input
            type="number"
            value={editedPokemon.specialAttack || ""}
            onChange={(e) =>
              handleChange("specialAttack", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded-md"
            placeholder="Special Attack"
          />
          <input
            type="number"
            value={editedPokemon.specialDefense || ""}
            onChange={(e) =>
              handleChange("specialDefense", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded-md"
            placeholder="Special Defense"
          />
          <input
            type="number"
            value={editedPokemon.speed || ""}
            onChange={(e) => handleChange("speed", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            placeholder="Speed"
          />
          <input
            type="number"
            value={editedPokemon.generation || ""}
            onChange={(e) =>
              handleChange("generation", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded-md"
            placeholder="Generation"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPokedexCard;

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CreatePokemonFormProps {
  onClose: () => void;
  onCreate: (newPokemon: any) => void;
}

const CreatePokemonForm: React.FC<CreatePokemonFormProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nationalDex: "",
    name: "",
    form: "",
    type1: "",
    type2: "",
    hp: "",
    attack: "",
    defense: "",
    specialAttack: "",
    specialDefense: "",
    speed: "",
    generation: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("You need to be logged in.");
        return;
      }

      const total =
        parseInt(formData.hp || "0") +
        parseInt(formData.attack || "0") +
        parseInt(formData.defense || "0") +
        parseInt(formData.specialAttack || "0") +
        parseInt(formData.specialDefense || "0") +
        parseInt(formData.speed || "0");

      const payload = new FormData();
      payload.append("nationalDex", formData.nationalDex);
      payload.append("name", formData.name);
      payload.append("form", formData.form);
      payload.append("type1", formData.type1);
      payload.append("type2", formData.type2 || "");
      payload.append("hp", formData.hp);
      payload.append("attack", formData.attack);
      payload.append("defense", formData.defense);
      payload.append("specialAttack", formData.specialAttack);
      payload.append("specialDefense", formData.specialDefense);
      payload.append("speed", formData.speed);
      payload.append("generation", formData.generation);
      payload.append("total", String(total));
      if (image) payload.append("image", image);

      const response = await axios.post("http://localhost:3000/pokemons/pokemon", payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message || "Pokémon created successfully!");
        onCreate(response.data.pokemon);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to create Pokémon.");
      }
    } catch (error) {
      console.error("Error creating Pokémon:", error);
      toast.error("Failed to create Pokémon.");
    }
  };

  return (
    <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-center">Create New Pokémon</h2>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
        >
          X
        </button>

        {/* Form Inputs */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded-md"
        />
        <input
          type="number"
          name="nationalDex"
          value={formData.nationalDex}
          onChange={handleChange}
          placeholder="National Dex (Fakemons - 100,000) (Regional forms - same National Dex)"
          className="w-full p-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          name="form"
          value={formData.form}
          onChange={handleChange}
          placeholder="Form"
          className="w-full p-2 mb-4 border rounded-md"
        />
        <select
          name="type1"
          value={formData.type1}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-md"
        >
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
        </select>
        <select
          name="type2"
          value={formData.type2}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-md"
        >
          <option value="">Select Type 2 (optional)</option>
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
        </select>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"] as const).map((stat) => (
            <input
              key={stat}
              type="number"
              name={stat}
              value={formData[stat as keyof typeof formData]} // Use type assertion here
              onChange={handleChange}
              placeholder={stat.toUpperCase()}
              className="w-full p-2 border rounded-md"
            />
          ))}
        </div>

        <input
          type="number"
          name="generation"
          value={formData.generation}
          onChange={handleChange}
          placeholder="Generation (FanGames use 10,001)"
          className="w-full p-2 mb-4 border rounded-md"
        />

        {/* Image Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Create Pokémon
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CreatePokemonForm;

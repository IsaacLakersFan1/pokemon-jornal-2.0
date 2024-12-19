import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaInfoCircle, FaEdit, FaPlus } from "react-icons/fa";

interface Pokemon {
  id: number;
  nationalDex: number;
  name: string;
  form: string | null;
  type1: string;
  type2?: string | null;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  generation: number;
  image: string;
  shinyImage: string;
}

const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    Bug: "#A8B820",
    Dark: "#705848",
    Dragon: "#6F35FC",
    Electric: "#F8D030",
    Fairy: "#F7A5D4",
    Fighting: "#C03028",
    Fire: "#F08030",
    Flying: "#A890F0",
    Ghost: "#705898",
    Grass: "#78C850",
    Ground: "#E0C068",
    Ice: "#98D8D8",
    Normal: "#A8A878",
    Poison: "#A040A0",
    Psychic: "#F85888",
    Rock: "#B8A038",
    Steel: "#B8B8D0",
    Water: "#6890F0",
  };
  return typeColors[type] || "#A8A8A8"; // Default gray
};

const TYPE_COLORS = {
  Bug: "#A8B820",
  Dark: "#705848",
  Dragon: "#6F35FC",
  Electric: "#F8D030",
  Fairy: "#F7A5D4",
  Fighting: "#C03028",
  Fire: "#F08030",
  Flying: "#A890F0",
  Ghost: "#705898",
  Grass: "#78C850",
  Ground: "#E0C068",
  Ice: "#98D8D8",
  Normal: "#A8A878",
  Poison: "#A040A0",
  Psychic: "#F85888",
  Rock: "#B8A038",
  Steel: "#B8B8D0",
  Water: "#6890F0",
};

const PokedexPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newPokemon, setNewPokemon] = useState<any>({});
  const [editedPokemon, setEditedPokemon] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const token = localStorage.getItem("authToken");

  // Fetch all Pokémon
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pokemons/pokemon");
        setPokemons(response.data.pokemons);
        setFilteredPokemons(response.data.pokemons);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      }
    };
    fetchPokemons();
  }, []);

  // Search Pokémon dynamically
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredPokemons(pokemons);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3000/events/pokemon/search?searchTerm=${value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFilteredPokemons(response.data);
      } catch (error) {
        console.error("Error during search:", error);
      }
    }
  };

  // Open Pokémon Details Modal
  const openModal = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
    setIsModalOpen(false);
  };

  // Open Create Pokémon Modal
  const openCreateModal = () => {
    setNewPokemon({});
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Create a new Pokémon
  const handleCreatePokemon = async () => {
    const image = newPokemon.name?.toLowerCase();
    const shinyImage = `${image}-shiny`;

    const payload = { ...newPokemon, image, shinyImage };

    try {
      await axios.post("http://localhost:3000/pokemons/pokemon", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsCreateModalOpen(false);
      alert("Pokémon created successfully!");
    } catch (error) {
      console.error("Error creating Pokémon:", error);
    }
  };

  const handleUpdatePokemon = async () => {
    const formData = new FormData();

    // Append updated fields
    for (const key in editedPokemon) {
      formData.append(key, editedPokemon[key]);
    }

    // Append image if selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.put(
        `http://localhost:3000/pokemons/pokemon/${editedPokemon.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Pokémon updated successfully!");
      setIsEditModalOpen(false);
      // Optionally refetch Pokémon data
    } catch (error) {
      console.error("Error updating Pokémon:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Page Navigation */}
      <div className="flex justify-between mb-6">
        <h1 className="text-4xl">Pokedex</h1>
        <div className="space-x-4">
          <Link to={`/games/${id}`} className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Home
          </Link>
          <Link to={`/games/${id}/players`} className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Players
          </Link>
          <Link to="/games" className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Games
          </Link>
          <Link to={`/games/${id}/pokedex`} className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Pokedex
          </Link>
        </div>
      </div>

      {/* Search Bar and Create Button */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-3/4 p-2 border rounded-md"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={openCreateModal}
        >
          <FaPlus className="inline-block mr-2" /> Create Pokémon
        </button>
      </div>

      {/* Pokémon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon) => (
          <div key={pokemon.id} className="border rounded-lg shadow-lg p-4 text-center">
            <p className="font-bold">National Dex #{pokemon.nationalDex}</p>
            <h3 className="text-lg font-bold">{pokemon.name}</h3>
            <h3 className="text-md ">{pokemon.form}</h3>
            <img src={`/${pokemon.image}.png`} alt={pokemon.name} className="w-36 h-36 mx-auto mt-2" />
            <div className="flex justify-center gap-2 mt-2">
              <span
                className="text-white px-2 py-1 rounded-md"
                style={{ backgroundColor: getTypeColor(pokemon.type1) }}
              >
                {pokemon.type1}
              </span>
              {pokemon.type2 && (
                <span
                  className="text-white px-2 py-1 rounded-md"
                  style={{ backgroundColor: getTypeColor(pokemon.type2) }}
                >
                  {pokemon.type2}
                </span>
              )}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => openModal(pokemon)}
            >
              <FaInfoCircle className="inline-block mr-2" /> More Info
            </button>
          </div>
        ))}
      </div>

      {/* Pokémon Details Modal */}
      {isModalOpen && selectedPokemon && (
        <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold">{selectedPokemon.name}</h2>
            <div className="mt-4">
              <img
                src={`/${selectedPokemon.image}.png`}
                alt={selectedPokemon.name}
                className="w-48 h-48 mx-auto mb-4"
              />
              <p>Type: {selectedPokemon.type1}</p>
              {selectedPokemon.type2 && <p>Secondary Type: {selectedPokemon.type2}</p>}
              <p>HP: {selectedPokemon.hp}</p>
              <p>Attack: {selectedPokemon.attack}</p>
              <p>Defense: {selectedPokemon.defense}</p>
              <p>Special Attack: {selectedPokemon.specialAttack}</p>
              <p>Special Defense: {selectedPokemon.specialDefense}</p>
              <p>Speed: {selectedPokemon.speed}</p>
              <p>Generation: {selectedPokemon.generation}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsEditModalOpen(true)}
              >
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Pokémon Modal */}
      {isCreateModalOpen && (
        <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold">Create New Pokémon</h2>
            <input
              type="text"
              placeholder="Name"
              value={newPokemon.name}
              onChange={(e) =>
                setNewPokemon({ ...newPokemon, name: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded-md"
            />
            {/* Add form fields for other attributes of new Pokémon here */}
            <button
              onClick={handleCreatePokemon}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Create
            </button>
            <button
              onClick={closeCreateModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Pokémon Modal */}
      {isEditModalOpen && selectedPokemon && (
        <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold">Edit Pokémon</h2>
            <input
              type="text"
              placeholder="Name"
              value={editedPokemon.name || selectedPokemon.name}
              onChange={(e) =>
                setEditedPokemon({ ...editedPokemon, name: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded-md"
            />
            {/* Add other fields to edit */}
            <button
              onClick={handleUpdatePokemon}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokedexPage;

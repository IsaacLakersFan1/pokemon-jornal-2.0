import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import API_BASE_URL from "../apiConfig";
import PokedexCard from "../components/PokedexCard";
import InformationPokedexCard from "../components/InformationPokedexCard";
import EditPokedexCard from "../components/EditPokedexCard";
import CreatePokemonForm from "../components/CreatePokemonForm";
import { Pokemon } from "../types/types";

const PokedexPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [typeEffectiveness, setTypeEffectiveness] = useState<{ [key: string]: number }>({});
  const [modalState, setModalState] = useState({
    info: false,
    create: false,
    edit: false,
  });

  // Fetch Pokémon list on component mount
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/pokemons/pokemon`);
        setPokemons(response.data.pokemons);
        setFilteredPokemons(response.data.pokemons);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      }
    };
    fetchPokemons();
  }, []);

  // Handle Search
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredPokemons(pokemons);
    } else {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/pokemons/pokemon/search?searchTerm=${value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setFilteredPokemons(response.data);
      } catch (error) {
        console.error("Error during search:", error);
      }
    }
  };

  // Modal Handlers
  const openModal = async (type: "info" | "create" | "edit", pokemon?: Pokemon) => {
    if (type === "info" && pokemon) {
      try {
        const response = await axios.get(`${API_BASE_URL}/pokemons/pokemon/${pokemon.id}`);
        const { pokemon: fetchedPokemon, typeEffectiveness: effectiveness } = response.data;

        setSelectedPokemon({
          ...fetchedPokemon,
          form: fetchedPokemon.form || "", // Ensure form is always a string
        });
        setTypeEffectiveness(effectiveness);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    } else if (pokemon) {
      setSelectedPokemon(pokemon);
    }
    setModalState({ ...modalState, [type]: true });
  };

  const closeModal = (type: "info" | "create" | "edit") => {
    setSelectedPokemon(null);
    setTypeEffectiveness({});
    setModalState({ ...modalState, [type]: false });
  };

  // Handle Pokémon Creation
  const handleCreatePokemon = (newPokemon: Pokemon) => {
    setPokemons((prev) => [...prev, newPokemon]);
    setFilteredPokemons((prev) => [...prev, newPokemon]);
    closeModal("create");
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
          onClick={() => openModal("create")}
        >
          <FaPlus className="inline-block mr-2" /> Create Pokémon
        </button>
      </div>

      {/* Pokémon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon) => (
          <PokedexCard
            key={pokemon.id}
            pokemon={pokemon}
            onInfoClick={() => openModal("info", pokemon)}
            onEditClick={() => openModal("edit", pokemon)}
          />
        ))}
      </div>

      {/* Information Pokémon Modal */}
      {modalState.info && selectedPokemon && (
        <InformationPokedexCard
          pokemon={selectedPokemon}
          typeEffectiveness={typeEffectiveness}
          onClose={() => closeModal("info")}
        />
      )}

      {/* Create Pokémon Modal */}
      {modalState.create && (
        <CreatePokemonForm
          onClose={() => closeModal("create")}
          onCreate={handleCreatePokemon}
        />
      )}

      {/* Edit Pokémon Modal */}
      {modalState.edit && selectedPokemon && (
        <EditPokedexCard
          pokemon={selectedPokemon}
          onClose={() => closeModal("edit")}
          onUpdate={(updatedPokemon: Pokemon) => {
            setPokemons((prev) =>
              prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p))
            );
            setFilteredPokemons((prev) =>
              prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p))
            );
            closeModal("edit");
          }}
        />
      )}
    </div>
  );
};

export default PokedexPage;

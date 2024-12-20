import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PokemonCard from '../components/PokemonCard'; // Adjust the import path
import API_BASE_URL from "../apiConfig";

// Define the structure of stats and types
interface TypeCounts {
  [key: string]: number;
}

interface PlayerStats {
  playerName: string;
  caught: number;
  runaway: number;
  defeated: number;
  shiny: number;
  typeCounts: TypeCounts;
}

interface Pokemon {
  id: number;
  name: string;
  form: string;
  image: string | null;
  shinyImage: string | null;
  timesCaptured: number;
  shinyCapture: string; // 'yes' or 'no'
  type1: string;
  type2: string;
}

const PlayerStatsPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>(); // Ensure gameId is extracted from the URL
  const { playerId } = useParams<{ playerId: string }>(); // Extract playerId from the URL
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch overall player stats
    axios
      .get(`${API_BASE_URL}/players/stats/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        // console.log(response.data)
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching player stats", error);
      });
      

    // Fetch Pokémon-specific stats
    axios
      .get(`${API_BASE_URL}/players/stats/pokemon/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setPokemons(response.data); // Set Pokémon data from the response
        // console.log(response.data)
        console.log(pokemons)
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data", error);
      });
  }, [playerId, token]);

  if (!stats || pokemons.length === 0) {
    return <div>Loading...</div>; // Wait until stats and pokemons are loaded
  }
  

  // Check if stats.pokemon is an array and typeCounts exists
  const typeCounts = stats.typeCounts || {}; // Default to empty object if undefined or null

  return (
    <div className="flex flex-col space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Players</h1>
        <div className="space-x-4">
          <Link to={`/games/${gameId}`} className="btn bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Home
          </Link>
          <Link to={`/games/${gameId}/players`} className="btn bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Players
          </Link>
          <Link to="/games" className="btn bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Games
          </Link>
          <Link to={`/games/${gameId}/pokedex`} className="btn bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Pokedex
          </Link>
        </div>
      </div>

      {/* Type Encounter Buttons Section */}
      <div className="flex flex-wrap gap-4 p-4">
        {Object.keys(typeCounts).length > 0 ? (
          Object.keys(typeCounts).map((type) => (
            <div
              key={type}
              className="flex items-center justify-center px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: getTypeColor(type) }}
            >
              <span className="mr-2">{type}</span><span>{typeCounts[type]}</span>
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-500">No encounter data available.</div>
        )}
      </div>

      {/* Stats Section */}
      <div className="p-4 bg-gray-800 text-white rounded-lg">
        <h2 className="text-xl font-semibold">STATS</h2>
        <div className="mt-4 space-y-2">
          {[{ label: '🛒 Caught', value: stats.caught },
            { label: '❌ Run Away', value: stats.runaway },
            { label: '💔 Defeated', value: stats.defeated },
            { label: '✨ Shiny', value: stats.shiny }
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center">
              <span className="mr-2">{stat.label}</span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pokémon Cards Section */}
      {pokemons.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
    {pokemons.map((pokemon) => (
      <PokemonCard
        key={`${pokemon.name}-${pokemon.shinyCapture}-${pokemon.image}-${pokemon.form}`} // Combine name, shinyCapture, and image to ensure a unique key
        id={pokemon.id}
        name={pokemon.name}
        form={pokemon.form}
        image={pokemon.image}
        shinyImage={pokemon.shinyImage}
        timesCaptured={pokemon.timesCaptured}
        shinyCapture={pokemon.shinyCapture}
        type1={pokemon.type1}
        type2={pokemon.type2}
      />
    ))}
  </div>
) : (
  <div>No Pokémon found.</div>
)}

      </div>

  );
};

// Helper function to get the background color for each Pokémon type
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

  return typeColors[type] || "#808080"; // Default to gray if no color found
};

export default PlayerStatsPage;

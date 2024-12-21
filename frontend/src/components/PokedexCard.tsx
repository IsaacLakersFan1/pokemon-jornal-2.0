import React from "react";
import { FaInfoCircle, FaEdit } from "react-icons/fa";
import { Pokemon } from "../types/types";

interface PokedexCardProps {
  pokemon: Pokemon;
  onInfoClick: (pokemon: Pokemon) => void;
  onEditClick: (pokemon: Pokemon) => void;
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
  return typeColors[type] || "#A8A8A8"; // Default to gray if type is not found
};

const PokedexCard: React.FC<PokedexCardProps> = ({
  pokemon,
  onInfoClick,
  onEditClick,
}) => {
  return (
    <div className="border rounded-lg shadow-lg p-4 text-center">
      <p className="font-bold">National Dex #{pokemon.nationalDex}</p>
      <h3 className="text-lg font-bold">{pokemon.name}</h3>
      <h3 className="text-md">{pokemon.form}</h3>
      <img
        src={`http://localhost:3000/public/PokemonImages/${pokemon.image}.png`}
        alt={pokemon.name}
        className="w-36 h-36 mx-auto mt-2"
      />
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
      <div className="mt-4 flex justify-center gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => onInfoClick(pokemon)}
        >
          <FaInfoCircle className="inline-block mr-2" /> Info
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          onClick={() => onEditClick(pokemon)}
        >
          <FaEdit className="inline-block mr-2" /> Edit
        </button>
      </div>
    </div>
  );
};

export default PokedexCard;

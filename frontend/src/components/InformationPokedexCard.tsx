import React from "react";
import { FaTimes } from "react-icons/fa";

interface Pokemon {
  name: string;
  image: string;
  type1: string;
  type2?: string | null;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  generation: number;
}

interface InformationPokedexCardProps {
  pokemon: Pokemon;
  onClose: () => void;
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

const InformationPokedexCard: React.FC<InformationPokedexCardProps> = ({ pokemon, onClose }) => {
  return (
    <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{pokemon.name}</h2>
          <button onClick={onClose} className="text-red-500 text-2xl">
            <FaTimes />
          </button>
        </div>
        <div className="mt-4 text-center">
          <img
            src={`/${pokemon.image}.png`}
            alt={pokemon.name}
            className="w-48 h-48 mx-auto mb-4"
          />
          <p>Type: {pokemon.type1}</p>
          {pokemon.type2 && <p>Secondary Type: {pokemon.type2}</p>}
          <p>HP: {pokemon.hp}</p>
          <p>Attack: {pokemon.attack}</p>
          <p>Defense: {pokemon.defense}</p>
          <p>Special Attack: {pokemon.specialAttack}</p>
          <p>Special Defense: {pokemon.specialDefense}</p>
          <p>Speed: {pokemon.speed}</p>
          <p>Generation: {pokemon.generation}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformationPokedexCard;

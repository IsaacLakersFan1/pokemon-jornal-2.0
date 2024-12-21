import React from "react";
import { FaTimes } from "react-icons/fa";

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

interface TypeEffectiveness {
  [key: string]: number;
}

interface InformationPokedexCardProps {
  pokemon: Pokemon;
  onClose: () => void;
  typeEffectiveness: TypeEffectiveness;
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

const getStatBarColor = (value: number): string => {
  if (value < 40) return "bg-red-600";
  if (value < 60) return "bg-orange-600";
  if (value < 90) return "bg-yellow-400";
  if (value < 120) return "bg-green-500";
  return "bg-green-600";
};

const renderStatBar = (label: string, value: number) => {
  const barWidth = Math.min(value, 100); // Ensure bar width does not exceed 100%

  return (
    <div className="flex items-center justify-center mt-4">
      <p className="w-1/2 text-md font-semibold">{label}:</p>
      <p className="w-1/6 text-lg text-right">{value}</p>
      <div className="w-full h-4 bg-gray-300 rounded-md overflow-hidden ml-2">
        <div
          className={`${getStatBarColor(value)} h-full`}
          style={{ width: `${barWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

const getEffectivenessColor = (effectiveness: number): string => {
  if (effectiveness === 0) return "bg-black text-white mb-4"; // Immune
  if (effectiveness === 0.25) return "bg-red-900 text-white mb-4"; // 1/4x
  if (effectiveness === 0.5) return "bg-red-600 text-white mb-4"; // 1/2x
  if (effectiveness === 1) return "bg-gray-300 text-black mb-4"; // Normal
  if (effectiveness === 2) return "bg-green-500 text-white mb-4"; // 2x
  if (effectiveness === 4) return "bg-green-300 text-black mb-4"; // 4x
  return "bg-gray-300 text-black mb-4"; // Default (shouldn't occur)
};

const renderTypeEffectiveness = (typeEffectiveness: TypeEffectiveness) => {
  const abbreviateType = (type: string): string => {
    return type.slice(0, 3).toUpperCase();
  };

  const effectivenessGroups = Object.entries(typeEffectiveness).reduce(
    (acc: [string, number][][], [type, effectiveness], index) => {
      if (index % 4 === 0) acc.push([]);
      acc[acc.length - 1].push([type, effectiveness]);
      return acc;
    },
    []
  );

  return (
    <div>
      <h3 className="text-lg font-bold mb-2 text-center">Type Defenses</h3>
      <div className="space-y-2">
        {effectivenessGroups.map((group, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2">
            {group.map(([type, effectiveness]) => (
              <div key={type} className="text-center">
                <div
                  className="px-2 py-1 rounded-md font-bold text-xs"
                  style={{
                    backgroundColor: getTypeColor(type),
                    color: "#fff",
                  }}
                >
                  {abbreviateType(type)}
                </div>
                <div
                  className={`px-2 py-1 mt-1 rounded-md text-sm ${getEffectivenessColor(
                    effectiveness
                  )}`}
                >
                  {effectiveness === 0.25 ? "1/4" : effectiveness === 0.5 ? "1/2" : effectiveness}x
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const InformationPokedexCard: React.FC<InformationPokedexCardProps> = ({
  pokemon,
  onClose,
  typeEffectiveness,
}) => {
  return (
    <div className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-3/4 flex">
        <div className="w-1/3 text-center">
          <h2 className="text-2xl font-bold mb-6">{pokemon.name}</h2>
          <img
            src={`http://localhost:3000/public/PokemonImages/${pokemon.image}.png`}
            alt={pokemon.name}
            className="w-80 h-80 mx-auto mb-4"
          />
          <div className="flex justify-center gap-2">
            <span
              className="text-white px-4 py-1 rounded-md text-2xl"
              style={{ backgroundColor: getTypeColor(pokemon.type1) }}
            >
              {pokemon.type1}
            </span>
            {pokemon.type2 && (
              <span
                className="text-white px-4 py-1 rounded-md text-2xl"
                style={{ backgroundColor: getTypeColor(pokemon.type2) }}
              >
                {pokemon.type2}
              </span>
            )}
          </div>
        </div>
        <div className="w-1/3 px-6 mr-12">
          <h3 className="text-2xl font-bold mb-12">Base Stats</h3>
          <div>
            {renderStatBar("HP", pokemon.hp)}
            {renderStatBar("Attack", pokemon.attack)}
            {renderStatBar("Defense", pokemon.defense)}
            {renderStatBar("Special Attack", pokemon.specialAttack)}
            {renderStatBar("Special Defense", pokemon.specialDefense)}
            {renderStatBar("Speed", pokemon.speed)}
            {renderStatBar("Total", pokemon.total)}
          </div>
        </div>
        <div className="w-1/3">
          {renderTypeEffectiveness(typeEffectiveness)}
        </div>
        <button
          onClick={onClose}
          className=" text-white bg-red-500 text-2xl rounded-md p-2 h-12 ml-4"
        >
          <FaTimes></FaTimes>
        </button>
      </div>
    </div>
  );
};

export default InformationPokedexCard;

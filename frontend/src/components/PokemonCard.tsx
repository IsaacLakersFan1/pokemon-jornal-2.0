import React from 'react';
import { FaQuestionCircle, FaStar } from 'react-icons/fa'; // Import icons from react-icons

interface PokemonCardProps {
  id: number;
  type1: string;
  type2: string;
  name: string;
  form: string;
  image: string | null;
  shinyImage: string | null;
  timesCaptured: number;
  shinyCapture: string; // 'yes' or 'no'
}

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

const PokemonCard: React.FC<PokemonCardProps> = ({
  id,
  type1,
  type2,
  name,
  form,
  image,
  shinyImage,
  timesCaptured,
  shinyCapture,
}) => {
  // Decide which image to display (regular or shiny)
  const pokemonImage = shinyCapture === 'yes' && shinyImage ? shinyImage : image;

  // Determine display name and form
  const displayName = timesCaptured === 0 ? '???' : name;
  const displayForm = timesCaptured === 0 ? 'Unknown Form' : form;

  return (
    <div className="pokemon-card p-4 bg-white shadow-lg rounded-lg">
      {/* Pokémon ID Section */}
      <div className="text-center text-sm font-bold text-gray-500 mb-2">National Dex #{id}</div>

      {/* Pokémon Image Section */}
      <div className="relative flex flex-col items-center">
        <h3 className="mt-2 text-xl font-semibold">{displayName}</h3>
        <h4 className="mt-1 text-sm text-gray-500">{displayForm}</h4>

        {timesCaptured === 0 ? (
          // Display "?" icon for uncaptured Pokémon
          <FaQuestionCircle className="w-64 h-64 m-4 text-gray-400" />
        ) : (
          // Display Pokémon image
          <img
            src={`http://localhost:3000/public/PokemonImages/${pokemonImage}.png`}
            alt={name}
            className="w-64 h-64"
          />
        )}

      </div>

      {/* Type Badges Section */}
      {timesCaptured > 0 && (
        <div className="flex justify-center gap-2 mt-3">
          <span
            className="px-2 py-1 text-lg font-bold text-white rounded"
            style={{ backgroundColor: getTypeColor(type1) }}
          >
            {type1}
          </span>
          {type2 && (
            <span
              className="px-2 py-1 text-lg font-bold text-white rounded"
              style={{ backgroundColor: getTypeColor(type2) }}
            >
              {type2}
            </span>
          )}
        </div>
      )}

        <div className='flex items-center justify-center'>
            {/* Capture Count Section */}
                <div className="flex items-center justify-center mt-6">
                    <img src={`http://localhost:3000/public/PokemonImages/pokeball.png`} alt="Pokéball" className="w-8 h-8 mr-2" />
                    <span className="text-lg font-bold">{timesCaptured}</span>
                </div>

            {/* Shiny Status Section */}
                <div className="flex justify-center mt-6 ml-12">
                    <FaStar
                    className={`w-6 h-6 ${
                        shinyCapture === 'yes' ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    />
                </div>
        </div>
    </div>
  );
};

export default PokemonCard;

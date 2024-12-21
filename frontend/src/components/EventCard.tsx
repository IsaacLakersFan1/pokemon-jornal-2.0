import React, { useState } from 'react';
import axios from 'axios';
import { FaCrown, FaStar, FaRunning, FaSkull, FaCheck, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../apiConfig';
import InformationPokedexCard from './InformationPokedexCard';

interface EventCardProps {
  eventId: number;
  pokemonId: number; // Use Pokémon ID for fetching correct details
  pokemonName: string;
  pokemonImage: string | null;
  pokemonForm?: string;
  type1: string;
  type2?: string | null;
  totalStats: number;
  nickname?: string;
  status: string;
  isShiny: number;
  isChamp: number;
  route: string;
  form: string;
  onDelete: () => void; // Delete callback
}

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

  return typeColors[type] || "#808080"; // Default to gray if no color found
};

const EventCard: React.FC<EventCardProps> = ({
  eventId,
  pokemonId, // Use this ID to fetch Pokémon details
  pokemonName,
  pokemonImage,
  type1,
  type2,
  nickname,
  status,
  isShiny,
  isChamp,
  route,
  form,
  onDelete,
}) => {
  const [currentStatus, setCurrentStatus] = useState<string>(status);
  const [shiny, setShiny] = useState<number>(isShiny);
  const [champ, setChamp] = useState<number>(isChamp);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [typeEffectiveness, setTypeEffectiveness] = useState<{ [key: string]: number }>({});
  const token = localStorage.getItem('authToken');

  const fetchPokemonInfo = async () => {
    if (!pokemonId) {
      console.error('Pokemon ID is missing!');
      toast.error('Pokemon ID is missing. Please try again.');
      return;
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/pokemons/pokemon/${pokemonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { pokemon, typeEffectiveness } = response.data;
      setSelectedPokemon(pokemon);
      setTypeEffectiveness(typeEffectiveness);
      setIsInfoModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch Pokémon info:', error);
      toast.error('Failed to fetch Pokémon info. Please try again.');
    }
  };
  

  const statusColors: Record<string, string> = {
    Catched: 'bg-green-100 border-green-400',
    'Run Away': 'bg-gray-100 border-gray-400',
    Defeated: 'bg-red-100 border-red-400',
  };

  const activeStatusColor = 'bg-blue-300 border-blue-500';

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/events/event/${eventId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentStatus(newStatus);
      toast.success(`Status updated to "${newStatus}" successfully.`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const toggleAttribute = async (attribute: 'isShiny' | 'isChamp', value: number) => {
    try {
      await axios.put(
        `${API_BASE_URL}/events/events/${eventId}/attributes`,
        {
          [attribute]: value,
          isShiny: attribute === 'isShiny' ? value : shiny,
          isChamp: attribute === 'isChamp' ? value : champ,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (attribute === 'isShiny') {
        setShiny(value);
        toast.success(value ? 'Marked as Shiny!' : 'Unmarked as Shiny.');
      } else {
        setChamp(value);
        toast.success(value ? 'Marked as Champion!' : 'Unmarked as Champion.');
      }
    } catch (error) {
      console.error(`Failed to update ${attribute}:`, error);
      toast.error(`Failed to update ${attribute}. Please try again.`);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Event deleted successfully.');
      setIsDeleteModalOpen(false);

      // Call the onDelete callback to trigger refetch
      onDelete();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event. Please try again.');
    }
  };

  return (
    <>
      <div
        className={`border rounded-md p-4 shadow-md flex w-full justify-between items-center ${
          statusColors[currentStatus] || 'bg-white'
        }`}
      >
        {/* First Block */}
        <div>
          <img
            src={`http://localhost:3000/public/PokemonImages/${pokemonImage}.png`}
            alt={pokemonName}
            className="w-20 h-20 mx-auto object-contain mb-2"
          />
          <div className="flex justify-center space-x-2 mt-2">
            <span
              className="px-2 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: getTypeColor(type1) }}
            >
              {type1}
            </span>
            {type2 && (
              <span
                className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                style={{ backgroundColor: getTypeColor(type2) }}
              >
                {type2}
              </span>
            )}
          </div>
        </div>

        {/* Second Block */}
        <div>
          {nickname && <p className="text-center text-sm font-bold italic">"{nickname}"</p>}
          <h3 className="text-md text-center">{pokemonName}</h3>
          {form && <p className="text-center text-xs text-gray-500">{form}</p>}
        </div>

        {/* Third Block */}
        <div>
          <h3 className="text-md font-bold text-center">{route}</h3>
        </div>

        {/* Fourth Block */}
        <div>
          <div className="flex flex-col justify-between">
            <button
              className={`px-8 py-2 mb-2 rounded-md ${
                currentStatus === 'Catched' ? activeStatusColor : 'bg-white'
              }`}
              onClick={() => handleStatusChange('Catched')}
            >
              <FaCheck className="text-green-600" />
            </button>
            <button
              className={`px-8 py-2 mb-2 rounded-md ${
                currentStatus === 'Run Away' ? activeStatusColor : 'bg-white'
              }`}
              onClick={() => handleStatusChange('Run Away')}
            >
              <FaRunning className="text-gray-600" />
            </button>
            <button
              className={`px-8 py-2 rounded-md ${
                currentStatus === 'Defeated' ? activeStatusColor : 'bg-white'
              }`}
              onClick={() => handleStatusChange('Defeated')}
            >
              <FaSkull className="text-red-600" />
            </button>
          </div>
        </div>

        {/* Fifth Block */}
        <div>
          <div className="flex flex-col h-28 justify-between items-center">
            <button
              className={`py-2 px-6 rounded-md ${shiny ? 'bg-yellow-300' : 'bg-gray-200'}`}
              onClick={() => toggleAttribute('isShiny', shiny ? 0 : 1)}
            >
              <FaStar className={shiny ? 'text-yellow-600' : 'text-gray-600'} />
            </button>
            <button
              className={`py-2 px-6 rounded-md ${champ ? 'bg-yellow-300' : 'bg-gray-200'}`}
              onClick={() => toggleAttribute('isChamp', champ ? 0 : 1)}
            >
              <FaCrown className={champ ? 'text-yellow-600' : 'text-gray-600'} />
            </button>
              <div>
              {/* Information Button */}
              <button
                className="py-2 px-4 mt-2 mr-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={fetchPokemonInfo}
              >
                <FaInfoCircle />
              </button>
              <button
                className="py-2 px-4 mt-2  bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <FaTrash />
              </button>
              </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this event?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Information Modal */}
      {isInfoModalOpen && selectedPokemon && (
        <InformationPokedexCard
          pokemon={selectedPokemon}
          typeEffectiveness={typeEffectiveness}
          onClose={() => setIsInfoModalOpen(false)}
        />
      )}
      
    </>
  );
};

export default EventCard;

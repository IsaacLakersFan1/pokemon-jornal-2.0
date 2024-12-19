import React, { useState } from 'react';
import axios from 'axios';
import { FaCrown, FaStar, FaRunning, FaSkull, FaCheck } from 'react-icons/fa';
import API_BASE_URL from '../apiConfig';

interface EventCardProps {
  eventId: number;
  pokemonName: string;
  pokemonImage: string | null;
  pokemonForm?: string; // Optional form
  type1: string;
  type2?: string | null;
  totalStats: number;
  nickname?: string;
  status: string;
  isShiny: number;
  isChamp: number;
  route: string;
  form: string;
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
}) => {
  const [currentStatus, setCurrentStatus] = useState<string>(status);
  const [shiny, setShiny] = useState<number>(isShiny);
  const [champ, setChamp] = useState<number>(isChamp);
  const token = localStorage.getItem('authToken');

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
    } catch (error) {
      console.error('Failed to update status:', error);
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
      attribute === 'isShiny' ? setShiny(value) : setChamp(value);
    } catch (error) {
      console.error(`Failed to update ${attribute}:`, error);
    }
  };

  return (
    <div
      className={`border rounded-md p-4 shadow-md flex w-full justify-between items-center ${
        statusColors[currentStatus] || 'bg-white'
      }`}
    >

      {/* First Block */}
      <div>
        {/* Pokémon Image */}
        <img
          src={`/${pokemonImage}.png` || '/pokeball.png'}
          alt={pokemonName}
          className="w-20 h-20 mx-auto object-contain mb-2"
        />
        {/* Type Badges */}
        <div className="flex justify-center space-x-2 mt-2 ">
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
      <div className=''>
        {/* Nickname */}
        {nickname && <p className="text-center text-sm font-bold italic">"{nickname}"</p>}

        {/* Pokémon Name */}
        <h3 className="text-md text-center">{pokemonName}</h3>

        {/* Pokémon Form (if exists) */}
        {form && (
        <p className="text-center text-xs text-gray-500">{form}</p>
        )}

      </div>

      {/* Third Block */}
      <div className=''>
        <h3 className="text-md font-bold text-center">{route}</h3>
      </div>
      
      {/* Forth Block */}
        <div className=''>
          {/* Status Buttons */}
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

      {/* Fifht Block */}
      <div>
        {/* Shiny and Champ Toggles */}
        <div className="flex flex-col justify-center items-center mt-4">
          <button
            className={`py-2 px-6 mb-2 rounded-md ${shiny ? 'bg-yellow-300' : 'bg-gray-200'}`}
            onClick={() => toggleAttribute('isShiny', shiny ? 0 : 1)}
          >
            <FaStar className={shiny ? 'text-yellow-600' : 'text-gray-600'} />
          </button>
          <button
            className={`py-2 px-6 mt-2 rounded-md ${champ ? 'bg-yellow-300' : 'bg-gray-200'}`}
            onClick={() => toggleAttribute('isChamp', champ ? 0 : 1)}
          >
            <FaCrown className={champ ? 'text-yellow-600' : 'text-gray-600'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

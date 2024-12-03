import React, { useState } from 'react';
import axios from 'axios';
import { FaCrown, FaStar, FaRunning, FaSkull, FaCheck } from 'react-icons/fa';

interface EventCardProps {
  eventId: number;
  pokemonName: string;
  pokemonImage: string | null;
  type1: string;
  type2?: string | null;
  totalStats: number;
  nickname?: string;
  status: string;
  isShiny: number;
  isChamp: number;
}

const EventCard: React.FC<EventCardProps> = ({
  eventId,
  pokemonName,
  pokemonImage,
  type1,
  type2,
  totalStats,
  nickname,
  status,
  isShiny,
  isChamp,
}) => {
  const [currentStatus, setCurrentStatus] = useState<string>(status);
  const [shiny, setShiny] = useState<number>(isShiny);
  const [champ, setChamp] = useState<number>(isChamp);
  const token = localStorage.getItem('authToken');

  const statusColors: Record<string, string> = {
    Catched: 'bg-green-100 border-green-400',
    'Run Away': 'bg-red-100 border-red-400',
    Defeated: 'bg-gray-100 border-gray-400',
  };

  const activeStatusColor = 'bg-blue-300 border-blue-500';

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.patch(`http://localhost:3000/events/event/${eventId}/status`, {
        status: newStatus,
      },
      {headers: { Authorization: `Bearer ${token}` },});
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const toggleAttribute = async (attribute: 'isShiny' | 'isChamp', value: number) => {
    try {
      await axios.put(`http://localhost:3000/events/events/${eventId}/attributes`, {
        [attribute]: value,
        isShiny: attribute === 'isShiny' ? value : shiny,
        isChamp: attribute === 'isChamp' ? value : champ,
      },
        {headers: { Authorization: `Bearer ${token}` },});
      attribute === 'isShiny' ? setShiny(value) : setChamp(value);
    } catch (error) {
      console.error(`Failed to update ${attribute}:`, error);
    }
  };
  console.log(pokemonImage)

  return (
    <div
      className={`border rounded-md p-4 shadow-md ${
        statusColors[currentStatus] || 'bg-white'
      }`}
    >
      <img
        src={`/${pokemonImage}.png` || '/pokeball.png'}
        alt={pokemonName}
        className="w-20 h-20 mx-auto object-contain mb-2"
      />
      <h3 className="text-lg font-bold text-center">{pokemonName}</h3>
      {nickname && <p className="text-center text-sm italic">"{nickname}"</p>}
      <div className="text-center text-sm mt-2">
        <span className="block">{type1}</span>
        {type2 && <span className="block">{type2}</span>}
      </div>
      <div className="text-center mt-2">
        <span className="font-semibold">Total Stats: </span>
        {totalStats}
      </div>
      <div className="text-center mt-4">
        <span className="font-semibold">Status: </span>
        {currentStatus}
      </div>
      <div className="flex justify-around mt-4">
        <button
          className={`p-2 rounded-md ${
            currentStatus === 'Catched' ? activeStatusColor : 'bg-white'
          }`}
          onClick={() => handleStatusChange('Catched')}
        >
          <FaCheck className="text-green-600" />
        </button>
        <button
          className={`p-2 rounded-md ${
            currentStatus === 'Run Away' ? activeStatusColor : 'bg-white'
          }`}
          onClick={() => handleStatusChange('Run Away')}
        >
          <FaRunning className="text-red-600" />
        </button>
        <button
          className={`p-2 rounded-md ${
            currentStatus === 'Defeated' ? activeStatusColor : 'bg-white'
          }`}
          onClick={() => handleStatusChange('Defeated')}
        >
          <FaSkull className="text-gray-600" />
        </button>
      </div>
      <div className="flex justify-around mt-4">
        <button
          className={`p-2 rounded-md ${
            shiny ? 'bg-yellow-300' : 'bg-gray-200'
          }`}
          onClick={() => toggleAttribute('isShiny', shiny ? 0 : 1)}
        >
          <FaStar className={shiny ? 'text-yellow-600' : 'text-gray-600'} />
        </button>
        <button
          className={`p-2 rounded-md ${
            champ ? 'bg-yellow-300' : 'bg-gray-200'
          }`}
          onClick={() => toggleAttribute('isChamp', champ ? 0 : 1)}
        >
          <FaCrown className={champ ? 'text-yellow-600' : 'text-gray-600'} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;

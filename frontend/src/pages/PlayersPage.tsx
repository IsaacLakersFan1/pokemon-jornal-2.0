import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

interface Player {
  id: number;
  name: string;
  pokemon: {
    name: string;
    image: string; // The image URL from the API
  } | null; // Pokémon may be null if not selected
}

const PlayersPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>(); // Get gameId from the URL
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  console.log(gameId)

  useEffect(() => {
    const fetchPlayers = async () => {
        try {
          const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
          console.log(token)
          if (!token) {
            throw new Error('Unauthorized: Token not found');
          }
      
          const response = await axios.get(`${API_BASE_URL}/api/player-games/${gameId}`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Add token to headers
            },
          });
      
          const playersData = response.data.players;
          setPlayers(
            playersData.map((p: any) => ({
              id: p.player.id,
              name: p.player.name,
              pokemon: p.player.pokemon
                ? {
                    name: p.player.pokemon.name,
                    image: `http://localhost:3000/public/PokemonImages/${p.player.pokemon.name.toLowerCase()}.png`
                  }
                : null,
            }))
          );
          setLoading(false);
        } catch (err: any) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError('Unauthorized: Please log in again.');
          } else {
            setError(err.message);
          }
          setLoading(false);
        }
      };
      
    fetchPlayers();
  }, [gameId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
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
      {/* Players List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="p-6 border rounded-xl shadow-lg bg-white hover:shadow-xl transition-all"
          >
            <div className="flex flex-col items-center">
              {/* Player Image */}
              <img
                src={`http://localhost:3000/public/PokemonImages/player.png`}
                alt={`${player.name} avatar`}
                className="w-16 h-32  mb-4 "
              />
              {/* Player Name */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{player.name}</h3>

              {/* Pokémon Info */}
              {player.pokemon ? (
                <div className="flex items-center gap-3 text-gray-600 mb-4">
                  <img
                    src={player.pokemon.image}
                    alt={player.pokemon.name}
                    className="w-24 h-24 rounded-full"
                  />
                  <span className="text-sm">{player.pokemon.name}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No Pokémon selected</p>
              )}

              {/* Select Player Button */}
              <button
                onClick={() => navigate(`/games/${gameId}/players/${player.id}`)}
                className="mt-4 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Select Player
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersPage;

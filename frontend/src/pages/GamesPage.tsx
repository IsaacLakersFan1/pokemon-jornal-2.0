import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../apiConfig';

const GamesPage = () => {
  const [games, setGames] = useState<any[]>([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE_URL}/games/games`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setGames(response.data.games))
        .catch(() => toast.error('Error fetching games.'));
    } else {
      toast.error('No authentication token found.');
    }
  }, [token]);

  const handleDelete = (gameId: number) => {
    if (token) {
      axios
        .delete(`${API_BASE_URL}/games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
          toast.success('Game deleted successfully.');
        })
        .catch(() => toast.error('Error deleting game.'));
    } else {
      toast.error('No authentication token found.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Games</h1>
        <Link to="/games/new">
          <button className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Create New Game
          </button>
        </Link>
      </div>

      {games.length > 0 ? (
        <ul className="space-y-4">
          {games.map((game) => (
            <li
              key={game.id}
              className="flex justify-between items-center bg-white border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md"
            >
              <span className="text-lg font-semibold text-gray-700">{game.name}</span>
              <div className="flex space-x-4">
                <Link to={`/games/${game.id}`}>
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Continue
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md text-center">
          <p className="text-lg font-semibold">No games available.</p>
        </div>
      )}
    </div>
  );
};

export default GamesPage;

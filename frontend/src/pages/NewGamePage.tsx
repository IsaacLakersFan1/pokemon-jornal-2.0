import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../apiConfig';

const NewGamePage = () => {
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonSearch, setPokemonSearch] = useState('');
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Fetch all players on component load
  useEffect(() => {
    if (token) {
      fetchPlayers();
    }
  }, [token]);

  const fetchPlayers = () => {
    axios
      .get(`${API_BASE_URL}/players`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPlayers(response.data))
      .catch(() => toast.error('Error fetching players.'));
  };

  const fetchPokemons = (search: string) => {
    if (search.length < 3) {
      setPokemons([]); // Clear results if less than 3 characters
      return;
    }
    axios
      .get(`${API_BASE_URL}/events/pokemon/search?searchTerm=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPokemons(response.data))
      .catch(() => toast.error('Error fetching Pokémon.'));
  };

  const handlePokemonSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setPokemonSearch(searchTerm);
    fetchPokemons(searchTerm); // Trigger search with updated term
  };

  const selectPokemon = (id: number, name: string) => {
    setPokemonId(id);
    setSelectedPokemonName(name); // Save Pokémon name
    setPokemonSearch('');
    setPokemons([]); // Clear search results after selection
  };

  const handleAddPlayer = async () => {
    if (newPlayerName.trim() && pokemonId && token) {
      try {
        await axios.post(
          `${API_BASE_URL}/players`,
          { name: newPlayerName, pokemonId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setNewPlayerName('');
        setPokemonId(null);
        setSelectedPokemonName(null); // Reset selected Pokémon name
        toast.success('Player added successfully!');

        // Refresh the player list
        fetchPlayers();
      } catch {
        toast.error('Failed to add player.');
      }
    } else {
      toast.warn('Please provide all required player details.');
    }
  };

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      toast.warn('Game name cannot be empty.');
      return;
    }

    if (selectedPlayers.length === 0) {
      toast.warn('Please select at least one player.');
      return;
    }

    setIsLoading(true);

    try {
      const gameResponse = await axios.post(
        `${API_BASE_URL}/games`,
        {
          name: gameName,
          playerCount: selectedPlayers.length,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const gameId = gameResponse.data.game.id;

      const playerGamePromises = selectedPlayers.map((playerId) =>
        axios.post(
          `${API_BASE_URL}/api/player-games`,
          { playerId, gameId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      await Promise.all(playerGamePromises);

      toast.success('Game created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create game.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">Create New Game</h1>

      <div className="mb-4">
        <label htmlFor="gameName" className="block text-lg font-semibold text-gray-700 mb-2">
          Game Name
        </label>
        <input
          id="gameName"
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter game name"
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Players</h2>
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className={`p-3 border rounded-md flex justify-between items-center ${
                selectedPlayers.includes(player.id) ? 'bg-indigo-100' : ''
              }`}
            >
              <span>{player.name}</span>
              <button
                className={`btn ${
                  selectedPlayers.includes(player.id) ? 'bg-red-500' : 'bg-green-500'
                } text-white py-1 px-3 rounded-md`}
                onClick={() => togglePlayerSelection(player.id)}
              >
                {selectedPlayers.includes(player.id) ? 'Remove' : 'Add'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Create New Player</h2>
        <div className="flex items-center space-x-3 mb-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player Name"
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={pokemonSearch}
            onChange={handlePokemonSearch}
            placeholder="Search Pokémon"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {pokemons.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto w-full z-10">
              {pokemons.map((pokemon) => (
                <li
                  key={pokemon.id}
                  className="p-2 hover:bg-indigo-100 cursor-pointer"
                  onClick={() => selectPokemon(pokemon.id, pokemon.name)}
                >
                  {pokemon.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-2">
          {selectedPokemonName && (
            <p className="text-sm text-gray-600">
              Selected Pokémon: <span className="font-semibold">{selectedPokemonName}</span>
            </p>
          )}
        </div>

        <button
          className="btn bg-indigo-600 text-white py-2 px-4 mt-3 rounded-md"
          onClick={handleAddPlayer}
        >
          Add Player
        </button>
      </div>

      <div className="text-center">
        <button
          className="btn bg-indigo-600 text-white py-2 px-4 rounded-md"
          onClick={handleCreateGame}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Game...' : 'Create Game'}
        </button>
      </div>
    </div>
  );
};

export default NewGamePage;

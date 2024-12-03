import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import EventCard from '../components/EventCard';

// Define the type for the player-game response
interface PlayerGameResponse {
  id: number;
  playerId: number;
  gameId: number;
  player: {
    id: number;
    name: string;
    pokemonId?: number; // Optional favorite Pokémon
    userId: number;
  };
}

const DashboardPage = () => {
  const [pokemonQuery, setPokemonQuery] = useState('');
  const [pokemonResults, setPokemonResults] = useState<any[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null);
  const [route, setRoute] = useState('');
  const [nickname, setNickname] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [status, setStatus] = useState('Catched');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const gameId = Number(useParams().id); // Extract gameId from URL params
  const token = localStorage.getItem('authToken');


  // Fetch players on component mount
  useEffect(() => {
    if (token && gameId) {
      axios
        .get<{ players: PlayerGameResponse[] }>(`http://localhost:3000/api/player-games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Map to extract player details
          const playerDetails = response.data.players.map((playerGame) => playerGame.player);
          setPlayers(playerDetails);
        })
        .catch((error) => console.error('Error fetching players:', error));
    }
  }, [token, gameId]);
    

  // Search for Pokémon when the query is 3+ letters
  useEffect(() => {
    if (pokemonQuery.length >= 3 && token) {
      axios
        .get(`http://localhost:3000/events/pokemon/search?searchTerm=${pokemonQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setPokemonResults(response.data))
        .catch((error) => console.error('Error fetching Pokémon:', error));
    } else {
      setPokemonResults([]);
    }
  }, [pokemonQuery, token]);
  

  // Submit the event
  const handleCreateEvent = async () => {
    if (!selectedPokemon || !route || !nickname || !selectedPlayerId) {
      alert('Please fill in all fields!');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        'http://localhost:3000/events/event',
        {
          pokemonId: selectedPokemon.id,
          route,
          nickname,
          playerId: selectedPlayerId, // Include the playerId in the event data
          status,
          gameId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Event created successfully!');
      // Reset fields after submission
      setSelectedPokemon(null);
      setPokemonQuery('');
      setRoute('');
      setNickname('');
      setSelectedPlayerId(null);
      setStatus('Catched');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create the event!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch events for the current game
  useEffect(() => {
    if (token && gameId) {
      axios
        .get(`http://localhost:3000/events/events?gameId=${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setEvents(response.data.events))
        .catch((error) => console.error('Error fetching events:', error));
    }
  }, [token, gameId,isSubmitting]);

    // Group events by player
    const eventsByPlayer = events.reduce((acc: any, event) => {
      const playerId = event.player.id;
      if (!acc[playerId]) acc[playerId] = [];
      acc[playerId].push(event);
      return acc;
    }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link to="/dashboard" className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Home
          </Link>
          <Link to="/players" className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Players
          </Link>
          <Link to="/games" className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Games
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Create Pokémon Event</h2>

        {/* Pokémon Search */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">Search Pokémon</label>
          <input
            type="text"
            value={pokemonQuery}
            onChange={(e) => setPokemonQuery(e.target.value)}
            placeholder="Type 3+ letters to search..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {pokemonResults.length > 0 && (
            <ul className="border mt-2 rounded-md shadow-md max-h-40 overflow-y-auto">
              {pokemonResults.map((pokemon) => (
                <li
                  key={pokemon.id}
                  className="p-3 cursor-pointer hover:bg-indigo-100"
                  onClick={() => {
                    setSelectedPokemon(pokemon);
                    setPokemonQuery('');
                  }}
                >
                  {pokemon.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedPokemon && (
          <div className="mb-4">
            <span className="font-semibold text-indigo-700">Selected Pokémon:</span> {selectedPokemon.name}
          </div>
        )}

        {/* Zone Input */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">Zone/Route</label>
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="Enter the zone or route"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Nickname Input */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter the nickname"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Player Selection */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">Player Who Caught Pokémon</label>
          <select
            value={selectedPlayerId ?? ''}
            onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select a Player</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>


        {/* Status Selection */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Catched">Catched</option>
            <option value="Run Away">Run Away</option>
            <option value="Defeated">Defeated</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            className={`btn ${
              isSubmitting ? 'bg-gray-400' : 'bg-indigo-600'
            } text-white py-2 px-4 rounded-md`}
            onClick={handleCreateEvent}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </div>

      {/* Display Events */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Game Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(eventsByPlayer).map((playerId) => (
                <div key={playerId}>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                    {eventsByPlayer[playerId][0]?.player.name}
                  </h3>
                  <div className="space-y-4">
                    {eventsByPlayer[playerId].map((event: any) => (
                      <EventCard
                        key={event.id}
                        eventId={event.id}
                        pokemonName={event.pokemon.name}
                        pokemonImage={event.pokemon.image}
                        type1={event.pokemon.type1}
                        type2={event.pokemon.type2}
                        totalStats={event.pokemon.total}
                        nickname={event.nickname}
                        status={event.status}
                        isShiny={event.isShiny}
                        isChamp={event.isChamp}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  );
};

export default DashboardPage;
import { useParams } from 'react-router-dom';

const PokedexPage = () => {
  const { id } = useParams<{ id: string }>(); // Extract game ID
  return (
    <div>
      <h1>Pokedex for Game {id}</h1>
      {/* Add your Pokedex page content here */}
    </div>
  );
};

export default PokedexPage;

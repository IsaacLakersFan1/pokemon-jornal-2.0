import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import playerRoutes from './routes/playerRoutes';
import playerGameRoutes from './routes/playerGameRoutes';
import pokemonRoutes from './routes/pokemonRoutes';
import eventRoutes from './routes/eventRoutes';
import utilsRoutes from './routes/utilsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors(
//   {
//   origin: 'http://localhost:3000',  // Frontend's IP or domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify methods if needed
//   allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
// }
));

app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use('/players', playerRoutes);
app.use('/api', playerGameRoutes);
app.use('/pokemons', pokemonRoutes);
app.use('/events', eventRoutes);
app.use('/utils', utilsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

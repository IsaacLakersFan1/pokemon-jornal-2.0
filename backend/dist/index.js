"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
// import playerRoutes from './routes/playerRoutes';
// import pokemonRoutes from './routes/pokemonRoutes';
// import eventRoutes from './routes/eventRoutes';
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/games', gameRoutes_1.default);
// app.use('/players', playerRoutes);
// app.use('/pokemons', pokemonRoutes);
// app.use('/events', eventRoutes);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import Signup from './pages/Signup';
import GamesPage from './pages/GamesPage';
import NewGamePage from './pages/NewGamePage';
import DashboardPage from './pages/DashboardPage';
import PlayersPage from './pages/PlayersPage';
import PokedexPage from './pages/PokedexPage';
import PlayerStatsPage from './pages/PlayerStatsPage';
import PrivateRoute from './utils/PrivateRoute';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />


        {/* Protected Routes */}
        <Route
          path="/games"
          element={
            <PrivateRoute>
              <GamesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/games/new"
          element={
            <PrivateRoute>
              <NewGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/games/:id"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/games/:gameId/players"
          element={
            <PrivateRoute>
              <PlayersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/games/:id/pokedex"
          element={
            <PrivateRoute>
              <PokedexPage />
            </PrivateRoute>
          }
        />
        <Route
          path="games/:gameId/players/:playerId"
          element={
            <PrivateRoute>
              <PlayerStatsPage />
            </PrivateRoute>
          }
        />

        {/* Default Route to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

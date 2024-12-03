import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import GamesPage from './pages/GamesPage';
import NewGamePage from './pages/NewGamePage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './utils/PrivateRoute';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />
        
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
        
        {/* Default Route to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

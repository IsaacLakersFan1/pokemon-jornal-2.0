import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Use the new endpoint for login
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

      if (response.data.token) {
        // Assuming the backend returns a token for authentication
        localStorage.setItem('authToken', response.data.token);
        navigate('/games'); // Redirect to Games page
      }
    } catch (err) {
      // Handle errors from the login attempt
      setError('Invalid credentials, please try again');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-center text-white mb-6">Login</h1>
        <div className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        {/* Add a link to the signup page */}
        <div className="mt-6 text-center">
          <p className="text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

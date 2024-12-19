import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email,
        password,
      });
      // Assuming the response contains a token, store it in localStorage
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Redirect to the dashboard after successful signup
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import { Navigate } from 'react-router-dom';

// PrivateRoute component
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

  // If there is no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children; // Render the children (protected pages)
};

export default PrivateRoute;

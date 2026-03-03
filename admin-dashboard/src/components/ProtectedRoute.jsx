import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// Protected Route component to guard authenticated routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
   
    return <Navigate to="/" replace />;
  }

  
  return children;
};

export default ProtectedRoute;

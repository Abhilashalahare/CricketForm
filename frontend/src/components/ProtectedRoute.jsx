import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    toast.warn("Please log in to access the Admin Panel.");
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
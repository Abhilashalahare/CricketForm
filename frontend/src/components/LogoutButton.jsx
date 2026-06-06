import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove the token from local storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userInfo');
    
    // 2. Notify the user
    toast.info("Logged out successfully.");
    
    // 3. Redirect to login
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-900 transition"
    >
      LOGOUT
    </button>
  );
};

export default LogoutButton;
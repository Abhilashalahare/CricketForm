import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // New state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await axios.post(`${baseUrl}/api/login`, creds);
      
      localStorage.setItem('adminToken', res.data.token);
      
      toast.success("Login Successful!");
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed.");
    }
  };

 return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-xl rounded-lg w-full max-w-sm border-t-4 border-red-900">
        <h2 className="text-2xl font-black mb-6 text-red-900 text-center">ADMIN ACCESS</h2>
        
        <div className="space-y-4">
          <input 
            className="w-full border-b border-gray-300 p-2 focus:border-red-900 outline-none" 
            placeholder="Username" 
            onChange={e => setCreds({...creds, username: e.target.value})} 
            required
          />
          
          <div className="relative">
            <input 
              className="w-full border-b border-gray-300 p-2 focus:border-red-900 outline-none pr-10" 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              onChange={e => setCreds({...creds, password: e.target.value})} 
              required
            />
            {/* Icon Toggle */}
            <button 
              type="button"
              className="absolute right-2 top-2.5 text-gray-500 hover:text-red-900"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>
        
        <button className="w-full bg-red-900 text-white py-3 mt-8 font-bold cursor-pointer hover:bg-black transition-all">
          SIGN IN
        </button>
      </form>
    </div>
  );
};

export default Login;
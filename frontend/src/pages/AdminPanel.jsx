import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LogoutButton from '../components/LogoutButton';
import FullScreenLoader from '../components/FullScreenLoader';
import { FaEye, FaTrash } from 'react-icons/fa';

const AdminPanel = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseUrl}/api/admin/players`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlayers(response.data);
    } catch (err) {
      toast.error("Session expired or unauthorized.");
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/players/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlayers(players.filter(p => p._id !== id));
      toast.success("Player deleted.");
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  if (loading) return <FullScreenLoader/>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PLAYER REGISTRATIONS</h1>
        <LogoutButton />
      </div>
    
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4">S.No</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">CricHeroes ID</th>
              <th className="px-6 py-4">Skills</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {players.map((p, index) => (
              <tr key={p._id}>
                <td className="px-6 py-4">{index + 1}.</td>
                <td className="px-6 py-4">{p.fullName}</td>
                <td className="px-6 py-4">{p.mobileNumber}</td>
                <td className="px-6 py-4">{p.cricheroesId || 'N/A'}</td>
                <td className="px-6 py-4">{p.skills?.batting} / {p.skills?.bowling}</td>
             <td className="px-6 py-4 flex items-center space-x-2">
  {/* View Button */}
  <button 
    onClick={() => navigate(`/admin/view/${p._id}`)} 
    className="p-2 rounded-md transition-all duration-200 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-600"
    title="View Details"
  >
    <FaEye size={18} />
  </button>

  {/* Delete Button */}
  <button 
    onClick={() => deletePlayer(p._id)} 
    className="p-2 rounded-md transition-all duration-200 text-red-600 hover:bg-red-600 hover:text-white border border-red-600"
    title="Delete Player"
  >
    <FaTrash size={18} />
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
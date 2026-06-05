import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import FullScreenLoader from './FullScreenLoader';
import { FaHome } from 'react-icons/fa';

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await axios.get(`${baseUrl}/api/admin/players/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlayer(res.data);
      } catch (err) {
        toast.error("Failed to fetch player details.");
        navigate('/admin');
      }
    };
    fetchPlayer();
  }, [id, navigate]);
   
if (!player) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      
      {/* 2. Fixed Home Icon at the top left of the screen */}
      <button 
        onClick={() => navigate('/admin')}
        className="fixed top-6 left-6 text-gray-400 hover:text-red-900 transition z-50"
        title="Go to Admin Panel"
      >
        <FaHome size={32} />
      </button>
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg mt-10 rounded-xl">
      <h1 className="text-2xl font-black mb-6 text-red-900 border-b pb-2">PLAYER PROFILE</h1>
      
      {/* Display the Base64 photo if it exists */}
      {player.photo && (
        <img src={player.photo} alt="Player" className="w-40 h-40 object-cover mb-6 border-2 border-red-900" />
      )}

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div><p className="font-bold text-gray-500">FULL NAME</p><p>{player.fullName}</p></div>
        <div><p className="font-bold text-gray-500">PROFESSION</p><p>{player.profession}</p></div>
        <div><p className="font-bold text-gray-500">MOBILE</p><p>{player.mobileNumber}</p></div>
        <div><p className="font-bold text-gray-500">WHATSAPP</p><p>{player.whatsappNumber}</p></div>
        <div><p className="font-bold text-gray-500">EMAIL</p><p>{player.emailId}</p></div>
        <div><p className="font-bold text-gray-500">BATTING</p><p>{player.skills?.batting}</p></div>
        <div><p className="font-bold text-gray-500">BOWLING</p><p>{player.skills?.bowling}</p></div>
        <div className="col-span-2"><p className="font-bold text-gray-500">ADDRESS</p><p>{player.residentialAddress}</p></div>
        <div><p className="font-bold text-gray-500">CRIC HEROES ID</p><p>{player.cricheroesId || 'N/A'}</p></div>
        <div><p className="font-bold text-gray-500">INSTAGRAM ID</p><p>{player.instagramId || 'N/A'}</p></div>
        <div><p className="font-bold text-gray-500">SUBMISSION DATE</p><p>{new Date(player.submissionDate).toLocaleDateString()}</p></div>
      </div>

      <button 
        onClick={() => navigate('/admin')} 
        className="mt-8 bg-black text-white px-6 py-2 rounded hover:bg-red-900"
      >
        BACK TO LIST
      </button>
    </div>
    </div>
  );
};

export default PlayerDetails;
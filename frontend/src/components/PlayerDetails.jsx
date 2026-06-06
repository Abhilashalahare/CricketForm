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

  const handleViewReceipt = (base64Data) => {
  if (!base64Data) return;
  
  // Create a new window
  const win = window.open();
  win.document.write(`<iframe src="${base64Data}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
};

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
   <div className="flex flex-col md:flex-row gap-8">
  {/* Left Side: Information Grid */}
  <div className="flex-1 grid grid-cols-2 gap-6 text-sm">
    {/* Personal Details */}
    <div><p className="font-bold text-gray-500">FULL NAME</p><p>{player.fullName}</p></div>
    <div><p className="font-bold text-gray-500">PROFESSION</p><p>{player.profession}</p></div>
    <div><p className="font-bold text-gray-500">MOBILE</p><p>{player.mobileNumber}</p></div>
    <div><p className="font-bold text-gray-500">WHATSAPP</p><p>{player.whatsappNumber}</p></div>
    <div><p className="font-bold text-gray-500">EMAIL</p><p>{player.emailId}</p></div>
    <div><p className="font-bold text-gray-500">AADHAR NUMBER</p><p className="font-mono">{player.aadharNumber}</p></div>
    <div className="col-span-2"><p className="font-bold text-gray-500">ADDRESS</p><p>{player.residentialAddress}</p></div>

    {/* Kit & Payment */}
    <div className="col-span-2 border-t pt-4 font-bold text-gray-800">KIT & PAYMENT DETAILS</div>
    <div><p className="font-bold text-gray-500">UTR NUMBER</p><p>{player.utrNumber || 'N/A'}</p></div>
   <div>
  <p className="font-bold text-gray-500">PAYMENT RECEIPT</p>
  {player.utrReceipt ? (
    <button 
      onClick={() => handleViewReceipt(player.utrReceipt)}
      className="text-blue-600 underline cursor-pointer hover:text-blue-800"
    >
      View Receipt
    </button>
  ) : 'N/A'}
</div>
    <div><p className="font-bold text-gray-500">JERSEY NAME</p><p>{player.jerseyName || 'N/A'}</p></div>
    <div><p className="font-bold text-gray-500">JERSEY NUMBER</p><p>{player.jerseyNumber || 'N/A'}</p></div>
    <div><p className="font-bold text-gray-500">JERSEY SIZE</p><p>{player.jerseySize || 'N/A'}</p></div>
    <div><p className="font-bold text-gray-500">LOWER SIZE</p><p>{player.lowerSize || 'N/A'}</p></div>
    <div><p className="font-bold text-gray-500">WICKET KEEPING</p><p>{player.wicketKeeping}</p></div>

    {/* Skills & Social */}
    <div className="col-span-2 border-t pt-4 font-bold text-gray-800">SKILLS & SOCIAL</div>
    <div><p className="font-bold text-gray-500">BATTING</p><p>{player.skills?.batting}</p></div>
    <div><p className="font-bold text-gray-500">BOWLING</p><p>{player.skills?.bowling}</p></div>
    <div className="col-span-2"><p className="font-bold text-gray-500">FIELDING PREFERENCE</p><p>{player.skills?.fieldingPreference || 'N/A'}</p></div>
    <div><p className="font-bold text-gray-500">CRIC HEROES ID</p><p>{player.cricheroesId || 'N/A'}</p></div>
    <div><p className="font-bold text-gray-500">INSTAGRAM ID</p><p>{player.instagramId || 'N/A'}</p></div>
    
    {/* Submission Info */}
    <div className="col-span-2 border-t pt-4"></div>
    <div><p className="font-bold text-gray-500">SUBMISSION DATE</p><p>{new Date(player.submissionDate).toLocaleDateString()}</p></div>
    <div><p className="font-bold text-gray-500">PLACE</p><p>{player.submissionPlace || 'N/A'}</p></div>
    <div className="col-span-2 p-4 bg-gray-50 border-l-4 border-red-900">
      <p className="font-bold text-gray-500">SIGNATURE NAME</p>
      <p className="italic text-lg">{player.signatureName}</p>
    </div>
  </div>

  {/* Right Side: Photo */}
  <div className="flex-shrink-0">
    {player.photo && (
      <img src={player.photo} alt="Player" className="w-35 h-40 object-cover border-2 border-red-900 shadow-md" />
    )}
  </div>
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
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import FullScreenLoader from './FullScreenLoader';
import { FaHome, FaArrowLeft, FaArrowRight, FaFilePdf, FaPrint } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';



const PlayerDetails = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/players`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const playerList = res.data;
        setPlayers(playerList);
        const index = playerList.findIndex(p => p._id === id);
        setCurrentIndex(index !== -1 ? index : 0);
      } catch (err) {
        toast.error("Failed to load players.");
        navigate('/admin');
      }
    };
    fetchAllPlayers();
  }, [id, navigate]);

  const player = players[currentIndex];

 const handleDownloadPDF = async () => {
  const element = document.getElementById('player-profile');

  if (!element) {
    toast.error("Profile element not found!");
    return;
  }

  // Replace all oklch colors temporarily
  const nodes = element.querySelectorAll('*');

  nodes.forEach(node => {
    const style = window.getComputedStyle(node);

    if (style.color.includes('oklch')) {
      node.dataset.originalColor = node.style.color;
      node.style.color = '#000000';
    }

    if (style.backgroundColor.includes('oklch')) {
      node.dataset.originalBg = node.style.backgroundColor;
      node.style.backgroundColor = '#ffffff';
    }

    if (style.borderColor.includes('oklch')) {
      node.dataset.originalBorder = node.style.borderColor;
      node.style.borderColor = '#cccccc';
    }
  });

  try {
    await html2pdf()
      .set({
        margin: 0.3,
        filename: `${player.fullName}_Profile.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 1.5,
          useCORS: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      })
      .from(element)
      .save();
  } finally {
    nodes.forEach(node => {
      if (node.dataset.originalColor)
        node.style.color = node.dataset.originalColor;

      if (node.dataset.originalBg)
        node.style.backgroundColor = node.dataset.originalBg;

      if (node.dataset.originalBorder)
        node.style.borderColor = node.dataset.originalBorder;
    });
  }
};

  const navigatePlayer = (direction) => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < players.length) {
      navigate(`/admin/view/${players[newIndex]._id}`);
      setCurrentIndex(newIndex);
    }
  };

  const handleViewReceipt = (base64Data) => {
    if (!base64Data) return;
    const win = window.open();
    win.document.write(`<iframe src="${base64Data}" style="width:100%; height:100%; border:0;"></iframe>`);
  };

  if (players.length === 0) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <style>{`
       @media print {
  /* Hide navigation, buttons, and the surrounding layout containers */
  nav, button, .shadow, .bg-white.shadow-lg { 
    display: none !important; 
  }
  
  /* Reset the profile container so it prints on a clean white page */
  #player-profile {
    display: block !important;
    box-shadow: none !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
  }
}
      `}</style>
      {/* 1. TOP NAVBAR */}
     <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
  <button onClick={() => navigate('/admin')} className="text-red-900"><FaHome size={24} /></button>
  
  <div className="flex gap-4">
    {/* PRINT BUTTON */}
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition"
    >
      <FaPrint /> PRINT
    </button>
    
    {/* PDF BUTTON */}
    <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded hover:bg-black transition">
      <FaFilePdf /> DOWNLOAD PDF
    </button>
  </div>
</nav>

      {/* 2. NAVIGATION ARROWS */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mt-8 px-4">
        <button onClick={() => navigatePlayer('prev')} disabled={currentIndex === 0} className="p-4 bg-white shadow rounded-full hover:bg-gray-200 disabled:opacity-30"><FaArrowLeft /></button>
        
        {/* 3. PROFILE CONTENT CONTAINER */}
        <div id="player-profile" className="bg-white p-10 shadow-lg rounded-xl "  style={{
    width: "800px",
    minHeight: "auto",
  }}>
          <h1 className="text-2xl font-black mb-2 text-red-900 border-b pb-4">PLAYER PROFILE</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
              <div><p className="font-bold text-gray-500">FULL NAME</p><p>{player.fullName}</p></div>
              <div><p className="font-bold text-gray-500">PROFESSION</p><p>{player.profession}</p></div>
              <div><p className="font-bold text-gray-500">MOBILE</p><p>{player.mobileNumber}</p></div>
              <div><p className="font-bold text-gray-500">WHATSAPP</p><p>{player.whatsappNumber}</p></div>
              <div><p className="font-bold text-gray-500">EMAIL</p><p>{player.emailId}</p></div>
              <div><p className="font-bold text-gray-500">AADHAR NUMBER</p><p className="font-mono">{player.aadharNumber}</p></div>
              <div className="col-span-2"><p className="font-bold text-gray-500">ADDRESS</p><p>{player.residentialAddress}</p></div>

              <div className="col-span-2 border-t pt-2 font-bold text-gray-800">KIT & PAYMENT DETAILS</div>
              <div><p className="font-bold text-gray-500">UTR NUMBER</p><p>{player.utrNumber || 'N/A'}</p></div>
              <div>
                <p className="font-bold text-gray-500">PAYMENT RECEIPT</p>
                {player.utrReceipt ? <button onClick={() => handleViewReceipt(player.utrReceipt)} className="text-blue-600 underline">View Receipt</button> : 'N/A'}
              </div>
              <div><p className="font-bold text-gray-500">JERSEY NAME</p><p>{player.jerseyName || 'N/A'}</p></div>
              <div><p className="font-bold text-gray-500">JERSEY NUMBER</p><p>{player.jerseyNumber || 'N/A'}</p></div>
              <div><p className="font-bold text-gray-500">JERSEY SIZE</p><p>{player.jerseySize || 'N/A'}</p></div>
              <div><p className="font-bold text-gray-500">LOWER SIZE</p><p>{player.lowerSize || 'N/A'}</p></div>
              <div><p className="font-bold text-gray-500">WICKET KEEPING</p><p>{player.wicketKeeping}</p></div>

              <div className="col-span-2 border-t pt-2 font-bold text-gray-800">SKILLS & SOCIAL</div>
              <div><p className="font-bold text-gray-500">BATTING</p><p>{player.skills?.batting}</p></div>
              <div><p className="font-bold text-gray-500">BOWLING</p><p>{player.skills?.bowling}</p></div>
              <div className="col-span-2"><p className="font-bold text-gray-500">FIELDING PREFERENCE</p><p>{player.skills?.fieldingPreference || 'N/A'}</p></div>
              <div><p className="font-bold text-gray-500">CRIC HEROES ID</p><p>{player.cricheroesId || 'N/A'}</p></div>
              <div><p className="font-bold text-gray-500">INSTAGRAM ID</p><p>{player.instagramId || 'N/A'}</p></div>

              <div className="col-span-2 border-t"></div>
              <div><p className="font-bold text-gray-500">SUBMISSION DATE</p><p>{new Date(player.submissionDate).toLocaleDateString()}</p></div>
              <div><p className="font-bold text-gray-500">PLACE</p><p>{player.submissionPlace || 'N/A'}</p></div>
              <div className="col-span-2 p-2 bg-gray-50 border-l-4 border-red-900">
                <p className="font-bold text-gray-500">SIGNATURE NAME</p>
                <p className="italic text-lg">{player.signatureName}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              {player.photo && <img src={player.photo} alt="Player" className="w-32 h-40 object-cover border-2 border-red-900" />}
            </div>
          </div>
        </div>

        <button onClick={() => navigatePlayer('next')} disabled={currentIndex === players.length - 1} className="p-4 bg-white shadow rounded-full hover:bg-gray-200 disabled:opacity-30"><FaArrowRight /></button>
      </div>
    </div>
  );
};

export default PlayerDetails;
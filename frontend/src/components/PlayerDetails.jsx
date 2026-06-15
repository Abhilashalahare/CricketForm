import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import FullScreenLoader from './FullScreenLoader';
import { FaHome, FaArrowLeft, FaArrowRight, FaFilePdf, FaPrint } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import profile from '../assets/profile.jpg'
import jyccLogo from '../assets/jycc-logo.png';



const PlayerDetails = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
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

    const images = element.querySelectorAll('img');

images.forEach(img => {
  img.dataset.originalObjectFit = img.style.objectFit;
  img.style.objectFit = 'contain';
});
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

    images.forEach(img => {
  if (img.dataset.originalObjectFit !== undefined) {
    img.style.objectFit = img.dataset.originalObjectFit;
  }
});
  }
};

const navigatePlayer = (direction) => {
  if (isNavigating) return;

  setIsNavigating(true);

  const newIndex =
    direction === "next"
      ? currentIndex + 1
      : currentIndex - 1;

  if (newIndex >= 0 && newIndex < players.length) {
    navigate(`/admin/view/${players[newIndex]._id}`);
  }
};

useEffect(() => {
  if (player) {
    setIsNavigating(false);
  }
}, [player]);

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

  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  body * {
    visibility: hidden;
  }

  #player-profile,
  #player-profile * {
    visibility: visible;
  }

  #player-profile {
    position: absolute;
    left: 0;
    top: 0;
    width: 180mm !important;
    margin: 0 auto !important;
    padding: 8mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    background: white !important;
    
  }

  body {
    background: white !important;
  }
}
`}</style>
      {/* 1. TOP NAVBAR */}
     <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
  <button onClick={() => navigate('/admin')} className="text-[#0A1F5C] cursor-pointer"><FaHome size={24} /></button>
  
  <div className="flex gap-4">
    {/* PRINT BUTTON */}
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition cursor-pointer"
    >
      <FaPrint /> PRINT
    </button>
    
    {/* PDF BUTTON */}
    <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#122f81] text-white px-4 py-2 rounded hover:bg-black transition cursor-pointer">
      <FaFilePdf /> DOWNLOAD PDF
    </button>
  </div>
</nav>

      {/* 2. NAVIGATION ARROWS */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mt-8 px-4">
  
  <button
  onClick={() => navigatePlayer("next")}
  disabled={currentIndex === players.length - 1 || isNavigating}
  className={`
    p-4 bg-white shadow rounded-full
    ${!(currentIndex === players.length - 1 || isNavigating) ? "hover:bg-gray-200 cursor-pointer" : "cursor-not-allowed opacity-30"}
  `}
>
  <FaArrowLeft />
</button>
        
        {/* 3. PROFILE CONTENT CONTAINER */}
       <div id="player-profile" className="bg-white p-5 shadow-2xl rounded-2xl max-w-3xl w-full">

    <div className="flex items-center gap-6 border-b border-slate-700 pb-6 mb-6">
    {/* Logo */}
    <div className="w-20 h-20 flex-shrink-0">
      <img 
        src={jyccLogo} // Ensure 'logo' is imported at the top of your file
        alt="Club Logo" 
        className="w-full h-full object-contain"
      />
    </div>
    
    {/* Heading Group */}
    <div>
      <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#0A1F5C]">
        JAIN YOUTH CRICKET CLUB
      </h1>
      <p className="text-[#0A1F5C] font-bold tracking-widest uppercase text-sm mt-1">
        JYCC 2.0
      </p>
    </div>
  </div>

         
          
          <div className="flex flex-col md:flex-row gap-4">
         


<div className="flex-1 grid grid-cols-3 gap-4 text-sm">
   
  <div><p className="font-bold text-gray-500">FULL NAME</p><p>{player.fullName}</p></div>
  <div>
  <p className="font-bold text-gray-500">DOB</p>
  <p>
    {player.dob 
      ? new Date(player.dob).toLocaleDateString('en-GB') // 'en-GB' gives you DD/MM/YYYY
      : 'N/A'
    }
  </p>
</div>

  <div><p className="font-bold text-gray-500">GENDER</p><p>{player.gender || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">PROFESSION</p><p>{player.profession}</p></div>
  <div><p className="font-bold text-gray-500">MOBILE</p><p>{player.whatsappNumber}</p></div>
  <div><p className="font-bold text-gray-500">EMAIL</p><p>{player.emailId}</p></div>
  <div><p className="font-bold text-gray-500">AADHAAR NUMBER</p><p className="font-mono">{player.aadharNumber}</p></div>
  
  <div className="col-span-3 border-t pt-2 font-bold text-gray-800">LOCATION DETAILS</div>
  <div><p className="font-bold text-gray-500">DISTRICT</p><p>{player.district || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">STATE</p><p>{player.state || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">PIN CODE</p><p>{player.pinCode || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">ADDRESS</p><p>{player.residentialAddress}</p></div>

  <div className="col-span-3 border-t pt-2 font-bold text-gray-800">KIT & PAYMENT</div>
  <div><p className="font-bold text-gray-500">PAYMENT METHOD</p><p>{player.paymentMethod || 'N/A'}</p></div>
  <div>
    <p className="font-bold text-gray-500">RECEIPT</p>
    {player.utrReceipt ? <button onClick={() => handleViewReceipt(player.utrReceipt)} className="text-blue-600 underline cursor-pointer">View Receipt</button> : 'N/A'}
  </div>
  <div><p className="font-bold text-gray-500">JERSEY NAME</p><p>{player.jerseyName || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">JERSEY NUMBER</p><p>{player.jerseyNumber || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">JERSEY SIZE</p><p>{player.jerseySize || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">LOWER SIZE</p><p>{player.lowerSize || 'N/A'}</p></div>

  <div className="col-span-3 border-t pt-2 font-bold text-gray-800">SKILLS & GAME</div>
  <div><p className="font-bold text-gray-500">BATTING</p><p>{player.skills?.batting || 'N/A'}</p></div>
<div><p className="font-bold text-gray-500">BOWLING ARM</p><p>{player.skills?.bowlingArm || 'N/A'}</p></div>
<div><p className="font-bold text-gray-500">BOWLING PACE</p><p>{player.skills?.bowlingPace || 'N/A'}</p></div>
<div><p className="font-bold text-gray-500">FIELDING PREF.</p><p>{player.skills?.fieldingPreference || 'N/A'}</p></div>
<div><p className="font-bold text-gray-500">SPECIFY PREF.</p><p>{player.skills?.fieldingDetails || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">CRICHEROES ID</p><p>{player.cricheroesId || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">INSTAGRAM ID</p><p>{player.instagramId || 'N/A'}</p></div>

  <div className="col-span-3 border-t pt-2 font-bold text-gray-800">SUBMISSION</div>
  <div><p className="font-bold text-gray-500">SIGNATURE</p><p>{player.signatureName || 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">DATE</p><p>{player.submissionDate ? new Date(player.submissionDate).toLocaleDateString() : 'N/A'}</p></div>
  <div><p className="font-bold text-gray-500">PLACE</p><p>{player.submissionPlace || 'N/A'}</p></div>

</div>
           <div
  className="border-2 border-[#0A1F5C] bg-white flex items-center justify-center"
  style={{
    width: "128px",
    height: "160px",
    overflow: "hidden"
  }}
>
  <img
    src={player.photo || profile}
    alt="Player"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }}
  />
</div>
          </div>
        </div>

       <button
  onClick={() => navigatePlayer("prev")}
  disabled={currentIndex === 0|| isNavigating}
  className={`
    p-4 bg-white shadow rounded-full
    ${
      !(currentIndex === 0 || isNavigating)
        ? "hover:bg-gray-200 cursor-pointer"
        : "cursor-not-allowed opacity-30"
    }
  `}
>
  <FaArrowRight />
</button>
      </div>
    </div>
  );
};

export default PlayerDetails;
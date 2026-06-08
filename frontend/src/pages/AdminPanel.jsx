import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LogoutButton from '../components/LogoutButton';
import FullScreenLoader from '../components/FullScreenLoader';
import { FaEye, FaTrash, FaFileExcel } from 'react-icons/fa'; 
import { CSVLink } from 'react-csv';
import logo from '../assets/logo.png';




const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page

  const rowsPerPage = 10;
  const navigate = useNavigate();

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const filteredPlayers = players.filter(p => {
  const matchesSearch = 
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mobileNumber?.includes(searchTerm) ||
    p.cricheroesId?.toLowerCase().includes(searchTerm.toLowerCase());

  const skillString = `${p.skills?.batting || 'None'}-${p.skills?.bowling || 'None'}`;
  
  // Mapping logic
  let matchesSkill = true;
  if (skillFilter !== 'All') {
    const mapping = {
      'Right-Right': 'Right Hand-Right Hand',
      'Right-Left': 'Right Hand-Left Hand',
      'Left-Left': 'Left Hand-Left Hand',
      'Left-Right': 'Left Hand-Right Hand'
    };
    matchesSkill = skillString === mapping[skillFilter];
  }

  return matchesSearch && matchesSkill;
});

  const totalPages = Math.ceil(filteredPlayers.length / rowsPerPage);
const currentRows = filteredPlayers.slice(indexOfFirstRow, indexOfLastRow);

const exportData = players.map((p, index) => ({
    "S.No": index + 1,
    "Full Name": p.fullName,
    "Profession": p.profession,
    "Mobile": p.mobileNumber,
    "WhatsApp": p.whatsappNumber || 'N/A',
    "Email": p.emailId,
    "Address": p.residentialAddress,
    "Aadhar Number": p.aadharNumber,
    "UTR Number": p.utrNumber,
    "Jersey Name": p.jerseyName,
    "Jersey No": p.jerseyNumber,
    "Jersey Size": p.jerseySize,
    "Lower Size": p.lowerSize,
    "Batting": p.skills?.batting || 'None',
    "Bowling": p.skills?.bowling || 'None',
    "Wicket Keeping": p.wicketKeeping,
    "Fielding Preference": p.skills?.fieldingPreference || 'N/A',
    "CricHeroes ID": p.cricheroesId || 'N/A',
    "Instagram ID": p.instagramId || 'N/A',
    "Submission Date": new Date(p.submissionDate).toLocaleDateString(),
    "Submission Place": p.submissionPlace,
    "Signature": p.signatureName
  }));

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
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200">
        <img src={logo} alt="Organization Logo" className="h-10 w-auto" />
        
        <div className="flex gap-4">
          <CSVLink 
            data={exportData} 
            filename={"player_registrations.csv"}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition text-sm font-bold"
          >
            <FaFileExcel /> EXPORT EXCEL
          </CSVLink>
          <LogoutButton />
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="p-4 md:p-8">
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
    
    {/* Heading */}
    <h1 className="text-2xl font-bold">PLAYER REGISTRATIONS</h1>

    {/* Filter & Search Container */}
    <div className="flex gap-4 items-center">
      {/* Filter Dropdown */}
      <select 
        className="p-2 border rounded cursor-pointer"
        onChange={(e) => { setSkillFilter(e.target.value); setCurrentPage(1); }}
      >
        <option value="All">All Skills</option>
        <option value="Right-Right">Right-Right</option>
        <option value="Right-Left">Right-Left</option>
        <option value="Left-Left">Left-Left</option>
        <option value="Left-Right">Left-Right</option>
      </select>

      {/* Search Bar */}
      <div className="flex items-center border rounded overflow-hidden bg-white">
        <input 
          type="text"
          placeholder="Search..."
          className="p-2 outline-none w-48 md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // If you want the search to trigger on Enter, use the form wrapping trick or onKeyDown
          onKeyDown={(e) => {
            if (e.key === 'Enter') setCurrentPage(1);
          }}
        />
        {/* <button 
          className="p-2 bg-gray-100 hover:bg-gray-200 border-l"
          onClick={() => setCurrentPage(1)}
        >
        
        </button> */}
      </div>
    </div>
  </div>
  
        
        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">S.No</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">CricHeroes ID</th>
                <th className="px-6 py-4">Skills</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
  
  {currentRows.map((p, index) => (
    <tr key={p._id}>
     
      <td className="px-6 py-4">{indexOfFirstRow + index + 1}.</td>
      <td className="px-6 py-4">
        {p.photo ? (
          <img src={p.photo} alt="Player" className="w-12 h-12 object-cover rounded-full border border-gray-300" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">N/A</div>
        )}
      </td>
      <td className="px-6 py-4">{p.fullName}</td>
      <td className="px-6 py-4">{p.mobileNumber}</td>
      <td className="px-6 py-4">{p.cricheroesId || 'N/A'}</td>
      <td className="px-6 py-4">{p.skills?.batting} / {p.skills?.bowling}</td>
      <td className="px-6 py-4 flex items-center space-x-2">
        <button 
          onClick={() => navigate(`/admin/view/${p._id}`)} 
          className="p-2 rounded-md transition-all duration-200 cursor-pointer text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-600"
          title="View Details"
        >
          <FaEye size={18} />
        </button>
        <button 
          onClick={() => deletePlayer(p._id)} 
          className="p-2 rounded-md transition-all duration-200 cursor-pointer text-red-600 hover:bg-red-600 hover:text-white border border-red-600"
          title="Delete Player"
        >
          <FaTrash size={18} />
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>

         {/* 2. PAGINATION CONTROLS */}
          {players.length > rowsPerPage && (
            <div className="flex justify-center items-center gap-4 py-6">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="font-bold">Page {currentPage} of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          )} 
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
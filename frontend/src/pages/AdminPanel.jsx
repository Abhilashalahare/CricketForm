import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import FullScreenLoader from '../components/FullScreenLoader';
import Navbar from '../components/Navbar';

import { FaEye, FaTrash, FaUserCircle } from 'react-icons/fa';
import { CSVLink } from 'react-csv';

import logo from '../assets/logo.png';

import { Search, Download, Filter } from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import defaultAvatar from "../assets/profile.jpg";




const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const ALL = 'All';
  const [battingFilter, setBattingFilter] = useState(ALL);
  const [bowlingFilter, setBowlingFilter] = useState(ALL);
 

  const rowsPerPage = 25;
  const navigate = useNavigate();

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredPlayers = players.filter((p) => {
    const searchVal = searchTerm.toLowerCase();
    const matchesSearch =
      p.fullName?.toLowerCase().includes(searchVal) ||
      p.whatsappNumber?.includes(searchVal) ||
      p.cricheroesId?.toLowerCase().includes(searchVal);

    const matchesBatting =
      battingFilter === ALL || p.skills?.batting === battingFilter;

  const matchesBowling =
  bowlingFilter === ALL || p.skills?.bowling === bowlingFilter;



    return matchesSearch && matchesBatting && matchesBowling;
  });


  const totalPages = Math.ceil(filteredPlayers.length / rowsPerPage);
  const currentRows = filteredPlayers.slice(indexOfFirstRow, indexOfLastRow);

  const exportData = players.map((p, index) => ({
    "S.No": p.serialNumber,
    "Full Name": p.fullName,
    "Profession": p.profession,
    "Date of Birth": p.dob || 'N/A',
    "Gender": p.gender || 'N/A',
    "WhatsApp Number": p.whatsappNumber || 'N/A',
    "Email": p.emailId,
    "Aadhar Number": p.aadharNumber, // Security: Never export this ID in plain text
    "City": p.city || 'N/A',
    "District": p.district || 'N/A',
    "State": p.state || 'N/A',
    "Pin Code": p.pinCode || 'N/A',
    "Address": p.residentialAddress,
    "Jersey Name": p.jerseyName || 'N/A',
    "Jersey No": p.jerseyNumber || 'N/A',
    "Jersey Size": p.jerseySize || 'S',
    "Lower Size": p.lowerSize || 'N/A',

    "Batting": p.skills?.batting || 'N/A',
    "Bowling": p.skills?.bowling || 'N/A',

    "Wicket Keeping": p.wicketKeeping || 'No',
    "Payment Method": p.paymentMethod || 'N/A', // Updated to match schema
    "CricHeroes ID": p.cricheroesId || 'N/A',
    "Instagram ID": p.instagramId || 'N/A',
    "Submission Date": p.submissionDate ? new Date(p.submissionDate).toLocaleDateString() : 'N/A',
    "Submission Place": p.submissionPlace || 'N/A',
    "Signature": p.signatureName
  }));



  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/players`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // This makes the newest registration index 0
      setPlayers(response.data.reverse());
    } catch (err) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchPlayers();
  }, []);

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



  if (loading) return <FullScreenLoader />

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. TOP NAVIGATION BAR */}
      {/* <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200">
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
      </nav> */}

      <Navbar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            PLAYER REGISTRATIONS
          </h1>

          <LogoutButton />
        </div>

        {/* Main Container */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden mb-8">

          {/* Filters + Search + Export */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <Filter size={16} />
                Filters:
              </div>

              {/* Batting */}
              <select
                value={battingFilter}
                onChange={(e) => {
                  setBattingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition cursor-pointer"
              >
                <option value="All">Batting</option>
                <option value="Right Hand">Right Hand</option>
                <option value="Left Hand">Left Hand</option>
              </select>

              {/* Bowling Arm */}
              <select
                value={bowlingFilter}
                onChange={(e) => {
                  setBowlingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition cursor-pointer"
              >
                <option value="All">Bowling</option>
              <option value="Right Hand Fast">Right Hand Fast</option>
<option value="Left Hand Fast">Left Hand Fast</option>
<option value="Right Hand Spinner">Right Hand Spinner</option>
<option value="Left Hand Spinner">Left Hand Spinner</option>
              </select>

            
            </div>

            {/* Search + Export */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search players..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <CSVLink
                data={exportData}
                filename={"player_registrations.csv"}
                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition text-sm font-semibold"
              >
                <Download size={16} />
                Export
              </CSVLink>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">S.No</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Registration No.</th>
                  <th className="px-6 py-4">Batting</th>
                  <th className="px-6 py-4">Bowling</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {currentRows.length > 0 ? (
                  currentRows.map((p) => {
                    const originalIndex = players.findIndex(
                      (player) => player._id === p._id
                    );

                    return (
                      <tr key={p._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">{originalIndex + 1}</td>

                        <td className="px-6 py-4">
                          {p.photo ? (
    <img
      // Concatenate the backend URL with the path stored in the database
      src={`${import.meta.env.VITE_BACKEND_URL}/${p.photo}`}
      alt="Player"
      className="w-12 h-12 rounded-full object-cover border"
      onError={(e) => {  e.target.src = defaultAvatar; }} // Fallback if image fails
    />
  ) : (
    <FaUserCircle className="text-gray-400 text-5xl" />
  )}
</td>

                        <td className="px-6 py-4 font-medium">
                          {p.fullName}
                        </td>

                        <td className="px-6 py-4">
                          {p.whatsappNumber}
                        </td>

                        <td className="px-6 py-4">
                          {p.serialNumber || "N/A"}
                        </td>

                        <td className="px-6 py-4">
                          {p.skills?.batting || "N/A"}
                        </td>

                        <td className="px-6 py-4">
                          {p.skills?.bowling|| "N/A"}
                        </td>

              

                        <td className="px-6 py-4 flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/view/${p._id}`)}
                            className="p-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                          >
                            <FaEye size={16} />
                          </button>

                          <button
                            onClick={() => deletePlayer(p._id)}
                            className="p-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No player data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredPlayers.length > rowsPerPage && (
              <div className="flex justify-center items-center gap-4 py-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>

                <span className="font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;



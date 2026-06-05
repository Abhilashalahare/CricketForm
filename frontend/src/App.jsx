import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm'
import AdminPanel from './pages/AdminPanel'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PlayerDetails from './components/PlayerDetails';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<RegistrationForm />} />
       <Route 
    path="/admin" 
    element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} 
  />
  <Route 
    path="/admin/view/:id" 
    element={<ProtectedRoute><PlayerDetails/></ProtectedRoute>} 
  />

  <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  )
}

export default App;
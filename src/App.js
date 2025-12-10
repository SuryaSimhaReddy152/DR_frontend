import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  // 1. INITIALIZE STATE: Read session from localStorage on component mount
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      return null;
    }
  });

  // 2. DEFINE LOGOUT HANDLER: Clears state and localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 3. DEFINE LOGIN HANDLER: Sets state (Login.js already saves to localStorage)
  const handleLogin = (userData) => {
    setUser(userData);
  };


  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        
        {/* If user IS logged in, redirect them to the Dashboard */}
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        {/* The main application route */}
        <Route 
          path="/*" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
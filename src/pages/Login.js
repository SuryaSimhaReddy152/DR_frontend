import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      
      // --- SESSION PERSISTENCE FIX ---
      // 1. Store user data in local storage upon successful login
      localStorage.setItem('user', JSON.stringify(res.data));
      // -------------------------------

      onLogin(res.data); // This updates the global state in App.js
    } catch (err) {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#f1f5f9' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>RetinaScan AI</h2>
        
        <form onSubmit={handleSubmit}>
          <label className="label" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>USERNAME</label>
          <input className="input-field" onChange={e => setUsername(e.target.value)} required />
          
          <label className="label" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>PASSWORD</label>
          <input className="input-field" type="password" onChange={e => setPassword(e.target.value)} required />
          
          <button className="btn btn-primary w-full" type="submit">Access Portal</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          New User? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
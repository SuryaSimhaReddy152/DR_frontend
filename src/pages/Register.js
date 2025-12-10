// client/src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        password,
        fullName
      });
      alert("Registration Successful! Please Login.");
      
      // FIX: Use lowercase '/login'
      navigate('/login'); 
      
    } catch (err) {
      alert(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#f1f5f9' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>FULL NAME</label>
          <input className="input-field" placeholder="Dr. Jane Doe" onChange={e => setFullName(e.target.value)} required />

          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>USERNAME</label>
          <input className="input-field" placeholder="Choose ID" onChange={e => setUsername(e.target.value)} required />
          
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>PASSWORD</label>
          <input className="input-field" type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} required />
          
          <button className="btn btn-primary w-full" type="submit">Sign Up</button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
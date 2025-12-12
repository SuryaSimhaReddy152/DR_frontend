import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState(''); // Changed from username
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // New state for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    // Basic client-side validation
    if (!email || !password) {
        return setError("Please enter your email and password.");
    }
    
    try {
      // Send email instead of username
      const res = await axios.post('http://localhost:5000/api/login', { email, password }); 
      
      localStorage.setItem('user', JSON.stringify(res.data));
      onLogin(res.data); // This updates the global state in App.js
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login Failed. Server unreachable.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#f1f5f9' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>RetinaScan AI</h2>
        
        {/* Display Error Message */}
        {error && (
            <div style={{ color: 'white', background: 'var(--danger)', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="label" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>EMAIL ADDRESS</label>
          {/* Changed input type to email and state to email */}
          <input 
            className="input-field" 
            type="email"
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          <label className="label" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>PASSWORD</label>
          <input 
            className="input-field" 
            type="password" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
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
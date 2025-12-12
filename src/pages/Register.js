import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState(''); // Changed from username
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(''); // New state for error messages
  const [success, setSuccess] = useState(''); // New state for success messages
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous messages
    setSuccess('');

    // --- Client-side Validation ---
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return setError("Please enter a valid email address.");
    }

    try {
      // Send email instead of username
      await axios.post('http://localhost:5000/api/register', {
        email,
        password,
        fullName
      });
      
      setSuccess("Registration Successful! Redirecting to Login...");
      // Redirect after a slight delay
      setTimeout(() => navigate('/login'), 1500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration Failed. Server unreachable.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#f1f5f9' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>Create Account</h2>
        
        {/* Display Error Message */}
        {error && (
            <div style={{ color: 'white', background: 'var(--danger)', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                {error}
            </div>
        )}
        {/* Display Success Message */}
        {success && (
            <div style={{ color: 'white', background: 'var(--success)', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                {success}
            </div>
        )}

        <form onSubmit={handleRegister}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>FULL NAME</label>
          <input 
            className="input-field" 
            placeholder="Dr. Jane Doe" 
            onChange={e => setFullName(e.target.value)} 
            required 
          />

          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>EMAIL ADDRESS</label>
          <input 
            className="input-field" 
            type="email"
            placeholder="email@example.com" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>PASSWORD</label>
          <input 
            className="input-field" 
            type="password" 
            placeholder="••••••••" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
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
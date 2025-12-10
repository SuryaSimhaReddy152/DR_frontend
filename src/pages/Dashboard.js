import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import NewScan from './NewScan';
import History from './History'; // We will create this later
import { FaUserMd, FaPlusCircle, FaHistory, FaSignOutAlt } from 'react-icons/fa';

function Dashboard({ user, onLogout }) {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <aside className="sidebar flex flex-col justify-between">
        <div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '40px' }}>RetinaScan AI</h2>
          
          <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaUserMd color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{user.role}</div>
            </div>
          </div>

          <nav>
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <FaPlusCircle style={{ marginRight: 10 }} /> New Patient Scan
            </Link>
            <Link to="/history" className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
              <FaHistory style={{ marginRight: 10 }} /> Patient Records
            </Link>
          </nav>
        </div>

        <button onClick={onLogout} className="nav-item" style={{ border: 'none', background: 'transparent', textAlign: 'left', color: 'var(--danger)' }}>
          <FaSignOutAlt style={{ marginRight: 10 }} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="w-full" style={{ padding: '40px', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<NewScan />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect } from 'react' ;
import axios from 'axios';
import { FaSearch, FaEye, FaTimes, FaFilePdf, FaFilter, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';

function History() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All"); 
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      setPatients(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load history");
      setLoading(false);
    }
  };

  const handleViewPatient = async (id) => {
    setModalLoading(true);
    setSelectedPatient({ loading: true }); 
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/${id}`);
      setSelectedPatient(res.data);
    } catch (err) {
      alert("Error loading patient details");
      setSelectedPatient(null);
    }
    setModalLoading(false);
  };

  // DELETE LOGIC (Completely Silent)
  const handleDeletePatient = async (id, name) => {
    try {
      await axios.delete(`http://localhost:5000/api/patient/${id}`);
      fetchHistory();
    } catch (err) {
      alert("Failed to delete record. Check Node.js console.");
    }
  };

  const generatePDF = (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("RetinaScan AI - Medical Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${patient.name}`, 20, 30);
    doc.text(`Diagnosis: ${patient.diagnosis}`, 20, 40);
    doc.text(`Severity: Stage ${patient.severity}`, 20, 50);
    doc.text(`Confidence: ${patient.confidence.toFixed(2)}%`, 20, 60);
    doc.save(`${patient.name}_Report.pdf`);
  };

  // Helper function for color mapping (FIXED)
  const getSeverityColor = (severity) => {
      // FIX: Ensure severity is treated as an integer for safe comparison
      const s = parseInt(severity); 
      
      if (s === 2) return 'var(--danger)'; // Proliferative / Severe (RED)
      if (s === 1) return 'var(--warning)'; // Moderate (YELLOW)
      return 'var(--success)'; // No DR / Mild (GREEN)
  };

  // UPDATED FILTER LOGIC 
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.phone.includes(search);
    const matchesSeverity = filterSeverity === "All" || p.severity === parseInt(filterSeverity);

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER & FILTERS */}
      <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
        <h2>Patient Records</h2>
        
        <div className="flex gap-4">
          {/* SEVERITY DROPDOWN */}
          <div style={{ position: 'relative' }}>
            <FaFilter style={{ position: 'absolute', left: 10, top: 12, color: '#64748b' }} />
            <select 
              className="input-field" 
              style={{ paddingLeft: 35, width: 250, marginBottom: 0, cursor: 'pointer' }}
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="All">All Severities</option>
              <option value="0">Group 0 (No DR / Mild)</option>
              <option value="1">Group 1 (Moderate)</option>
              <option value="2">Group 2 (Severe / Proliferative)</option>
            </select>
          </div>

          {/* SEARCH BAR */}
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: 10, top: 12, color: '#94a3b8' }} />
            <input 
              className="input-field" 
              placeholder="Search Name or Phone..." 
              style={{ paddingLeft: 35, width: 250, marginBottom: 0 }}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left', color: '#64748b' }}>
              <th className="p-4">Date</th>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Age/Gender</th>
              <th className="p-4">Diagnosis</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading records...</td></tr>
            ) : filteredPatients.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center" style={{color: '#94a3b8'}}>No matching records found.</td></tr>
            ) : (
              filteredPatients.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td className="p-4">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-4 font-bold">{p.name}</td>
                  <td className="p-4">{p.age} / {p.gender}</td>
                  <td className="p-4">
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 'bold', color: 'white',
                      background: getSeverityColor(p.severity)
                    }}>
                      {p.diagnosis}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="btn" style={{ background: '#e0f2fe', color: 'var(--primary)', marginRight: 5 }} onClick={() => handleViewPatient(p._id)}>
                      <FaEye /> View
                    </button>
                    <button 
                      className="btn" 
                      style={{ background: '#fecaca', color: 'var(--danger)' }} 
                      onClick={() => handleDeletePatient(p._id, p.name)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedPatient && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: 800, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setSelectedPatient(null)}
              style={{ position: 'absolute', right: 20, top: 20, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
            >
              <FaTimes />
            </button>

            {selectedPatient.loading ? (
              <p className="p-4 text-center">Loading medical records...</p>
            ) : (
              <>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: 10 }}>Medical Record</h2>
                
                <div className="flex gap-4" style={{ marginTop: 20 }}>
                  <div style={{ flex: 1 }}>
                    <p><strong>Name:</strong> {selectedPatient.name}</p>
                    <p><strong>Age:</strong> {selectedPatient.age}</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                    <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                    <p><strong>Date:</strong> {new Date(selectedPatient.date).toLocaleString()}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ padding: 15, background: '#f8fafc', borderRadius: 8 }}>
                        <h3 style={{ margin: 0, color: getSeverityColor(selectedPatient.severity) }}>
                            {selectedPatient.diagnosis}
                        </h3>
                        <p>Confidence: {selectedPatient.confidence.toFixed(1)}%</p>
                    </div>
                    <button className="btn btn-primary w-full" style={{ marginTop: 10 }} onClick={() => generatePDF(selectedPatient)}>
                        <FaFilePdf style={{ marginRight: 8 }} /> Download Report
                    </button>
                  </div>
                </div>

                <div className="flex gap-4" style={{ marginTop: 20 }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 'bold' }}>Original Scan</p>
                        <img src={selectedPatient.image} alt="Original" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 'bold' }}>AI Heatmap (Attention)</p>
                        <img src={selectedPatient.heatmap} alt="Heatmap" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd' }} />
                    </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
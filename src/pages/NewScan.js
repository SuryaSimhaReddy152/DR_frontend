import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function NewScan() {
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', phone: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Drag & Drop Logic
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: acceptedFiles => {
      const f = acceptedFiles[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null); // Reset result on new upload
    }
  });

  // Handle Submit to Backends
  const handleAnalyze = async () => {
    if (!file || !formData.name) return alert("Please fill details and upload image");

    setLoading(true);
    setResult(null); // Clear previous results while loading
    
    // URL points to Node.js Backend (Port 5000)
    const backendUrl = "http://localhost:5000/api/scan"; 
    
    const data = new FormData();
    data.append('file', file);
    data.append('name', formData.name);
    data.append('age', formData.age);
    data.append('gender', formData.gender);
    data.append('phone', formData.phone);

    try {
      // --- REAL API CALL ---
      console.log("🚀 Sending request to Node.js...");
      const res = await axios.post(backendUrl, data);
      
      console.log("✅ Received response:", res.data);
      setResult(res.data); // Update UI with Real AI Data
      
    } catch (err) {
      console.error("❌ Error:", err);
      
      // Check for 409 Conflict error from the backend (Unique Patient Check)
      if (err.response && err.response.status === 409) {
          alert(err.response.data.error); 
      } else {
          alert("Error connecting to server or analysis failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function for color mapping (New 3-stage severity: 0=Green, 1=Yellow, 2=Red)
  const getSeverityColor = (severity) => {
      // Ensure severity is an integer for comparison
      const s = parseInt(severity); 
      
      if (s === 2) return 'var(--danger)'; // Proliferative (RED)
      if (s === 1) return 'var(--warning)'; // Moderate (YELLOW)
      return 'var(--success)'; // No DR / Mild (GREEN)
  };

  return (
    <div className="flex gap-4">
      {/* LEFT: FORM */}
      <div className="card" style={{ flex: 1 }}>
        <h3>Patient Vitals</h3>
        <input className="input-field" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
        <div className="flex gap-4">
          <input className="input-field" placeholder="Age" type="number" onChange={e => setFormData({...formData, age: e.target.value})} />
          <select className="input-field" onChange={e => setFormData({...formData, gender: e.target.value})}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <input className="input-field" placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} />
        
        <div style={{ marginTop: 20 }}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="Scan" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }} />
            ) : (
              <p>Drag & drop Retinal Scan here</p>
            )}
          </div>
        </div>

        <button 
          className="btn btn-primary w-full" 
          style={{ marginTop: 20 }} 
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing with AI..." : "Analyze & Save Record"}
        </button>
      </div>

      {/* RIGHT: RESULTS (Only shows after analysis) */}
      {result && (
        <div className="card" style={{ flex: 1, border: '2px solid var(--primary)' }}>
          <div style={{ textAlign: 'center' }}>
            {/* Color indicator based on severity (0=Green, 1=Yellow, 2=Red) */}
            <div style={{ 
              height: '10px', 
              width: '100%', 
              borderRadius: '5px',
              marginBottom: '10px',
              background: getSeverityColor(result.severity)
            }}>
            </div>
            
            <h2 style={{ marginTop: 10 }}>{result.diagnosis}</h2>
            <p style={{ color: '#64748b' }}>Confidence: {result.confidence.toFixed(1)}%</p>

          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', marginBottom: 10 }}>AI Attention Heatmap</p>
            {/* Display the Base64 Heatmap returned from Python */}
            <img src={result.heatmap} alt="Heatmap" style={{ width: '100%', borderRadius: 8 }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default NewScan;
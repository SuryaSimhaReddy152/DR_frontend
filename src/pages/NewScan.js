import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

// Component to display inline validation errors
const ValidationError = ({ message }) => {
    return message ? (
        <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
            {message}
        </p>
    ) : null;
};

function NewScan() {
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', phone: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(''); // For server or file errors
  const [fieldErrors, setFieldErrors] = useState({}); // For inline field errors

  // Drag & Drop Logic
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: acceptedFiles => {
      const f = acceptedFiles[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null); 
      setGlobalError('');
    }
  });

  // --- VALIDATION HANDLERS ---
  const validateFields = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name) {
        errors.name = "Full Name is required.";
        isValid = false;
    }
    if (!formData.age || parseInt(formData.age) <= 0) {
        errors.age = "Age must be a positive number.";
        isValid = false;
    }
    if (!formData.phone || formData.phone.length !== 10 || isNaN(formData.phone)) {
        errors.phone = "Phone number must be exactly 10 digits.";
        isValid = false;
    }
    if (!file) {
        errors.file = "A retinal scan image must be uploaded.";
        isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error for the field being typed into
    if (fieldErrors[name]) {
        setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };
  // --- END VALIDATION HANDLERS ---

  // Handle Submit to Backends
  const handleAnalyze = async () => {
    setGlobalError('');
    setResult(null);
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return setGlobalError("Please correct the errors in the patient vitals section.");
    }

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
      
      let errorMessage = "Error connecting to server or analysis failed.";
      
      // Server errors (409 Duplicate, 400 Validation, 500 AI Pipeline failure)
      if (err.response) {
          errorMessage = err.response.data.error || errorMessage;
      }
      
      setGlobalError(errorMessage);
      
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
        
        {/* GLOBAL ERROR DISPLAY */}
        {globalError && (
            <div style={{ color: 'white', background: 'var(--danger)', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                {globalError}
            </div>
        )}
        
        {/* Full Name Input */}
        <input 
            className="input-field" 
            name="name"
            placeholder="Full Name" 
            onChange={handleInputChange} 
            value={formData.name}
        />
        <ValidationError message={fieldErrors.name} />

        {/* Age and Gender Row */}
        <div className="flex gap-4">
          <input 
            className="input-field" 
            name="age"
            placeholder="Age" 
            type="number" 
            min="1"
            onChange={handleInputChange} 
            value={formData.age}
            style={{ flex: 1 }}
          />
          <select 
            className="input-field" 
            name="gender"
            onChange={handleInputChange}
            value={formData.gender}
            style={{ flex: 1 }}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <ValidationError message={fieldErrors.age} />
        
        {/* Phone Number Input */}
        <input 
            className="input-field" 
            name="phone"
            placeholder="Phone Number (10 digits)" 
            type="tel"
            maxLength="10"
            onChange={handleInputChange} 
            value={formData.phone}
        />
        <ValidationError message={fieldErrors.phone} />
        
        {/* Image Dropzone */}
        <div style={{ marginTop: 20 }}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="Scan" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }} />
            ) : (
              <p>Drag & drop Retinal Scan here</p>
            )}
          </div>
          <ValidationError message={fieldErrors.file} />
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
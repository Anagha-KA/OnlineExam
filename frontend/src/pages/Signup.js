import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5001/api/auth/signup', formData);
      alert("Account created! You can now login.");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <button onClick={() => navigate('/')} style={backButtonStyle}><ArrowLeft size={18}/> Back</button>
        <h1 style={{ color: '#00d1ff' }}>Join Nebula</h1>
        <p style={{ color: '#8b8d97', marginBottom: '20px' }}>Create your student account</p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={inputGroupStyle}>
            <User size={18} color="#8b8d97" />
            <input type="text" placeholder="Full Name" style={inputStyle} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
          </div>
          <div style={inputGroupStyle}>
            <Mail size={18} color="#8b8d97" />
            <input type="email" placeholder="Email Address" style={inputStyle} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div style={inputGroupStyle}>
            <Lock size={18} color="#8b8d97" />
            <input type="password" placeholder="Create Password" style={inputStyle} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <button type="submit" style={submitButtonStyle}>Create Account</button>
        </form>
      </div>
    </div>
  );
};

// Use existing styles from Login.js for consistency
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0b14', color: 'white' };
const cardStyle = { background: '#11121d', padding: '40px', borderRadius: '20px', border: '1px solid #1f212e', width: '380px', textAlign: 'center' };
const inputGroupStyle = { display: 'flex', alignItems: 'center', background: '#0a0b14', borderRadius: '10px', padding: '10px 15px', border: '1px solid #1f212e' };
const inputStyle = { background: 'none', border: 'none', color: 'white', marginLeft: '10px', width: '100%', outline: 'none' };
const submitButtonStyle = { background: '#00d1ff', color: '#000', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };
const backButtonStyle = { background: 'none', border: 'none', color: '#8b8d97', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' };

export default Signup;
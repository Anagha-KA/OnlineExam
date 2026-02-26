import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { User, ShieldCheck, Lock, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handler for Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@nebula.com') {
      navigate('/admin/questions');
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  // Handler for Student Login
  const handleStudentLogin = (e) => {
    e.preventDefault();
    navigate('/student/dashboard');
  };

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        <h1 style={titleStyle}>Nebula LMS</h1>
        <p style={subtitleStyle}>Select your portal to continue</p>

        <form style={formStyle}>
          <div style={inputGroupStyle}>
            <Mail size={18} style={iconStyle} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle} 
            />
          </div>

          <div style={inputGroupStyle}>
            <Lock size={18} style={iconStyle} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle} 
            />
          </div>

          <div style={buttonGroupStyle}>
            <button type="button" onClick={handleStudentLogin} style={studentButtonStyle}>
              <User size={20} /> Student Login
            </button>

            <button type="button" onClick={handleAdminLogin} style={adminButtonStyle}>
              <ShieldCheck size={20} /> Admin Login
            </button>
          </div>

          {/* --- NEW SECTION: SIGNUP & FORGOT PASSWORD --- */}
          <div style={footerLinkContainer}>
            <button 
              type="button" 
              onClick={() => alert("Password reset link sent to your email!")} 
              style={forgotPasswordStyle}
            >
              Forgot Password?
            </button>
            
            <p style={signupTextStyle}>
              Don't have an account? 
              <Link to="/signup" style={signupLinkStyle}>
                Sign Up
              </Link>
            </p>
          </div>
          {/* --- END OF NEW SECTION --- */}
        </form>
      </div>
    </div>
  );
};

// --- STYLES (Keep your existing styles and add these new ones) ---

const containerStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#0a0b14',
  color: 'white',
  fontFamily: 'Arial, sans-serif'
};

const loginCardStyle = {
  background: '#11121d',
  padding: '40px',
  borderRadius: '20px',
  border: '1px solid #1f212e',
  width: '400px',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};

const titleStyle = { color: '#00d1ff', marginBottom: '10px', fontSize: '32px' };
const subtitleStyle = { color: '#8b8d97', marginBottom: '30px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };

const inputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#0a0b14',
  borderRadius: '10px',
  padding: '10px 15px',
  border: '1px solid #1f212e'
};

const inputStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  marginLeft: '10px',
  width: '100%',
  outline: 'none'
};

const iconStyle = { color: '#8b8d97' };

const buttonGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '20px'
};

const studentButtonStyle = {
  background: '#00d1ff',
  color: '#000',
  padding: '12px',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontSize: '16px'
};

const adminButtonStyle = {
  background: 'transparent',
  color: '#00d1ff',
  padding: '12px',
  border: '2px solid #00d1ff',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontSize: '16px'
};

// --- NEW STYLES FOR FOOTER LINKS ---
const footerLinkContainer = {
  marginTop: '25px',
  borderTop: '1px solid #1f212e',
  paddingTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const forgotPasswordStyle = {
  background: 'none',
  border: 'none',
  color: '#8b8d97',
  cursor: 'pointer',
  fontSize: '13px',
};

const signupTextStyle = {
  fontSize: '14px',
  color: '#8b8d97',
  margin: 0
};

const signupLinkStyle = {
  color: '#00d1ff',
  marginLeft: '8px',
  textDecoration: 'none',
  fontWeight: 'bold'
};

export default Login;
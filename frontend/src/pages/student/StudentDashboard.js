import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, User } from 'lucide-react';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch exams from the Flask backend (Port 5001)
    axios.get('http://127.0.0.1:5001/api/exams')
      .then(res => setExams(res.data))
      .catch(err => console.error("Could not fetch exams. Ensure Flask is running!", err));
  }, []);

  return (
    <div style={{ padding: '40px', background: '#0a0b14', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: 'auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#00d1ff' }}>Nebula Exam Portal</h1>
            <p style={{ color: '#8b8d97', marginTop: '5px' }}>Welcome back! Select an assessment to begin.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8b8d97' }}>
            <User size={20} />
            <span>Student Session</span>
          </div>
        </div>

        <hr style={{ border: '0.5px solid #1f212e', marginBottom: '40px' }} />

        {/* Exam Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {exams.length > 0 ? (
            exams.map(exam => (
              <div key={exam.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '20px' }}>{exam.title}</h3>
                  <span style={tagStyle}>Active</span>
                </div>
                
                <div style={infoRowStyle}><BookOpen size={16} color="#00d1ff"/> {exam.question_count} Questions</div>
                <div style={infoRowStyle}><Clock size={16} color="#00d1ff"/> 30 Minutes Duration</div>
                
                <button 
                    onClick={() => navigate(`/exam/${exam.id}`)} // Redirects to e.g., /exam/1
                    style={buttonStyle}
                >
                    <PlayCircle size={20} /> Start Examination
                </button>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', background: '#11121d', borderRadius: '15px', color: '#8b8d97' }}>
              <p>No exams have been published yet. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styling Objects
const cardStyle = { 
  background: '#11121d', 
  padding: '30px', 
  borderRadius: '16px', 
  border: '1px solid #1f212e',
  transition: 'transform 0.2s',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
};

const tagStyle = {
  background: 'rgba(0, 209, 255, 0.1)',
  color: '#00d1ff',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const infoRowStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', 
  color: '#8b8d97', 
  marginBottom: '12px', 
  fontSize: '15px' 
};

const buttonStyle = { 
  width: '100%', 
  marginTop: '20px', 
  padding: '14px', 
  background: 'linear-gradient(90deg, #00d1ff, #007bff)', 
  color: '#000', 
  border: 'none', 
  borderRadius: '10px', 
  cursor: 'pointer', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  gap: '12px', 
  fontWeight: 'bold',
  fontSize: '16px'
};

export default StudentDashboard;
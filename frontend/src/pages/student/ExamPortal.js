import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';
import MatchingPattern from '../../components/MatchingPattern';

const ExamPortal = () => {
  const { examId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- NEW SUBMISSION STATE ---
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [timeLeft, setTimeLeft] = useState(1800); // 1800 seconds = 30 minutes

useEffect(() => {
  // Start the timer only after the exam has loaded and is not yet submitted
  if (!loading && exam && !submitted) {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }
}, [loading, exam, submitted]);

// Helper to format seconds into MM:SS
    const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

  useEffect(() => {
    axios.get(`http://127.0.0.1:5001/api/exams/${examId}`)
      .then(res => {
        setExam(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching exam:", err);
        setLoading(false);
      });
  }, [examId]);

  // --- NEW HANDLER FUNCTIONS ---
  const handleMCQChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleMatchingChange = (qId, mapping) => {
    setAnswers({ ...answers, [qId]: mapping });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/exams/submit', {
        exam_id: examId,
        student_name: "Anagha K A", // Linked to your profile name
        answers: answers
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit exam. Please check your connection.");
    }
  };

  // --- CONDITIONAL RESULT VIEW ---
  if (submitted && result) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 50px', color: 'white', background: '#0a0b14', minHeight: '100vh' }}>
        <h1 style={{ color: result.status === 'Pass' ? '#28a745' : '#ff4d4d', fontSize: '3rem' }}>
          {result.status === 'Pass' ? 'Congratulations!' : 'Keep Practicing!'}
        </h1>
        <div style={{ fontSize: '64px', margin: '20px 0', fontWeight: 'bold' }}>{result.score}%</div>
        <p style={{ fontSize: '20px', color: '#8b8d97' }}>
          You got {result.correct_count} out of {result.total} questions correct.
        </p>
        <button 
          onClick={() => navigate('/student/dashboard')} 
          style={{ marginTop: '30px', padding: '15px 40px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Exam...</div>;
  if (!exam) return <div style={{ padding: '50px', textAlign: 'center' }}>Exam not found.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '2px solid #007bff', 
        marginBottom: '30px',
        paddingBottom: '10px'
      }}>
        <h1>{exam.title}</h1>
        <div style={{ 
          background: timeLeft < 300 ? '#ff4d4d' : '#11121d', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          fontSize: '20px',
          border: '1px solid #1f212e',
          transition: 'background 0.5s ease'
        }}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </header>

      {/* Check if questions exist */}
      {exam.questions.length > 0 ? (
        exam.questions.map((q, index) => (
          <div key={q.id} style={{ background: '#f9f9f9', padding: '25px', borderRadius: '15px', marginBottom: '20px' }}>
            <h3 style={{ color: '#333' }}>{index + 1}. {q.statement}</h3>
            
            {q.q_type === 'MCQ' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.data_payload.options.map((opt, i) => (
                  <label key={i} style={{ 
                    cursor: 'pointer', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd',
                    display: 'flex', alignItems: 'center'
                  }}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      style={{ marginRight: '10px' }} 
                      onChange={() => handleMCQChange(q.id, opt)} 
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <MatchingPattern 
                data={q.data_payload} 
                onSelect={(val) => handleMatchingChange(q.id, val)} 
              />
            )}
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#888', background: '#f4f4f4', borderRadius: '15px' }}>
          <h3>No questions added to this exam yet.</h3>
          <p>Please use the Exam Builder to add questions to this assessment.</p>
          <button 
            onClick={() => navigate('/student/dashboard')}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Go Back
          </button>
        </div>
      )}

      {exam.questions.length > 0 && (
        <button 
          onClick={handleSubmit} 
          style={{ width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Submit Examination
        </button>
      )}
    </div>
  );
};

export default ExamPortal;
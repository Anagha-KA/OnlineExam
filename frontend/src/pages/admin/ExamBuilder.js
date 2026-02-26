import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Save, CheckSquare, Square } from 'lucide-react';

const ExamBuilder = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState('');

  useEffect(() => {
    // Fetch all questions from the bank
    axios.get('http://127.0.0.1:5001/api/questions')
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Error loading bank:", err));
  }, []);

  const toggleQuestion = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleCreateExam = async () => {
    if (!examTitle || selectedQuestions.length === 0) {
      alert("Please enter a title and select questions.");
      return;
    }

    const payload = {
      title: examTitle,
      question_ids: selectedQuestions.join(',') // Saves as "1,2,5"
    };

    try {
      await axios.post('http://127.0.0.1:5001/api/admin/exams', payload);
      alert("Exam Created Successfully!");
      setExamTitle('');
      setSelectedQuestions([]);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Exam Builder</h1>
          <p style={{ color: '#8b8d97' }}>Create and manage examinations</p>
        </div>
        <button onClick={handleCreateExam} style={saveButtonStyle}>
          <Save size={18} /> Create Exam
        </button>
      </div>

      <div style={{ marginTop: '30px', background: '#11121d', padding: '30px', borderRadius: '15px', border: '1px solid #1f212e' }}>
        <label style={{ color: '#8b8d97', display: 'block', marginBottom: '10px' }}>Exam Title</label>
        <input 
          style={inputStyle} 
          placeholder="e.g., IT Fundamentals Assessment" 
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
        />

        <h3 style={{ marginTop: '30px', color: '#fff' }}>Select Questions from Bank</h3>
        <div style={questionListStyle}>
          {questions.map(q => (
            <div 
              key={q.id} 
              onClick={() => toggleQuestion(q.id)}
              style={{ ...rowStyle, borderColor: selectedQuestions.includes(q.id) ? '#00d1ff' : '#1f212e' }}
            >
              {selectedQuestions.includes(q.id) ? <CheckSquare color="#00d1ff" /> : <Square color="#555" />}
              <div style={{ marginLeft: '15px' }}>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>{q.statement}</div>
                <div style={{ color: '#8b8d97', fontSize: '12px' }}>Type: {q.q_type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

// --- STYLES ---
const inputStyle = { width: '100%', padding: '15px', background: '#0a0b14', border: '1px solid #1f212e', color: 'white', borderRadius: '10px', outline: 'none' };
const questionListStyle = { marginTop: '20px', maxHeight: '400px', overflowY: 'auto', borderRadius: '10px' };
const rowStyle = { display: 'flex', alignItems: 'center', padding: '15px', background: '#0a0b14', border: '1px solid #1f212e', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer' };
const saveButtonStyle = { background: '#00d1ff', color: '#000', padding: '12px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' };

export default ExamBuilder;
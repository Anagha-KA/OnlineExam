import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import AddQuestionModal from '../../components/admin/AddQuestionModal';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadQuestions = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff' }}>Question Bank</h1>
          <p style={{ color: '#8b8d97', marginTop: '5px' }}>Manage your repository of examination questions</p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} style={addButtonStyle}>
          <Plus size={20} /> Add New Question
        </button>
      </div>

      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr style={headerRowStyle}>
              <th style={{ padding: '15px' }}>Statement</th>
              <th style={{ padding: '15px' }}>Type</th>
              <th style={{ padding: '15px' }}>Category</th>
              {/* Removed Actions Header */}
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? (
              questions.map(q => (
                <tr key={q.id} style={bodyRowStyle}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: '500', color: '#fff' }}>{q.statement}</div>
                    <div style={{ fontSize: '12px', color: '#8b8d97' }}>ID: #Q-{q.id}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={q.q_type === 'MCQ' ? mcqBadge : matchingBadge}>
                      {q.q_type}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#8b8d97' }}>{q.category || 'General'}</td>
                  {/* Removed Edit Button Cell */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
                  No questions found. Add some to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={loadQuestions} 
      />
    </AdminLayout>
  );
};

// --- STYLES ---
const addButtonStyle = { 
  background: '#00d1ff', color: '#000', padding: '12px 24px', border: 'none', 
  borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' 
};
const tableContainerStyle = { background: '#11121d', padding: '10px', borderRadius: '15px', border: '1px solid #1f212e' };
const headerRowStyle = { borderBottom: '1px solid #1f212e', color: '#8b8d97', textAlign: 'left', fontSize: '14px' };
const bodyRowStyle = { borderBottom: '1px solid #1f212e' };
const mcqBadge = { padding: '4px 8px', background: 'rgba(0, 209, 255, 0.1)', color: '#00d1ff', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' };
const matchingBadge = { padding: '4px 8px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' };

export default QuestionBank;
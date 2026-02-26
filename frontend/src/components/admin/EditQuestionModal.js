import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const EditQuestionModal = ({ isOpen, onClose, onRefresh, question }) => {
  const [formData, setFormData] = useState({
    statement: '',
    q_type: 'MCQ',
    category: 'General',
    data_payload: {}
  });

  // Pre-fill form when the modal opens with a specific question
  useEffect(() => {
    if (question) {
      setFormData({
        statement: question.statement,
        q_type: question.q_type,
        category: question.category || 'General',
        data_payload: question.data_payload || {}
      });
    }
  }, [question]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5001/api/questions/${question.id}`, formData);
      onRefresh(); // Refresh the list in QuestionBank.js
      onClose();   // Close this modal
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update question.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: '#00d1ff', margin: 0 }}>Edit Question</h2>
          <X onClick={onClose} style={{ cursor: 'pointer', color: '#8b8d97' }} />
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={labelStyle}>Question Statement</label>
            <textarea 
              value={formData.statement}
              onChange={(e) => setFormData({...formData, statement: e.target.value})}
              style={inputStyle}
              rows="3"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={inputStyle}
            >
              <option value="Python">Python</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="General">General</option>
            </select>
          </div>

          <button type="submit" style={saveButtonStyle}>Update Question</button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: '#11121d', padding: '30px', borderRadius: '20px', width: '500px', border: '1px solid #1f212e' };
const labelStyle = { color: '#8b8d97', display: 'block', marginBottom: '8px', fontSize: '14px' };
const inputStyle = { width: '100%', background: '#0a0b14', border: '1px solid #1f212e', color: 'white', padding: '12px', borderRadius: '8px', outline: 'none' };
const saveButtonStyle = { background: '#00d1ff', color: '#000', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default EditQuestionModal;
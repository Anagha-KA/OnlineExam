import React, { useState } from 'react';
import axios from 'axios';

const AddQuestionModal = ({ isOpen, onClose, onRefresh }) => {
  const [qType, setQType] = useState('MCQ');
  const [statement, setStatement] = useState('');
  const [category, setCategory] = useState('Technical');
  
  // MCQ State
  const [mcqData, setMcqData] = useState({ options: ['', '', '', ''], answer: '' });
  
  // Matching State
  const [matchData, setMatchData] = useState({
    left: [{ id: 'L1', text: '' }],
    right: [{ id: 'R1', text: '' }],
    correct_mapping: {}
  });

  const handleSave = async () => {
    const payload = {
      statement,
      category,
      q_type: qType,
      data_payload: qType === 'MCQ' ? mcqData : matchData
    };

    try {
      await axios.post('http://127.0.0.1:5001/api/questions', payload);
      onRefresh(); // Refresh the list in QuestionBank.js
      onClose();   // Close the modal
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Add New Question</h2>
        <hr />
        
        <label>Category</label>
        <input style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} />

        <label>Question Type</label>
        <select style={inputStyle} value={qType} onChange={e => setQType(e.target.value)}>
          <option value="MCQ">Multiple Choice (MCQ)</option>
          <option value="MATCHING">Interactive Matching</option>
        </select>

        <label>Question Statement</label>
        <textarea style={inputStyle} value={statement} onChange={e => setStatement(e.target.value)} />

        {/* Dynamic Fields for MCQ */}
        {qType === 'MCQ' && (
          <div>
            <h4>Options</h4>
            {mcqData.options.map((opt, i) => (
              <input 
                key={i} style={inputStyle} placeholder={`Option ${i+1}`}
                onChange={e => {
                  let newOpts = [...mcqData.options];
                  newOpts[i] = e.target.value;
                  setMcqData({...mcqData, options: newOpts});
                }}
              />
            ))}
            <input style={inputStyle} placeholder="Correct Answer" onChange={e => setMcqData({...mcqData, answer: e.target.value})} />
          </div>
        )}

        {/* Dynamic Fields for Matching would go here similarly */}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={saveButtonStyle}>Save Question</button>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Simple inline styles for the modal
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#121212', padding: '30px', borderRadius: '12px', width: '500px', color: 'white' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', background: '#1a1a1b', border: '1px solid #333', color: 'white', borderRadius: '5px' };
const saveButtonStyle = { flex: 1, padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelButtonStyle = { flex: 1, padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default AddQuestionModal;
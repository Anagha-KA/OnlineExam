import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout'; // Ensure this is imported

const Reports = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5001/api/admin/results')
      .then(res => setResults(res.data))
      .catch(err => console.error("Error loading reports:", err));
  }, []);

  return (
    <AdminLayout>
      <div style={{ padding: '10px' }}>
        <h1 style={{ color: '#fff', marginBottom: '5px' }}>Reports & Analytics</h1>
        <p style={{ color: '#8b8d97', marginBottom: '30px' }}>Monitor student performance and export data</p>
        
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={{ padding: '15px' }}>Student Name</th>
                <th>Exam Title</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} style={bodyRowStyle}>
                  <td style={{ padding: '15px' }}>{r.student_name}</td>
                  <td>{r.exam_title}</td>
                  <td style={{ fontWeight: 'bold', color: r.score >= 50 ? '#28a745' : '#ff4d4d' }}>{r.score}%</td>
                  <td>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      background: r.status === 'Pass' ? 'rgba(40,167,69,0.1)' : 'rgba(255,77,77,0.1)',
                      color: r.status === 'Pass' ? '#28a745' : '#ff4d4d',
                      fontSize: '12px'
                    }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

// Re-using styles for consistency
const tableContainerStyle = { background: '#11121d', borderRadius: '15px', border: '1px solid #1f212e', overflow: 'hidden' };
const headerRowStyle = { borderBottom: '1px solid #1f212e', color: '#8b8d97', textAlign: 'left' };
const bodyRowStyle = { borderBottom: '1px solid #0a0b14' };

export default Reports;
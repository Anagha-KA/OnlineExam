import React, { useState } from 'react';

const MatchingPattern = ({ data, onSelect }) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({}); // Stores { leftId: rightId }

  const handleLeftClick = (id) => setSelectedLeft(id);

  const handleRightClick = (rightId) => {
    if (selectedLeft) {
      const newMatches = { ...matches, [selectedLeft]: rightId };
      setMatches(newMatches);
      onSelect(newMatches); 
      setSelectedLeft(null); 
    }
  };

  const reset = () => {
    setMatches({});
    onSelect({});
    setSelectedLeft(null);
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #1f212e', borderRadius: '12px', backgroundColor: '#11121d' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        
        {/* Column A - Terms */}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 'bold', color: '#8b8d97', fontSize: '14px' }}>Term</p>
          {data.left.map((item) => (
            <div
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              style={{
                padding: '12px', margin: '8px 0', borderRadius: '8px', cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedLeft === item.id ? '#00d1ff' : matches[item.id] ? '#28a745' : '#1f212e',
                backgroundColor: selectedLeft === item.id ? 'rgba(0, 209, 255, 0.1)' : 'transparent',
                color: '#fff'
              }}
            >
              {item.text}
              {matches[item.id] && <span style={{ float: 'right' }}>✅</span>}
            </div>
          ))}
        </div>

        {/* Column B - Definitions */}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 'bold', color: '#8b8d97', fontSize: '14px' }}>Definition</p>
          {data.right.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              style={{
                padding: '12px', margin: '8px 0', borderRadius: '8px', cursor: 'pointer',
                border: '2px solid #1f212e', backgroundColor: 'transparent', color: '#fff',
                opacity: Object.values(matches).includes(item.id) ? 0.4 : 1
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <button onClick={reset} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '13px' }}>
        ↺ Reset Connections
      </button>
    </div>
  );
};

export default MatchingPattern;
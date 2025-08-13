import React from 'react';

const SimpleApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>Invoice Studio Pro - Debug</h1>
      <p>If you can see this, React is working correctly.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', border: '1px solid #ccc' }}>
        <h2>Test Interface</h2>
        <button onClick={() => alert('Button works!')}>Test Button</button>
      </div>
    </div>
  );
};

export default SimpleApp;
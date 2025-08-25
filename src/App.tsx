import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>Tech Processing LLC</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Frontend is working! 🎉
      </p>
      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Build Test Successful</h2>
        <p>If you can see this, the React build is working properly.</p>
        <button 
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => alert('React is working!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;
import React from 'react';

const PortrayalRegister = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Portrayal Register</h2>
            <p style={{ color: '#666', fontSize: '16px', textAlign: 'center', maxWidth: '600px' }}>
                This section is under construction. We are working hard to bring you the best experience. Please check back soon!
            </p>
            <button 
                style={{
                    marginTop: '30px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    color: '#fff',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                onClick={() => window.history.back()}
            >
                Go Back
            </button>
        </div>
    );
};

export default PortrayalRegister;

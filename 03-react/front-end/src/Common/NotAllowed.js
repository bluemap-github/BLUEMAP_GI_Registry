import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const NotAllowed = () => {
    const navigate = useNavigate();
    const regiurl = Cookies.get('REGISTRY_URI');

    const goToHome = () => {
        navigate(`/${regiurl}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#333' }}>Not Allowed</h2>
            <p style={{ color: '#666', fontSize: '16px', textAlign: 'center', maxWidth: '600px' }}>
                You do not have permission to access this feature.
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
                onClick={goToHome}
            >
                Back to Registry
            </button>
        </div>
    );
};

export default NotAllowed;

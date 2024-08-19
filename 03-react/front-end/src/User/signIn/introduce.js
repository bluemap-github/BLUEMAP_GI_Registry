import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../api';
import { useNavigate } from 'react-router-dom';
import { SIGN_IN, SIGN_UP, MY_MAIN, INTRO } from '../../Common/PageLinks';

const Introduce = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const moveToSIGNIN = () => {
        navigate(SIGN_IN);
    };

    const moveToSIGNUP = () => {
        navigate(SIGN_UP);
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        if (token) {
            axios.get(CHECK_AUTH, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                navigate(MY_MAIN);
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.error);
                    if (error.response.status === 401) {
                        navigate(INTRO);
                    }
                } else {
                    setError(error.message);
                }
            });
        } else {
            setError('No token found');
            navigate(INTRO);
        }
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh', backgroundColor: '#f0f4f8' }}>
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>BLUMAP GI Registery</h1>
                <p style={{ marginBottom: '30px', color: '#666', fontSize: '16px' }}>
                    Welcome to BLUMAP GI Registry! Please sign in or sign up to continue.
                </p>
                <div>
                    <button 
                        className='btn btn-outline-secondary'
                        style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px' }}
                        onClick={moveToSIGNIN}
                    >
                        Sign In
                    </button>
                    <button 
                        className='btn btn-outline-info'
                        style={{ padding: '10px 20px', fontSize: '16px' }}
                        onClick={moveToSIGNUP}
                    >
                        Sign Up
                    </button>
                </div>
                {error && (
                    <p style={{ marginTop: '20px', color: 'red' }}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Introduce;

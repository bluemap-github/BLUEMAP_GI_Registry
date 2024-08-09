import React, { useState } from 'react';
import axios from 'axios';
import { SIGN_IN as API_SIGN_IN, SIGN_UP as API_SIGN_UP } from '../api.js';
import { SIGN_IN as PAGE_SIGN_IN, SIGN_UP as PAGE_SIGN_UP, MY_MAIN } from '../../Common/PageLinks';

import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const moveToSIGNUP = () => {
        navigate(PAGE_SIGN_UP);
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(API_SIGN_IN, { email, password });

            if (response.status !== 200) {
                throw new Error('로그인 실패');
            }

            const { token } = response.data;
            localStorage.setItem('jwt', token); // JWT를 로컬 스토리지에 저장
            console.log('로그인 성공');
            alert('로그인 성공');
            navigate(MY_MAIN); // 로그인 후 리디렉션
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#f0f4f8'}}>
            <h1 className='m-5' style={{ color: '#007bff' }}>BLUEMAP GI Registry</h1>
            <div style={{ width: '500px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#007bff' }}>Sign In</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '15px', width: '100%' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Email:</label>
                        <input type="email" id="email" value={email} onChange={handleEmailChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Password:</label>
                        <input type="password" id="password" value={password} onChange={handlePasswordChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Sign In</button>
                </form>
                <div style={{width: '100%'}}>
                    <p style={{ marginTop: '20px', color: '#555' }}>New user?</p>
                    <button 
                        className='btn btn-outline-info'
                        onClick={moveToSIGNUP}
                        style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #007bff', backgroundColor: '#fff', color: '#007bff', cursor: 'pointer' }}
                    >
                        Sign Up
                    </button>
                </div>
                
            </div>
        </div>

    );
};

export default SignIn;

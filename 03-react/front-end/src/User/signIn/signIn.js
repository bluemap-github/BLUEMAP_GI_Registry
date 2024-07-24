import React, { useState } from 'react';
import axios from 'axios';
import { SIGN_IN } from '../api.js';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            const response = await axios.post(SIGN_IN, { email, password });

            if (response.status !== 200) {
                throw new Error('로그인 실패');
            }

            const { token } = response.data;
            localStorage.setItem('jwt', token); // JWT를 로컬 스토리지에 저장
            console.log('로그인 성공');
            alert('로그인 성공');
            navigate('/user/mymain'); // 로그인 후 리디렉션
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw'}}>
            <h1>BLUEMAP GI Registry</h1>
            <div style={{ width: '500px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#81DAF5' }}>Sign In</h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                        <input type="email" id="email" value={email} onChange={handleEmailChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                        <input type="password" id="password" value={password} onChange={handlePasswordChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#81DAF5', color: 'white', fontSize: '16px', cursor: 'pointer' }}>Sign In</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>New user?</p>
                <button 
                    className='btn btn-outline-info'
                    onClick={() => { window.location.href = '/user/signup' }}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #81DAF5', backgroundColor: 'white', color: '#81DAF5', fontSize: '16px', cursor: 'pointer' }}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default SignIn;

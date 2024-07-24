import React, { useState } from 'react';
import axios from 'axios';
import {CHECK_EMAIL, SIGN_UP} from '../api.js';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailChecked(false);  // 이메일이 변경될 때 중복 검사 상태를 초기화
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (confirmPassword && e.target.value !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (password && e.target.value !== password) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    };

    const checkEmailExists = async () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (email) {
            if (!emailPattern.test(email)) {
                setEmailError('Invalid email format');
                setEmailChecked(false);
                return;
            }
    
            try {
                const response = await axios.post(CHECK_EMAIL, { email });
                if (response.data.exists) {
                    setEmailError('Email already exists');
                    setEmailChecked(false);
                } else {
                    setEmailError('Email is available');
                    setEmailChecked(true);  // 이메일 중복 검사 성공 시 상태 업데이트
                }
            } catch (err) {
                console.error('Error checking email', err);
                setEmailError('Error checking email');
                setEmailChecked(false);
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailChecked) {
            setError('Please check email availability');
            return;
        }
    
        try {
            const response = await axios.post(SIGN_UP, {
                email,
                password,
                name: e.target.name.value,
            });
            // 회원가입 성공 시 알림 창 띄우기
            alert('Sign up successful! Please log in.');
            // 회원가입 성공 시 리디렉션
            navigate('/user/signin');
        } catch (err) {
            console.error('Error signing up:', err);
            setError('Sign up failed');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <h1>BLUEMAP GI Registry</h1>
            <div style={{ width: '500px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#BCA9F5' }}>Sign Up</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                        <input type="text" id="name" name="name" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email address:</label>
                            <input type="email" id="email" name="email" required disabled={emailChecked} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} value={email} onChange={handleEmailChange} />
                        </div>
                        <button type="button" onClick={checkEmailExists} disabled={emailChecked} style={{ marginLeft: '10px', padding: '8px 12px', borderRadius: '5px', border: '1px solid #BCA9F5', backgroundColor: '#BCA9F5', color: 'white', cursor: 'pointer', height: '40px', alignSelf: 'flex-end' }}>
                            {emailChecked ? 'Checked' : 'Check'}
                        </button>
                    </div>
                    {emailError && <p style={{ color: emailError === 'Email already exists' ? 'red' : 'green', textAlign: 'center' }}>{emailError}</p>}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                        <input type="password" id="password" name="password" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} value={password} onChange={handlePasswordChange} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="confirmpassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
                        <input type="password" id="confirmpassword" name="confirmpassword" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#BCA9F5', color: 'white', fontSize: '16px', cursor: 'pointer' }}>Sign Up</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Already have an account?</p>
                <button 
                    className='btn btn-outline-info'
                    onClick={() => { window.location.href = '/user/signin' }}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #BCA9F5', backgroundColor: 'white', color: '#BCA9F5', fontSize: '16px', cursor: 'pointer' }}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default SignUp;

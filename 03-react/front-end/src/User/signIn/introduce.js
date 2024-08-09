import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../api';
import { useNavigate } from 'react-router-dom';
import {SIGN_IN, SIGN_UP, MY_MAIN, INTRO} from '../../Common/PageLinks';

const Introduce = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const moveToSIGNIN = () => {
        navigate(SIGN_IN);
    }
    const moveToSIGNUP = () => {
        navigate(SIGN_UP);
    }
    useEffect(() => {
        // 로컬 스토리지에서 JWT 토큰을 가져오기
        const token = localStorage.getItem('jwt');

        if (token) {
            // 사용자 정보를 가져오기 위해 API 요청 보내기
            axios.get(CHECK_AUTH, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                navigate(MY_MAIN)
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
            navigate(INTRO); // 토큰이 없을 경우 로그인 페이지로 리디렉션
        }
    }, [navigate]);

    return (
        <div className="container p-5" style={{textAlign: "center"}}>
            <h1>BLUMAP GI Registery</h1>
            <div>
                <button 
                    className='btn btn-outline-secondary'
                    onClick={moveToSIGNIN}
                    >signIn</button>
                <button 
                    className='btn btn-outline-info'
                    onClick={moveToSIGNUP}
                    >signUp</button>
            </div>
            
        </div>
    );
};

export default Introduce;
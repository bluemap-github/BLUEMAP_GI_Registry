import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../api';
import { useNavigate } from 'react-router-dom';


const Introduce = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                navigate('/user/mymain')
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.error);
                    if (error.response.status === 401) {
                        navigate('/'); 
                    }
                } else {
                    setError(error.message);
                }
            });
        } else {
            setError('No token found');
            navigate('/'); // 토큰이 없을 경우 로그인 페이지로 리디렉션
        }
    }, [navigate]);

    return (
        <div className="container p-5" style={{textAlign: "center"}}>
            <h1>BLUMAP GI Registery</h1>
            <div>
                <button 
                    className='btn btn-outline-secondary'
                    onClick={() => {window.location.href = '/user/signin'}}
                    >signIn</button>
                <button 
                    className='btn btn-outline-info'
                    onClick={() => {window.location.href = '/user/signup'}}
                    >signUp</button>
            </div>
            
        </div>
    );
};

export default Introduce;
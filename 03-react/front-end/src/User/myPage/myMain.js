import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../api';
import { useNavigate } from 'react-router-dom';

function MyMain() {
    const [userInfo, setUserInfo] = useState(null);
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
                setUserInfo(response.data.user);
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.error);
                    if (error.response.status === 401) {
                        navigate('/login');
                    }
                } else {
                    setError(error.message);
                }
            });
        } else {
            setError('No token found');
            navigate('/user/signin'); // 토큰이 없을 경우 로그인 페이지로 리디렉션
        }
    }, [navigate]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <h5>내가지금 접속하고잇는 레지스터들!!</h5>
                <div style={{backgroundColor: 'skyblue'}}>
                    <h6>내가 관리자인거</h6>
                    {}
                </div>
            </div>
        </div>
    );
}

export default MyMain;

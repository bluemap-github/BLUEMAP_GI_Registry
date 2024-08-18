import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GET_REGI_INFO_FOR_GUEST } from '../User/api';
import { RERI_HOME, test_home, SIGN_IN } from '../Common/PageLinks';

const EnterRegi = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            sessionStorage.removeItem('REGISTRY_URI');  // 세션 스토리지에서 기존 데이터 제거
            const regi_uri = location.pathname.slice(1);
            const headers = {};
            const token = localStorage.getItem('jwt'); 
            if (token) {headers['Authorization'] = `Bearer ${token}`;}
            
            try {
                const response = await axios.get(GET_REGI_INFO_FOR_GUEST, {
                    headers: headers,
                    params: { regi_uri: regi_uri }
                });

                sessionStorage.setItem('REGISTRY_URI', regi_uri);

                // 여기서 JWT 토큰을 세션 스토리지에 저장 (예: 로그인 시 얻은 JWT를 저장)
                sessionStorage.setItem('jwt', response.data.token);
                console.log(response.data);
                // 사용자가 owner인지 guest인지에 따라 접근 허용
                if (response.data.role === 'owner' || response.data.role === 'guest') {
                    setAuthorized(true);
                    sessionStorage.setItem('role', response.data.role);
                } else {
                    console.log(response.data.role);
                    navigate(SIGN_IN);  // 권한이 없으면 로그인 페이지로 리디렉션
                }
            } catch (error) {
                console.log(error);
                navigate(SIGN_IN);  // 오류가 발생하면 로그인 페이지로 리디렉션
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location, navigate]);

    if (loading) {
        return <div>Loading...</div>;  // 로딩 중에는 로딩 상태 표시
    }

    if (!authorized) {
        return null;  // 권한이 없으면 아무것도 렌더링하지 않음 (리디렉션이 실행됨)
    }

    return children;  // 권한이 확인되면 자식 컴포넌트를 렌더링
};

export default EnterRegi;

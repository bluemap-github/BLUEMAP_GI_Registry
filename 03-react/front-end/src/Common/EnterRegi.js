import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';  // js-cookie 라이브러리 임포트
import { GET_REGI_INFO_FOR_GUEST } from '../User/api';
import { SIGN_IN } from '../Common/PageLinks';

const EnterRegi = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // 쿠키에서 기존 REGISTRY_URI 제거
            Cookies.remove('REGISTRY_URI');
            
            const regi_uri = location.pathname.slice(1);
            const headers = {};
            const token = localStorage.getItem('jwt'); // 쿠키에서 JWT 토큰 가져오기
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            try {
                const response = await axios.get(GET_REGI_INFO_FOR_GUEST, {
                    headers: headers,
                    params: { regi_uri: regi_uri }
                });

                // REGISTRY_URI를 쿠키에 저장
                Cookies.set('REGISTRY_URI', regi_uri); // 쿠키 유효기간 7일로 설정

                // role을 쿠키에 저장
                Cookies.set('role', response.data.role);
                // 사용자가 owner인지 guest인지에 따라 접근 허용
                if (response.data.role === 'owner' || response.data.role === 'guest') {
                    setAuthorized(true);
                } else {
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CHECK_AUTH } from '../User/api';
import FullScreenLoadingSpinner from './FullScreenLoadingSpinner';

function clearAllCookies() {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

const GetUserInfo = ({ children }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    // Set role to 'guest' if no JWT token
                    Cookies.set('role', 'guest');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(CHECK_AUTH, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 200) {
                    setUserInfo(response.data.user);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    if (!isRedirecting) {
                        setIsRedirecting(true);
                        localStorage.removeItem('jwt');
                        sessionStorage.clear();
                        clearAllCookies();
                        alert('시스템 오류로 로그아웃 되었습니다.');
                    }
                    navigate('/login');
                } else {
                    console.error('Unexpected error:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        
        if (!isRedirecting) {
            fetchUserInfo();
        }
    }, [navigate, isRedirecting]);

    if (loading) return <FullScreenLoadingSpinner />;

    return React.Children.map(children, child => 
        React.cloneElement(child, { userInfo })
    );
};

export default GetUserInfo;

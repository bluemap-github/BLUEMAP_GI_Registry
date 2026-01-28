import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GET_REGI_INFO_FOR_GUEST } from '../User/api';
import { SIGN_IN } from '../Common/PageLinks';
import FullScreenLoadingSpinner from './FullScreenLoadingSpinner';
import { setEncryptedItem } from "../cryptoComponent/storageUtils";

const EnterRegi = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            Cookies.remove('REGISTRY_URI'); // Clear previous REGISTRY_URI cookie
            const regi_uri = location.pathname.slice(1);
            
            const headers = {};
            const token = localStorage.getItem('jwt'); // Get JWT token from local storage

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                // 토큰이 없을 경우 role을 'guest'로 설정하고 authorized를 true로 설정
                setEncryptedItem('REGISTRY_URI', regi_uri);
                setEncryptedItem('role', 'guest');
                setAuthorized(true);
                setLoading(false);
                return; // 서버 요청을 건너뜀
            }
            
            try {
                const response = await axios.get(GET_REGI_INFO_FOR_GUEST, {
                    headers: headers,
                    params: { regi_uri: regi_uri }
                });

                setEncryptedItem('REGISTRY_URI', regi_uri);
                setEncryptedItem('role', response.data.role);

                // Check if user is authorized
                if (response.data.role === 'owner' || response.data.role === 'guest') {
                    setAuthorized(true);
                } else {
                    navigate(SIGN_IN);
                }
            } catch (error) {
                console.log(error);
                navigate(SIGN_IN);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location, navigate]);

    if (loading) {
        return <FullScreenLoadingSpinner />;
    }

    if (!authorized) {
        return null;
    }

    return children;
};

export default EnterRegi;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {CHECK_AUTH} from '../User/api';

const GetUserInfo = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(CHECK_AUTH, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setUserInfo(response.data.user);
                } else {
                    throw new Error('Failed to fetch user info');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // 사용자 정보를 모든 자식 컴포넌트에 prop으로 전달
    return React.Children.map(children, child => {
        return React.cloneElement(child, { userInfo });
    });
};

export default GetUserInfo;

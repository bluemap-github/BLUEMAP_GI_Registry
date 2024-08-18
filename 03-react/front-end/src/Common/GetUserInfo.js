import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../User/api';

const GetUserInfo = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    // 토큰이 없으면 바로 로딩 종료
                    setLoading(false);
                    return;
                }

                const response = await axios.get(CHECK_AUTH, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    setUserInfo(response.data.user);
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // userInfo가 없더라도 자식 컴포넌트를 렌더링하도록 함
    return React.Children.map(children, child => {
        return React.cloneElement(child, { userInfo });
    });
};

export default GetUserInfo;

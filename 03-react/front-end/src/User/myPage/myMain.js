import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../api';
import { useNavigate } from 'react-router-dom';
import { getOwnRegistries } from './GetRegistery';

function MyMain() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [ownRegistries, setOwnRegistries] = useState([]);
    const [guestRegistries, setGuestRegistries] = useState([]);

    const handleCreateRegi = () => {navigate('/user/create-registry')};

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

        const fetchData = async () => {
            try {
                const result = await getOwnRegistries("owner");
                setOwnRegistries(result);
                console.log(result);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, [navigate]);

    const connectToRegistry = (e, registry) => {
        const registryName = registry.name;
        console.log(registryName);
        sessionStorage.setItem('USER_SERIAL', registry._id); // 세션 스토리지에 저장
        navigate('/concept/list/', { state: { serial: registry._id } });
    };
    

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
                    {ownRegistries.length === 0 ? (
                        <>
                            <p>아직 등록한 레지스트리가 없습니다.</p>
                            <button onClick={handleCreateRegi}>만들기</button>
                        </>
                    ) : (
                        <ul>
                            {ownRegistries.map((registry) => (
                                <li key={registry._id} onClick={(e) => connectToRegistry(e, registry)}>
                                    {registry.name}
                                </li>    
                            ))}
                        </ul>
                    )}
                </div>
                <div style={{backgroundColor: 'pink'}}>
                    <h6>guest로 접속하고잇는거</h6>
                    {/* Guest registry list */}
                </div>
            </div>
        </div>
    );
}

export default MyMain;

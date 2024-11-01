import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { CHECK_AUTH } from '../api';
import { getOwnRegistries } from './GetRegistery';
import { SIGN_IN, CREATE_REGI, ENTER_REGI } from '../../Common/PageLinks';
import MyMainDropDown from './myMainDropDown';
import FullScreenLoadingSpinner from '../../Common/FullScreenLoadingSpinner';

function MyMain() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [ownRegistries, setOwnRegistries] = useState([]);
    const [dropdownRegistryId, setDropdownRegistryId] = useState(null); // State to track open dropdown

    const handleCreateRegi = () => { navigate(CREATE_REGI) };

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        if (token) {
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
                        navigate(SIGN_IN);
                    }
                } else {
                    setError(error.message);
                }
            });
        } else {
            setError('No token found');
            navigate(SIGN_IN);
        }

        const fetchData = async () => {
            try {
                const result = await getOwnRegistries("owner");
                setOwnRegistries(result);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchData();
    }, [navigate]);

    const connectToRegistry = (e, registry) => {
        Cookies.set('REGISTRY_URI', registry.uniformResourceIdentifier, { expires: 7 });
        Cookies.set('REGISTRY_NAME', registry.name, { expires: 7 });
        
        // 이동 후 상태 변경 또는 재랜더링 확인
        navigate(ENTER_REGI(registry.uniformResourceIdentifier));
        setDropdownRegistryId(null); // 드롭다운 닫기
    };
    

    const connectToSetting = (e, registry) => {
        Cookies.set('REGISTRY_URI', registry.uniformResourceIdentifier, { expires: 7 });
        navigate('/user/setting-registry');
    };

    const handleRegistryPopUp = (e, registryId) => {
        e.stopPropagation();
        setDropdownRegistryId(dropdownRegistryId === registryId ? null : registryId); // Toggle dropdown for clicked registry
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userInfo) {
        return <FullScreenLoadingSpinner />;
    }

    return (
        <div>
            <div style={{ backgroundColor: '#F8F8F8'}} className='p-3'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} className='mb-3'>
                    <div style={{display: 'flex'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.5em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M4 4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h8v-2H4V8h16v4h2V8a2 2 0 0 0-2-2h-8l-2-2m8 10a.26.26 0 0 0-.26.21l-.19 1.32c-.3.13-.59.29-.85.47l-1.24-.5c-.11 0-.24 0-.31.13l-1 1.73c-.06.11-.04.24.06.32l1.06.82a4.2 4.2 0 0 0 0 1l-1.06.82a.26.26 0 0 0-.06.32l1 1.73c.06.13.19.13.31.13l1.24-.5c.26.18.54.35.85.47l.19 1.32c.02.12.12.21.26.21h2c.11 0 .22-.09.24-.21l.19-1.32c.3-.13.57-.29.84-.47l1.23.5c.13 0 .26 0 .33-.13l1-1.73a.26.26 0 0 0-.06-.32l-1.07-.82c.02-.17.04-.33.04-.5s-.01-.33-.04-.5l1.06-.82a.26.26 0 0 0 .06-.32l-1-1.73c-.06-.13-.19-.13-.32-.13l-1.23.5c-.27-.18-.54-.35-.85-.47l-.19-1.32A.236.236 0 0 0 20 14m-1 3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5c-.84 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5"></path>
                        </svg>
                        <h5 style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>My Registries</h5>
                    </div>
                    <button className='btn btn-outline-secondary btn-sm' onClick={handleCreateRegi} style={{ display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"></path></svg>
                        <div style={{ marginLeft: '8px' }}>
                            Create New Registry
                        </div>
                    </button>
                </div>
                {ownRegistries.length === 0 ? (
                    <p>아직 등록한 레지스트리가 없습니다.</p>
                ) : (
                    <div>
                        {ownRegistries.map((registry) => (
                            <div key={registry._id}>
                                <div className='card regi-card mb-4' style={{position: 'relative'}}>
                                    <div onClick={(e) => handleRegistryPopUp(e, registry._id)} className='regi-card-dots' style={{position: 'absolute', top: '10px', right: '10px', cursor: 'pointer'}}>
                                        <MyMainDropDown
                                            registry={registry}
                                            connectToRegistry={connectToRegistry}
                                            connectToSetting={connectToSetting}
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h4>{registry.name}</h4>
                                        <div>Last updated : {registry.dateOfLastChange}</div>
                                        <div>Description : {registry.contentSummary}</div>
                                        <div 
                                            className='regi-card-dots regi-card-uri-links' 
                                            onClick={(e) => connectToRegistry(e, registry)} 
                                            style={{ color : 'gray', cursor: 'pointer' }}
                                        >
                                            http://bluemap.kr:21804/{registry.uniformResourceIdentifier}
                                        </div>
                                    </div>
                                </div>
                            </div>    
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyMain;

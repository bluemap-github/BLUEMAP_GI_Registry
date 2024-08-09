import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GET_REGI_INFO_FOR_GUEST } from '../User/api';
import { RERI_HOME } from '../Common/PageLinks';

const EnterRegi = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            const regi_uri = location.pathname.slice(1);
            const headers = {};
            const token = localStorage.getItem('jwt');
            if (token) {
                console.log('token:', token);
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                console.log('No token found in localStorage');
            }
            
            try {
                const response = await axios.get(GET_REGI_INFO_FOR_GUEST, {
                    headers: headers,
                    params: {
                        regi_uri: regi_uri
                    }
                });
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [location, navigate]);

    return (
        <div>
            durl?
        </div>
    );
};

export default EnterRegi;

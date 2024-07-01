// src/components/DDRList.js

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트
import axios from 'axios';
import { ItemContext } from '../../context/ItemContext'; // ItemContext 임포트
import { GET_DDR_ITEM_LIST } from './api';
import { USER_SERIAL } from '../../userSerial';

const DDRList = ({ data }) => {
    const [response, setResponse] = useState([]);
    const { setItemDetails } = useContext(ItemContext); // Context에서 setItemDetails 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(GET_DDR_ITEM_LIST, {
                params: {
                    user_serial: USER_SERIAL,
                    item_type: data
                }
            });
            setResponse(result.data);
        };

        fetchData();
    }, [data]);

    const handleDetailClick = (item) => {
        setItemDetails({ 
            view_item_type: data, 
            user_serial: USER_SERIAL, 
            item_id: item._id.encrypted_data,
            item_iv: item._id.iv
        });
        navigate('/dataDictionary');
    };

    return (
        <div>
            {response.length === 0 ? (
                <div>Loading...</div>
            ) : (
                response.register_items.map(item => (
                    <div key={item._id.encrypted_data} style={{border: '1px solid gray'}} className='mt-3'>
                        <div>{item._id.encrypted_data}</div>
                        <div>{item.concept_id.encrypted_data}</div>
                        <div>{item.itemType}</div>
                        <div>{item.name}</div>
                        <div>{item.definition}</div>
                        <button onClick={() => handleDetailClick(item)} className='btn btn-info'>show Detail</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default DDRList;

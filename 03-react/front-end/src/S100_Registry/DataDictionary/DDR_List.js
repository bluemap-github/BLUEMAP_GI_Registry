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
                <table className="table table-hover table-bordered table-striped" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                        <tr>
                            <th scope="col" style={{ width: '15%' }}>Name</th>
                            <th scope="col" style={{ width: '15%' }}>
                                <div className='single-line-ellipsis'>Camel Case</div>
                            </th>
                            <th scope="col" style={{ width: '40%' }}>Definition</th>
                            <th scope="col" style={{ width: '11%' }}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {response.register_items.map((item) => (
                            <tr key={item._id.encrypted_data} style={{ cursor: 'pointer' }}>
                            <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '15%' }}>
                                <div className='single-line-ellipsis'>{item.name}</div>
                            </td>
                            <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '15%' }}>
                                <div className='single-line-ellipsis'>{item.camelCase}</div>
                            </td>
                            <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '40%' }}>
                                <div className='single-line-ellipsis'>{item.definition}</div>
                            </td>
                            <td onClick={() => handleDetailClick(item)} className='th-inner sortable both' style={{ width: '11%' }}>
                                <div className='single-line-ellipsis'>{item.itemStatus}</div> 
                            </td>
                                                           
                            </tr>
                        ))}
                        </tbody>
                    </table>
            )}
            
        </div>

    );
};

export default DDRList;

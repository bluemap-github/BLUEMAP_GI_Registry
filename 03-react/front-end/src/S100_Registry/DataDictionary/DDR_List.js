// src/components/DDRList.js

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ItemContext } from '../../context/ItemContext';
import { GET_DDR_ITEM_LIST } from './api';

const DDRList = ({ viewType }) => {
    const USER_SERIAL = sessionStorage.getItem('USER_SERIAL');
    const [response, setResponse] = useState([]);
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(GET_DDR_ITEM_LIST, {
                    params: {
                        user_serial: USER_SERIAL,
                        item_type: viewType
                    }
                });
                setResponse(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [viewType]);

    const handleDetailClick = (item) => {
        setItemDetails({
            view_item_type: viewType,
            user_serial: USER_SERIAL,
            item_id: item._id.encrypted_data,
            item_iv: item._id.iv
        });
        navigate('/dataDictionary');
    };

    const renderTableCell = (item, field, style) => (
        <td
            onClick={() => handleDetailClick(item)}
            className='th-inner sortable both'
            style={style}
        >
            <div className='single-line-ellipsis'>{item[field]}</div>
        </td>
    );

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
                        {
                            response.register_items.length === 0 &&
                            <tr>
                            <td colSpan="4" className="text-center">No items found</td>
                            </tr>
                        }
                        {response.register_items.map((item) => (
                            <tr key={item._id.encrypted_data} style={{ cursor: 'pointer' }}>
                                {renderTableCell(item, 'name', { width: '15%' })}
                                {renderTableCell(item, 'camelCase', { width: '15%' })}
                                {renderTableCell(item, 'definition', { width: '40%' })}
                                {renderTableCell(item, 'itemStatus', { width: '11%' })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DDRList;



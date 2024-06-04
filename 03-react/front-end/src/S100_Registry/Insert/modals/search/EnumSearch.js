import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_NOT_RELATED_ENUM_LIST_SEARCH } from '../../../DataDictionary/api';
import { USER_SERIAL } from '../../../../userSerial';

const EnumSearch = ({ getResData }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(GET_NOT_RELATED_ENUM_LIST_SEARCH, {
                params: {
                    user_serial: USER_SERIAL,
                    search_term: searchTerm
                }
            });
            getResData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_NOT_RELATED_ENUM_LIST_SEARCH);
                getResData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <p style={{ fontSize: '12px' }}>{GET_NOT_RELATED_ENUM_LIST_SEARCH}</p>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>EnumSearch</button>
        </div>
    );
};

export default EnumSearch;

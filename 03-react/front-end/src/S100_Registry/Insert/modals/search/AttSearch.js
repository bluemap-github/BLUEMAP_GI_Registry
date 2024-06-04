import React, { useState } from 'react';
import axios from 'axios';
import {SUB_ATT_LIST_SEARCH} from '../../../DataDictionary/api.js';
import { USER_SERIAL } from '../../../../userSerial';

function AttSearch({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const handleSearch = () => {
        axios.get(SUB_ATT_LIST_SEARCH, {
            params: {
                user_serial: USER_SERIAL,
                search_term: searchTerm,
                filter_type: filterType,
            }
        })
        .then(response => {
            console.log(response.data); 
            onSearch(response.data);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    return (
        <div>
            <p>{SUB_ATT_LIST_SEARCH}</p>
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search term" 
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All</option>
                <option value="simple">Simple Attributes</option>
                <option value="complex">Complex Attributes</option>
            </select>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default AttSearch;

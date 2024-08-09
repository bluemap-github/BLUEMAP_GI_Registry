import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {SEARCH_RELATED_ITEM} from '../../../DataDictionary/api.js';



function AttSearch({ onSearch }) {
    const regi_uri = sessionStorage.getItem('REGISTRY_URI');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                regi_uri: regi_uri,
                search_term: searchTerm,
                item_type: 'SimpleAttribute'
            }
        })
        .then(response => {
            console.log(response.data); 
            onSearch(response.data.search_result);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div>
            <h3>Connect to Simple Attribute</h3>
            {/* <p>{SEARCH_RELATED_ITEM}</p> */}
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search term" 
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default AttSearch;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {SEARCH_RELATED_ITEM} from '../../../DataDictionary/api.js';
import Cookies from 'js-cookie'; 
import { getDecryptedItem, setEncryptedItem } from "../../../../cryptoComponent/storageUtils";


function AttSearch({ onSearch }) {
    const regi_uri = getDecryptedItem('REGISTRY_URI');
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
            <div className="input-group">
                <input 
                    className="form-control" 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search term" 
                />
                <button className="btn btn-outline-secondary" onClick={handleSearch}>Search</button>
            </div>
            
        </div>
    );
}

export default AttSearch;

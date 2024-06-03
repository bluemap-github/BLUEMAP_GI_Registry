import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SUB_ATT_LIST_SEARCH } from '../../../DataDictionary/api';

// const AttSearch = ({ getResData}) => {
const AttSearch = () => {
    // const [searchTerm, setSearchTerm] = useState('');

    // const handleSearch = async () => {
    //     try {
    //         const response = await axios.get(SUB_ATT_LIST_SEARCH, {
    //             params: {
    //                 search_term: searchTerm
    //             }
    //         });
    //         getResData(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(SUB_ATT_LIST_SEARCH);
    //             getResData(response.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    

    return (
        <div>
            attSearch
            {/* <p style={{ fontSize: '12px' }}>{SUB_ATT_LIST_SEARCH}</p>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button> */}
        </div>
    );
};

export default AttSearch;

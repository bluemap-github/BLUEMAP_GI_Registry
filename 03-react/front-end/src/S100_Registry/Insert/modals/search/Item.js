import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SEARCH_RELATED_ITEM } from '../../../DataDictionary/api.js';
import { USER_SERIAL } from '../../../../userSerial.js';

function Item({ onSearch }) {
    
    useEffect(() => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                user_serial: USER_SERIAL,
                item_type: 'SimpleAttribute,ComplexAttribute'  // 여러 개의 item_type을 배열로 전달
            }
        })
        .then(response => {
            onSearch(response.data.search_result);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

    }, []);

    return (
        <></>
    );
}

export default Item;

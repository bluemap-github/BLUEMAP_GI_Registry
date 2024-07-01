import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SEARCH_RELATED_ITEM } from '../../../DataDictionary/api.js';
import { USER_SERIAL } from '../../../../userSerial.js';

function Item({ onSearch, componentType}) {
    let itemTypes;
    switch (componentType) {
        case 'ComplexAttribute':
            itemTypes = 'SimpleAttribute,ComplexAttribute';
            break;
        case 'Feature':
            itemTypes = 'FeatureType';
            break;
        case 'Information':
            itemTypes = 'InformationType';
            break;
        default:
            break;
    }
    
    useEffect(() => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                user_serial: USER_SERIAL,
                item_type: itemTypes
            }
        })
        .then(response => {
            onSearch(response.data.search_result);
            console.log(response.data);
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

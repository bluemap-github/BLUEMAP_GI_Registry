import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SEARCH_RELATED_ITEM } from '../../../DataDictionary/api.js';
import Cookies from 'js-cookie'; 

function Item({ onSearch, componentType}) {
    let callAPIItemTypes;
    switch (componentType) {
        case 'ComplexAttribute':
            callAPIItemTypes = 'SimpleAttribute,ComplexAttribute';
            break;
        case 'FeatureType':
            callAPIItemTypes = 'FeatureType';
            break;
        case 'InformationType':
            callAPIItemTypes = 'InformationType';
            break;
        default:
            break;
    }
    const regi_uri = Cookies.get('REGISTRY_URI');
    
    useEffect(() => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                regi_uri: regi_uri,
                item_type: callAPIItemTypes
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

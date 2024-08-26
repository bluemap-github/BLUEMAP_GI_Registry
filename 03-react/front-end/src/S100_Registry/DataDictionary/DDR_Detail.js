// src/components/DDRDetail.js

import React, { useContext, useEffect, useState } from 'react';
import { ItemContext } from '../../context/ItemContext'; 
import axios from 'axios';
import { GET_DDR_VALUE_ONE } from './api';
import { useNavigate } from "react-router-dom";
import EVDetail from './components/EVDetail';
import SADetail from './components/SADetail';
import CADetail from './components/CADetail';
import FDetail from './components/FDetail';
import IDetail from './components/IDetail';
import { DDR_LIST } from '../../Common/PageLinks';
import Cookies from 'js-cookie'; 

const componentMap = {
    'EnumeratedValue': EVDetail,
    'SimpleAttribute': SADetail,
    'ComplexAttribute': CADetail,
    'FeatureType': FDetail,
    'InformationType': IDetail
};


const DDR_Detail = () => {
    const { itemDetails } = useContext(ItemContext); 
    const { view_item_type, item_id, item_iv, user_serial } = itemDetails;
    const [item, setItem] = useState(null);
    const navigate = useNavigate();
    const moveToPage = () => {
        navigate(`/${Cookies.get('REGISTRY_URI')}/dataDictionary/list`);
    }
    useEffect(() => {
        const fetchItemList = async () => {
            try {
                const response = await axios.get(GET_DDR_VALUE_ONE, {
                    params: {
                        item_id: item_id,
                        item_type: view_item_type,
                        item_iv: item_iv
                    }
                });
                setItem(response.data);
            } catch (error) {
                console.error('Error fetching item list:', error);
            }
        };

        fetchItemList();
    }, [view_item_type, item_id, item_iv]);

    if (!item) {
        return <div>Loading...</div>;
    }

    const DetailComponent = componentMap[view_item_type] || null;

    return (
        <div className='p-5'>
            <div style={{border: "1px solid gray", borderRadius: "10px", width: "85%"}}>
                {DetailComponent ? <DetailComponent item={item} /> : null}
            </div>
            
            <button onClick={moveToPage} className='btn btn-primary mt-3'>Back to List</button>
        </div>
    );
};

export default DDR_Detail;

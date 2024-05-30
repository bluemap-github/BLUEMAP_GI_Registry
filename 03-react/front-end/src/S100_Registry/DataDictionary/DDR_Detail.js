import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ITEM_DETAIL_URL } from '../Concept/api';
import axios from 'axios';

const DDR_Detail = () => {
    const { item_id } = useParams();
    const [item, setItem] = useState(null);
    const fetchItemList = async () => {
        try {
            const response = await axios.get(`${ITEM_DETAIL_URL}${item_id}/`);
            setItem(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching item list:', error);
        }
    }
    useEffect(() => {
        fetchItemList();
    }, []);

    if (!item) {
        return <div>Loading...</div>; 
    }
    return (
        <div className='container p-5'>
            {item_id}
            <h1>DDR_Detail</h1>
            <div className='card p-3'>
                <div>{item.item.name}</div>
                <h3>{item.item.itemType}</h3>
                <div className='p-2' style={{backgroundColor : 'yellow'}}>
                    <div style={{ fontWeight: 'bold' }}>related value</div>
                    <div>곧 생길거야 ~</div>
                </div>
                
            </div>
            <button onClick={() => window.location=`/dataDictionary/${item_id}`}>Back</button>
        </div>
    );
};

export default DDR_Detail;
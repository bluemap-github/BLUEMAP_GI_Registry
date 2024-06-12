// src/components/DDRDetail.js

import React, { useContext, useEffect, useState } from 'react';
import { ItemContext } from '../../context/ItemContext'; // ItemContext 임포트
import axios from 'axios';
import { GET_DDR_VALUE_ONE } from './api';
import EVDetail from './components/EVDetail';
import SADetail from './components/SADetail';
import CADetail from './components/CADetail';
import FDetail from './components/FDetail';
import IDetail from './components/IDetail';



const DDR_Detail = () => {
    const { itemDetails } = useContext(ItemContext); // Context에서 itemDetails 가져오기
    const { view_item_type, item_id, item_iv } = itemDetails;
    const [item, setItem] = useState(null);
    let dataListComponent;
    switch (view_item_type) {
        case 'EnumeratedValue':
          dataListComponent = <EVDetail item={item}/>;
          break;
        case 'SimpleAttribute':
          dataListComponent = <SADetail item={item}/>;
          break;
        case 'ComplexAttribute':
            dataListComponent = <CADetail item={item}/>;
            break;
        case 'Feature':
            dataListComponent = <FDetail item={item}/>;
            break;
        case 'Information':
            dataListComponent = <IDetail item={item}/>;
            break;

        default:
          dataListComponent = null;
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

    return (
        <div className='container p-5'>
            <h1>DDR_Detail {view_item_type}</h1>
            <div className='card p-3'>
                <div>{item.name}</div>
                <h3>{item.itemType}</h3>
                {dataListComponent}
                <div className='p-2' style={{ backgroundColor: 'yellow' }}>
                    <div style={{ fontWeight: 'bold' }}>related value</div>
                    <div>곧 생길거야 ~</div>
                </div>
                <div>
                    <button onClick={() => window.location = `/concept/detail/`}>concept data</button>
                </div>
            </div>
            <button onClick={() => window.location = `/dataDictionary`}>Back to List</button>
        </div>
    );
};

export default DDR_Detail;

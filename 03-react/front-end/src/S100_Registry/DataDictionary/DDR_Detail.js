import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ITEM_DETAIL_URL } from '../Concept/api';
import { GET_DDR_VALUE_ONE } from './api';
import axios from 'axios';
import { USER_SERIAL } from '../../userSerial';
import EVDetail from './components/EVDetail';
import SADetail from './components/SADetail';
import CADetail from './components/CADetail';
import FDetail from './components/FDetail';
import IDetail from './components/IDetail';

const DDR_Detail = () => {
    const { item_id, view_item_type } = useParams();
    const [item, setItem] = useState(null);

    let dataListComponent;
    switch (view_item_type) {
        case 'enumerated_value_one':
          dataListComponent = <EVDetail item={item}/>;
          break;
        case 'simple_attribute_one':
          dataListComponent = <SADetail item={item}/>;
          break;
        case 'complex_attribute_one':
            dataListComponent = <CADetail item={item}/>;
            break;
        case 'feature_one':
            dataListComponent = <FDetail item={item}/>;
            break;
        case 'information_one':
            dataListComponent = <IDetail item={item}/>;
            break;

        default:
          dataListComponent = null;
      }
      

    useEffect(() => {
        const fetchItemList = async () => {
            try {
                const response = await axios.get(GET_DDR_VALUE_ONE(view_item_type), {
                    params: {
                        item_id: item_id
                    }
                });
                setItem(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching item list:', error);
            }
        };
        

        fetchItemList();
    }, [view_item_type, item_id]);

    if (!item) {
        return <div>Loading...</div>;
    }
    return (
        <div className='container p-5'>
            {item_id}
            <h1>DDR_Detail {view_item_type}</h1>
            <p>{GET_DDR_VALUE_ONE(view_item_type, item_id)}</p>
            <div className='card p-3'>
                <div>{item.name}</div>
                <h3>{item.itemType}</h3>
                {dataListComponent}
                <div className='p-2' style={{ backgroundColor: 'yellow' }}>
                    <div style={{ fontWeight: 'bold' }}>related value</div>
                    <div>곧 생길거야 ~</div>
                </div>
                <div>
                    <button onClick={() => (window.location = `/concept/detail/`)}>
                        concept data
                    </button>
                </div>
            </div>
            <button onClick={() => (window.location = `/dataDictionary/${item_id}`)}>Back to List</button>
        </div>
    );
};

export default DDR_Detail;

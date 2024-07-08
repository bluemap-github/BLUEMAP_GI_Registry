import React, { useState, useContext } from 'react';
import DDR_Filter from './Filter/DDR_Filter';
import DDR_List from './DDR_List';
import DDR_Choose from './DDR_Choose';
import { ItemContext } from '../../context/ItemContext';

function DataDictionaryRegister() {
    const { itemDetails } = useContext(ItemContext); 
    // const { view_item_type } = itemDetails;
    const [viewType, setViewType] = useState("EnumeratedValue");
    const clickHandler = (num) => {
        setViewType(num);
    }
    return (
        <div className="container p-5">
            <h1>Data Dictionary List</h1>
            <p className='mt-5'>Choose the type of data you want to see.</p>
            
            <div className="btn-group btn-group-toggle">
                <DDR_Choose clickHandler={clickHandler} viewType={viewType}/>
            </div>
            <div>
                <DDR_Filter data={viewType}/>
            </div>
            <div>
                <DDR_List viewType={viewType}/>
            </div>
        </div>
    );
}

export default DataDictionaryRegister;
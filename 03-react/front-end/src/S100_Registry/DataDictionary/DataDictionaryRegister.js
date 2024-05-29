import React, { useState } from 'react';
import EV_Filter from './EnumeratedValue/EV_Filter';
import DDR_List from './DDR_List';

function DataDictionaryRegister() {
    const [viewNumber, setViewNumber] = useState(1);
    const clickHandler = (num) => {
        setViewNumber(num);
    }
    return (
        <div className="container p-5">
            <div className="button-container">
                <button className="spacing" onClick={() => clickHandler(1)}>Enumerated Values</button>
                <button className="spacing" onClick={() => clickHandler(2)}>Simple Attributes</button>
                <button className="spacing" onClick={() => clickHandler(3)}>Complex Attributes</button>
                <button className="spacing" onClick={() => clickHandler(4)}>Features</button>
                <button className="spacing" onClick={() => clickHandler(5)}>Informations</button>
            </div>
            <div>
                <EV_Filter/>
            </div>
            <div>
                <DDR_List data={viewNumber}/>
            </div>
        </div>
    );
}

export default DataDictionaryRegister;
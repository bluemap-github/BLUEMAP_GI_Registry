import React, { useState } from 'react';
import EVFilter from './Filter/EVFilter';
import DDR_List from './DDR_List';

function DataDictionaryRegister() {
    const [viewNumber, setViewNumber] = useState("EnumeratedValue");
    const clickHandler = (num) => {
        setViewNumber(num);
    }
    return (
        <div className="container p-5">
            <div className="button-container">
                <button className="spacing" onClick={() => clickHandler("EnumeratedValue")}>Enumerated Values</button>
                <button className="spacing" onClick={() => clickHandler("SimpleAttribute")}>Simple Attributes</button>
                <button className="spacing" onClick={() => clickHandler("ComplexAttribute")}>Complex Attributes</button>
                <button className="spacing" onClick={() => clickHandler("Feature")}>Features</button>
                <button className="spacing" onClick={() => clickHandler("Information")}>Informations</button>
            </div>
            <div>
                <EVFilter data={viewNumber}/>
            </div>
            <div>
                <DDR_List data={viewNumber}/>
            </div>
        </div>
    );
}

export default DataDictionaryRegister;
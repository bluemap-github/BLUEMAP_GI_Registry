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
            <h1>Data Dictionary List</h1>
            <p className='mt-5'>Choose the type of data you want to see.</p>
            <div className="btn-group btn-group-toggle">
                <button className="spacing btn btn-outline-primary" onClick={() => clickHandler("EnumeratedValue")}>Enumerated Values</button>
                <button className="spacing btn btn-outline-primary" onClick={() => clickHandler("SimpleAttribute")}>Simple Attributes</button>
                <button className="spacing btn btn-outline-primary" onClick={() => clickHandler("ComplexAttribute")}>Complex Attributes</button>
                <button className="spacing btn btn-outline-primary" onClick={() => clickHandler("Feature")}>Features</button>
                <button className="spacing btn btn-outline-primary" onClick={() => clickHandler("Information")}>Informations</button>
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
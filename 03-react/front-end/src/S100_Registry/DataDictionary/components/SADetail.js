import React from 'react';
import { USER_SERIAL } from '../../../userSerial';

const SADetail = ({item}) => {
    // Add your component logic here

    return (
        <div>
            <p>{item.valueType}</p>
            <p>{item.quantitySpecification}</p>
            <div style={{backgroundColor : "pink"}}>
                <div>related value list</div>
                {item.listedValue.map((value, index) => (
                    <p 
                        style={{color : "red"}} 
                        key={index}
                        onClick={() => (window.location = `/dataDictionary/enumerated_value_one/${USER_SERIAL}/${value}`)}
                    >
                        {value}</p>
                ))}
            </div>
        </div>
    );
};

export default SADetail;
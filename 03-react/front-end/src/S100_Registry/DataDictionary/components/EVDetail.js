import React from 'react';
import { USER_SERIAL } from '../../../userSerial';

const EVDetail = ({item}) => {
    // Add your component logic here

    return (
        <div>
            <div>Numeric Code : {item.numericCode}</div>
            <p>Ttem Type : {item.enumType}</p>
            <p 
                    style={{backgroundColor : "skyblue"}} 
                    onClick={() => (window.location = `/dataDictionary/simple_attribute_one/${USER_SERIAL}/${item.attributeId}`)}
                >
                    {item.attributeId}</p>
        </div>
    );
};

export default EVDetail;
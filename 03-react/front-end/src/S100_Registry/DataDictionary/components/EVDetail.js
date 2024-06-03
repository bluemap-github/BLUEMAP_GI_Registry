import React from 'react';
import { USER_SERIAL } from '../../../userSerial';

const EVDetail = ({item}) => {
    // Add your component logic here

    return (
        <div>
            <p>{item.numericCode}</p>
            <p>{item.enumType}</p>
            <p 
                    style={{backgroundColor : "skyblue"}} 
                    onClick={() => (window.location = `/dataDictionary/simple_attribute_one/${USER_SERIAL}/${item.associated_arrtibute_id}`)}
                >
                    {item.associated_arrtibute_id}</p>
        </div>
    );
};

export default EVDetail;
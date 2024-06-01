import React from 'react';
import { USER_SERIAL } from '../../../userSerial';

const SADetail = ({item}) => {
    // Add your component logic here

    return (
        <div>
            <p>{item.valueType}</p>
            <p>{item.quantitySpecification}</p>
            {item.related_enumeration_value_id_list.map((value, index) => (
                <p 
                    style={{backgroundColor : "skyblue"}} 
                    key={index}
                    onClick={() => (window.location = `/dataDictionary/enumerated_value_one/${USER_SERIAL}/${value}`)}
                    // onClick 이부분은 나중에 수정해야함
                >
                    {value}</p>
            ))}
        </div>
    );
};

export default SADetail;
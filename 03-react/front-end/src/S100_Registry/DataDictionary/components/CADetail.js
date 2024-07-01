import React from 'react';

const CADetail = ({item}) => {
    return (
        <div>
            <p>{item.valueType}</p>
            <p>{item.quantitySpecification}</p>
            <div style={{backgroundColor : "pink"}}>
                <div>related value list</div>
                {item.subAttribute.map((value, index) => (
                    <p 
                        style={{color : "red"}} 
                        key={index}
                    >
                        {value}</p>
                ))}
            </div>
        </div>
    );
};

export default CADetail;
import React from 'react';

const ChooseType = ({ getSelestedApi }) => {
    
    const handleChange = (event) => {
        getSelestedApi(event.target.value);
    };

    return (
        <div>
            <label htmlFor="typeSelect"></label>
            <select id="typeSelect" onChange={handleChange}>
                <option value="Concept Item">Concept Item</option>
                <option value="Enumerated value">Enumerated value</option>
                <option value="Simple Attribute">Simple Attribute</option>
                <option value="Complex Attribute">Complex Attribute</option>
                <option value="Feature">Feature</option>
                <option value="Information">Information</option>
            </select>
        </div>
    );
};

export default ChooseType;

import React from 'react';

const ChooseType = ({ getSelestedApi }) => {
    
    const handleChange = (event) => {
        getSelestedApi(event.target.value);
    };

    return (
        <div className='input-group' style={{width: "12%"}}>
            {/* <label htmlFor="typeSelect"></label> */}
            <select className='form-select' id="typeSelect" onChange={handleChange}>
                <option value="ConceptItem">Concept Item</option>
                <option value="EnumeratedValue">Enumerated value</option>
                <option value="SimpleAttribute">Simple Attribute</option>
                <option value="ComplexAttribute">Complex Attribute</option>
                <option value="Feature">Feature</option>
                <option value="Information">Information</option>
            </select>
        </div>
    );
};

export default ChooseType;

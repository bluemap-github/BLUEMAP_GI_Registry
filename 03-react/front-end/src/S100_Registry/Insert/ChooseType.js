import React from 'react';

const ChooseType = ({ initial, getSelestedApi }) => {
    
    const handleChange = (event) => {
        getSelestedApi(event.target.value);
    };

    return (
        <div className='input-group' style={{width: "40%"}}>
            {/* <label htmlFor="typeSelect"></label> */}
            <select className='form-select' id="typeSelect" onChange={handleChange} value={initial}>
                <option value="ConceptItem" >Concept Item</option>
                <option value="EnumeratedValue">Enumerated value</option>
                <option value="SimpleAttribute">Simple Attribute</option>
                <option value="ComplexAttribute">Complex Attribute</option>
                <option value="FeatureType">Feature</option>
                <option value="InformationType">Information</option>
            </select>
        </div>
    );
};

export default ChooseType;

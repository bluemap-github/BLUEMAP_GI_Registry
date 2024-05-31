import React from 'react';
const ChooseType = ({getSelestedApi}) => {
    
    const setEnum = () => {getSelestedApi("Enumerated value");};
    const setSimple = () => {getSelestedApi("Simple Attribute");};
    const setComplex = () => {getSelestedApi("Complex Attribute");};
    const setFeature = () => {getSelestedApi("Feature");};
    const setInformation = () => {getSelestedApi("Information");};

    return (
        <div>
            <button onClick={setEnum}>Enumerated value</button>
            <button onClick={setSimple}>Simple Attribute</button>
            <button onClick={setComplex}>Complex Attribute</button>
            <button onClick={setFeature}>Feature</button>
            <button onClick={setInformation}>Information</button>
        </div>
    );
};

export default ChooseType;

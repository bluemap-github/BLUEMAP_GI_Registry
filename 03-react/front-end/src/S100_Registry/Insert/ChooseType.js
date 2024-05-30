import React from 'react';
const ChooseType = ({getSelestedApi}) => {
    const setEnum = () => {
        getSelestedApi("Enumerated value");
    };

    const setSimple = () => {
        getSelestedApi("Simple Attribute");
    };

    return (
        <div>
            <button onClick={setEnum}>Enumerated value</button>
            <button onClick={setSimple}>Simple Attribute</button>
        </div>
    );
};

export default ChooseType;

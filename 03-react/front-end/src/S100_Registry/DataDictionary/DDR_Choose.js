import React from 'react';

const buttonTypes = [
    { type: 'EnumeratedValue', label: 'Enumerated Values' },
    { type: 'SimpleAttribute', label: 'Simple Attributes' },
    { type: 'ComplexAttribute', label: 'Complex Attributes' },
    { type: 'FeatureType', label: 'Features' },
    { type: 'InformationType', label: 'Informations' }
];

const DDRChoose = ({ clickHandler, viewType }) => {
    return (
        <>
            {buttonTypes.map((btn) => (
                <button
                    key={btn.type}
                    className={`btn btn-outline-primary ${viewType === btn.type ? 'active' : ''}`}
                    onClick={() => clickHandler(btn.type)}
                >
                    {btn.label}
                </button>
            ))}
        </>
    );
};

export default DDRChoose;

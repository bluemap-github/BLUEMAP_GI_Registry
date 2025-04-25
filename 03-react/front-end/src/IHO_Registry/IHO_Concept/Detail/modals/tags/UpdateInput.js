import React from 'react';

const UpdateInput = ({ ItemChange, itemValue, name, spanName, type, inputType, options = [], readOnly }) => {
    return (
        <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>{spanName}</span>
            {inputType === 'select' ? (
                <select
                    className="form-select"
                    name={name}
                    value={itemValue || ''}
                    onChange={ItemChange}
                    disabled={readOnly}
                >
                    {options.map((option, idx) => (
                        <option key={idx} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={itemValue || ''}
                    className="form-control"
                    placeholder={name}
                    name={name}
                    onChange={ItemChange}
                    readOnly={readOnly}
                />
            )}
        </div>
    );
};

export default UpdateInput;

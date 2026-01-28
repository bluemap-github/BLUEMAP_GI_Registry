import React, { useState } from 'react';

const BooleanTag = ({ optionName, onFormsubmit }) => {
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);    
        onFormsubmit(optionName, isChecked);  // Pass both key (optionName) and the boolean value
    }

    return (
        <div className="input-group input-group-sm mb-2">
            <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                {optionName}
            </span>
            <div className="input-group-text" style={{ width: '60%' }}>
                <input
                    style={{ marginLeft: '5px' }}
                    onChange={handleChange}  // Use onChange instead of onClick
                    className="form-check-input mt-0"
                    type="checkbox"
                    checked={checked}  // Control the checked state
                    aria-label="Checkbox for following text input"
                />
                <label style={{ marginLeft: '20px' }} className="form-check-label">
                    {checked ? 'Enabled' : 'Disabled'}
                </label>
            </div>
        </div>
    );
};

export default BooleanTag;

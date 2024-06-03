import React, { useState } from 'react';

const AddAttributes = () => {
    const [attribute, setAttribute] = useState('');

    const handleAttributeChange = (e) => {
        setAttribute(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic here to handle the form submission
        console.log('Attribute:', attribute);
    };

    return (
        <div>
            <h2>Add Attributes</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Attribute:
                    <input type="text" value={attribute} onChange={handleAttributeChange} />
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddAttributes;
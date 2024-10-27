import React, { useState } from 'react';
import { POST_ATTRIBUTE_CONSTRAINTS } from '../../api';
import axios from 'axios';

const conceptTableFields = [
    { name: 'String Length', key: 'stringLength', inputType: 'text' },
    { name: 'Text Pattern', key: 'textPattern', inputType: 'number' },
    { name: 'AC Range', key: 'ACRange', inputType: 'text' },
    { name: 'Precision', key: 'precision', inputType: 'number' },
];

const AddConstraint = ({ parentId, IsOpened, onClose }) => {
    const item_id = parentId._id.encrypted_data;
    const item_iv = parentId._id.iv;
    // State to track form data
    const [formData, setFormData] = useState({
        stringLength: '',
        textPattern: '',
        ACRange: '',
        precision: '',
        simpleAttribute: ''
    });

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to handle form submission
    const addConst = async () => {
        console.log('Adding constraint:', formData, parentId);
        try {
            const response = await axios.post(POST_ATTRIBUTE_CONSTRAINTS, {
                ...formData, // Send the form data in the request
            }, {
                params: {
                    item_id: item_id,
                    item_iv: item_iv
                }
            });
            alert('Constraint added successfully');
            onClose();
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error('Error adding constraint:', error);
        }
    };

    // If modal is not open, return null
    if (!IsOpened) {
        return null;
    }

    return (
        <div className="modal-style">
            <div className="modal-content-style" style={{ width: '600px' }}>
                <div className='text-end'>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                <h4>Add Constraint</h4>
                {conceptTableFields.map(({ name, key, inputType = 'text' }) => (
                    <div className="input-group input-group-sm mb-1" key={key}>
                        <label style={{ width: '40%' }} className="input-group-text" htmlFor={key}>{name}</label>
                        <input
                            className="form-control"
                            type={inputType}
                            id={key}
                            name={key}
                            value={formData[key]} // Bind value to state
                            onChange={handleChange} // Update state on change
                        />
                    </div>
                ))}
                <div className='text-end mt-3'>
                    <button className='btn btn-primary' onClick={addConst}>Add Constraint</button>
                </div>
            </div>
        </div>
    );
};

export default AddConstraint;

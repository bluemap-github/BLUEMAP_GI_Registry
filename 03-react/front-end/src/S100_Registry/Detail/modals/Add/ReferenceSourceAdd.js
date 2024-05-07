import React, {useState} from "react";
import axios from "axios";
import {CREATE_REFERENCE_SOURCE_URL} from '../../../api';

function ReferenceSourceAdd({onClose, itemId}){
    const [referenceSource, setReferenceSource] = useState('');
    const RSChange = (event) => {
        const {name, value} = event.target;
        setReferenceSource((prevRS) => ({
            ...prevRS,
            [name]: value
        }));
    }
    const handleSubmitItem = async () => {
        try {
            const RSUrl = CREATE_REFERENCE_SOURCE_URL(itemId);
            await axios.post(RSUrl, referenceSource);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    return (
        <div>
            <div className='text-end mb-3'>
                <button onClick={onClose} type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div>
            <h3 className='mb-2'>Add Reference Source</h3>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%", fontWeight: "bold"}}>*referenceIdentifier</span>
                    <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={RSChange} />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%", fontWeight: "bold"}}>*sourceDocument</span>
                    <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={RSChange} />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <label class="input-group-text" for="similarity" style={{width:"40%", fontWeight: "bold"}}>*similarity</label>
                    <select class="form-select" id="similarity" name="similarity" onChange={RSChange}>
                        <option selected>Choose</option>
                        <option value="identical">identical</option>
                        <option value="restyled">restyled</option>
                        <option value="contextAdded">contextAdded</option>
                        <option value="generalization">generalization</option>
                        <option value="specialization">specialization</option>
                        <option value="unspecified">unspecified</option>
                    </select>
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>Add</button>
                </div>
            </div>
        </div>
    )
}
export default ReferenceSourceAdd;
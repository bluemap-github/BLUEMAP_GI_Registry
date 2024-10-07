import React, {useState, useContext} from "react";
import { ItemContext } from '../../../../../context/ItemContext';
import axios from "axios";
import {POST_REFERENCE_SOURCE } from '../../../api';

function ReferenceSourceAdd({onClose}){
    const { itemDetails } = useContext(ItemContext); 
    const { item_id, item_iv } = itemDetails;
    const [referenceSource, setReferenceSource] = useState({
        referenceIdentifier: '',
        sourceDocument: '',
        similarity: ''
    });
    const RSChange = (event) => {
        const {name, value} = event.target;
        setReferenceSource((prevRS) => ({
            ...prevRS,
            [name]: value
        }));
    }
    const handleSubmitItem = async () => {
        try {
            await axios.post(POST_REFERENCE_SOURCE, referenceSource, {
                params: {
                    "item_id": item_id,
                    "item_iv": item_iv
                }
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    return (
        <div>
            <div className='text-end mb-3'>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
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
                    <label className="input-group-text" htmlFor="similarity" style={{width:"40%", fontWeight: "bold"}}>*similarity</label>
                    <select className="form-select" id="similarity" name="similarity" onChange={RSChange}>
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
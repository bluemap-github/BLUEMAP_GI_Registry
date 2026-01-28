import React, {useState, useContext} from "react";
import { ItemContext } from '../../../../../context/ItemContext';
import axios from "axios";
import {POST_REFERENCE} from '../../../api';

const referenceInit = {
    referenceIdentifier: '',
    sourceDocument: ''
};
function ReferenceAdd({onClose}){
    const [reference, setReference] = useState([referenceInit]);
    const { itemDetails } = useContext(ItemContext); 
    const { item_id, item_iv } = itemDetails;
    const RChange = (event) => {
        const {name, value} = event.target;
        setReference((prevR) => ({
            ...prevR,
            [name]:value
        }));
    }
    const handleSubmitItem = async () => {
        const confirmSubmit = window.confirm("Are you sure you want to update this item?");
        if (!confirmSubmit) return; // Exit if the user cancels
        try {
            await axios.post(POST_REFERENCE, reference, {
                params: {
                    "item_id": item_id,
                    "item_iv": item_iv
                }
            });
            alert("Reference added successfully");
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
                <h3 className='mb-2'>Add Reference</h3>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%", fontWeight: "bold"}}>*Reference Identifier</span>
                    <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={RChange} />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%", fontWeight: "bold"}}>*Source Document</span>
                    <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={RChange} />
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>Add</button>
                </div>
            </div>
        </div>
    )
}
export default ReferenceAdd;
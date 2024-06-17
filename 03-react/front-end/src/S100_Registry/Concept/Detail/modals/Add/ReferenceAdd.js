import React, {useState} from "react";
import axios from "axios";
import {POST_REFERENCE} from '../../../api';


function ReferenceAdd({onClose, itemId}){
    const [reference, setReference] = useState('');
    const RChange = (event) => {
        const {name, value} = event.target;
        setReference((prevR) => ({
            ...prevR,
            [name]:value
        }));
    }
    const handleSubmitItem = async () => {
        try {
            const RUrl = POST_REFERENCE(itemId);
            await axios.post(RUrl, reference);
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
                <h3 className='mb-2'>Add Reference</h3>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%", fontWeight: "bold"}}>*referenceIdentifier</span>
                    <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={RChange} />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%", fontWeight: "bold"}}>*sourceDocument</span>
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
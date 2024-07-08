import React, { useState } from "react";
import axios from "axios";
import { PUT_RS_URL } from "../../../api";
import UpdateInput from '../tags/UpdateInput';

const similarityOptions = ["identical", "restyled", "contextAdded", "generalization", "specialization", "unspecified"];
const inputFields = [
    { type: "text", name: "referenceIdentifier", spanName: "Reference Identifier" },
    { type: "text", name: "sourceDocument", spanName: "*Source Document" }
];

function ReferenceSourceUpdate({ referenceSources, onClose }) {
    const [RS, setRS] = useState(referenceSources[0]);

    const RChange = (event) => {
        const { name, value } = event.target;
        setRS(prevRS => ({
            ...prevRS,
            [name]: value
        }));
    };

    const handleSubmitItem = async () => {
        try {
            const { encrypted_data: RSId, iv: item_iv } = RS._id;
            const RSResponse = await axios.put(PUT_RS_URL, RS, {
                params: {
                    item_id: RSId,
                    item_iv: item_iv
                }});
            console.log('Item data successfully put:', RSResponse.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div>
            <div className='text-end'>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
            </div>
            <h3 className='mb-2'>Update reference Source</h3>
            <div>
                {inputFields.map(({ type, name, spanName }) => (
                    <UpdateInput 
                        key={name} 
                        type={type} 
                        ItemChange={RChange} 
                        itemValue={RS[name]} 
                        name={name} 
                        spanName={spanName} 
                    />
                ))}
                <div className='input-group input-group-sm mt-2'>
                    <label className="input-group-text" htmlFor="similarity" style={{ width: "40%", fontWeight: "bold" }}>*similarity</label>
                    <select className="form-select" id="similarity" name="similarity" value={RS.similarity} onChange={RChange} >
                        {similarityOptions.map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>update</button>
                </div>
            </div>
        </div>
    );
}

export default ReferenceSourceUpdate;

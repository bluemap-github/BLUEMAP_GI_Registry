import React, { useState } from "react";
import axios from 'axios';
import { PUT_R_URL } from '../../../api';
import UpdateInput from '../tags/UpdateInput';

const inputFields = [
    { type: "text", name: "referenceIdentifier", spanName: "*Reference Identifier" },
    { type: "text", name: "sourceDocument", spanName: "*Source Document" }
];

function ReferenceUpdate({ itemList, onClose, followIdx }) {
    const str = JSON.stringify(itemList.references[followIdx]);
    const [R, setR] = useState(JSON.parse(str)); 

    const RChange = (event) => {
        const { name, value } = event.target;
        setR(prevR => ({
            ...prevR,
            [name]: value
        }));
    };

    const handleSubmitItem = async () => {
        try {
            const { encrypted_data: RId, iv: item_iv } = itemList.references[followIdx]._id;
            await axios.put(PUT_R_URL, R, {
                params: {
                    item_id: RId,
                    item_iv: item_iv
                }
            });
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
            <div>
                <h3 className='mb-2'>Update reference</h3>
                {inputFields.map(({ type, name, spanName }) => (
                    <UpdateInput 
                        key={name} 
                        type={type} 
                        ItemChange={RChange} 
                        itemValue={R[name]} 
                        name={name} 
                        spanName={spanName} 
                    />
                ))}
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>update</button>
                </div>
            </div>
        </div>
    );
}

export default ReferenceUpdate;

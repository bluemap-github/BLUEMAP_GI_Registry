import React, {useState} from "react";
import axios from "axios";

const createReferenceUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/reference/post/`;
};


function ReferenceAdd({onClose, itemId}){
    const [reference, setReference] = useState('');
    const RChange = (event) => {
        setReference(event.target.value);
    }
    const handleSubmitItem = async () => {
        try {
            const RUrl = createReferenceUrl(itemId);
            const referenceData = JSON.parse(reference);
            const RResponse = await axios.post(RUrl, referenceData);
            console.log('Management Info data successfully posted:', RResponse);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }
    return (
        <div>
            <div>
                <textarea
                    className='mt-3'
                    style={{
                        width: "100%",
                        height: "18rem",
                    }}
                    value={reference}
                    onChange={(event) => RChange(event)}
                    placeholder='R 쓰는 곳'
                ></textarea>
                <button onClick={handleSubmitItem}>Add</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
export default ReferenceAdd;
import React, {useState} from "react";
import axios from "axios";

const createReferenceSourceUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/referenceSource/post/`;
};

function ReferenceSourceAdd({onClose, itemId}){
    const [referenceSource, setReferenceSource] = useState('');
    const RSChange = (event) => {
        setReferenceSource(event.target.value);
    }
    const handleSubmitItem = async () => {
        try {
            const RSUrl = createReferenceSourceUrl(itemId);
            const referenceSourceData = JSON.parse(referenceSource);
            const RSResponse = await axios.post(RSUrl, referenceSourceData);
            console.log('Management Info data successfully posted:', RSResponse);
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
                    value={referenceSource}
                    onChange={(event) => RSChange(event)}
                    placeholder='RS 쓰는 곳'
                ></textarea>
                <button onClick={handleSubmitItem}>Add</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
export default ReferenceSourceAdd;
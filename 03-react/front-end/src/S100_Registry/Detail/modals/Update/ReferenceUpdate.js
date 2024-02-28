import React, {useState}from "react";
import axios from 'axios';

const putRUrl = (RId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/reference/${RId}/put/`;
};

function ReferenceUpdate({itemList, onClose, followIdx}){
    const str = JSON.stringify(itemList.references[followIdx])
    const [R, setR] = useState(str);

    const RChange = (event) => {
        setR(event.target.value)
    }

    const handleSubmitItem = async () => {
        try {
            const RId = itemList.references[followIdx].id;
            const UpdatedRData = JSON.parse(R);
            const RResponse = await axios.put(putRUrl(RId), UpdatedRData);
            console.log('Item data successfully put:', RResponse.data);
            onClose()
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
                    value={R}
                    onChange={(event) => RChange(event)}
                ></textarea>
                <button onClick={handleSubmitItem}>update</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
export default ReferenceUpdate;
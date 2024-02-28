import React, {useState} from "react";
import axios from "axios";

const putRSUrl = (RSId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/referenceSource/${RSId}/put/`;
};

function ReferenceSourceUpdte({referenceSources, onClose}){
    const str = JSON.stringify(referenceSources[0])
    const [RS, setRS] = useState(str);
    
    const RChange = (event) => {
        setRS(event.target.value)
    }

    const handleSubmitItem = async () => {
        try {
            const RSId = referenceSources[0].id;
            const UpdatedRSData = JSON.parse(RS);
            const RSResponse = await axios.put(putRSUrl(RSId), UpdatedRSData);
            console.log('Item data successfully put:', RSResponse.data);
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
                    value={RS}
                    onChange={(event) => RChange(event)}
                ></textarea>
                <button onClick={handleSubmitItem}>update</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default ReferenceSourceUpdte;
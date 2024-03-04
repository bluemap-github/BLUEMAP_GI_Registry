import React, {useState} from "react";
import axios from "axios";

const createReferenceUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/reference/post/`;
};


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
            const RUrl = createReferenceUrl(itemId);
            const RResponse = await axios.post(RUrl, reference);
            console.log('Management Info data successfully posted:', RResponse);
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
                <textarea
                    className='mt-3'
                    style={{
                        width: "100%",
                        height: "18rem",
                    }}
                    value={JSON.stringify(reference)}
                    onChange={(event) => RChange(event)}
                    placeholder='R 쓰는 곳'
                ></textarea>
                <div className='input-group '>
                    <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*referenceIdentifier</span>
                    <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={RChange} />
                </div>
                <div className='input-group '>
                    <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*sourceDocument</span>
                    <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={RChange} />
                </div>
                <button onClick={handleSubmitItem}>Add</button>
            </div>
        </div>
    )
}
export default ReferenceAdd;
import React, {useState} from "react";
import axios from "axios";

const createReferenceSourceUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/referenceSource/post/`;
};

function ReferenceSourceAdd({onClose, itemId}){
    const [referenceSource, setReferenceSource] = useState('');
    const RSChange = (event) => {
        const {name, value} = event.target;
        setReferenceSource((prevRS) => ({
            ...prevRS,
            [name]: value
        }));
    }
    const handleSubmitItem = async () => {
        try {
            const RSUrl = createReferenceSourceUrl(itemId);
            const RSResponse = await axios.post(RSUrl, referenceSource);
            console.log('Management Info data successfully posted:', RSResponse);
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
                    value={JSON.stringify(referenceSource)}
                    onChange={(event) => RSChange(event)}
                    placeholder='RS 쓰는 곳'
                ></textarea>
                <div className='input-group mt-3'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*referenceIdentifier</span>
                    <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={RSChange} />
                </div>
                <div className='input-group mt-3'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*sourceDocument</span>
                    <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={RSChange} />
                </div>
                <div className='input-group mt-3'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*similarity</span>
                    <input type="text" className="form-control" placeholder="similarity" name="similarity" onChange={RSChange} />
                </div>
                <button onClick={handleSubmitItem}>Add</button>
            </div>
        </div>
    )
}
export default ReferenceSourceAdd;
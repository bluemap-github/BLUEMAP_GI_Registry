import React, {useState} from "react";
import axios from "axios";

const createReferenceSourceUrl = (itemId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/${itemId}/referenceSource/post/`;
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
            <h3 className='mb-2'>Add Reference Source</h3>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*referenceIdentifier</span>
                    <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={RSChange} />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*sourceDocument</span>
                    <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={RSChange} />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*similarity</span>
                    <input type="text" className="form-control" placeholder="similarity" name="similarity" onChange={RSChange} />
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>Add</button>
                </div>
            </div>
        </div>
    )
}
export default ReferenceSourceAdd;
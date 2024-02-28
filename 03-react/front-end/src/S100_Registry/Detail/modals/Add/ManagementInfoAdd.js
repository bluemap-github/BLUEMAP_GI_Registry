import React, {useState} from "react";
import axios from "axios";

const createManagementInfoUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/managementInfo/post/`;
};


function ManagementInfoAdd({onClose, itemId}){
    const [managementInfo, setManagementInfo] = useState('');
    const MIChange = (event) => {
        setManagementInfo(event.target.value);
    }
    const handleSubmitItem = async () => {
        try {
            const miUrl = createManagementInfoUrl(itemId);
            const managementInfoData = JSON.parse(managementInfo);
            const MIResponse = await axios.post(miUrl, managementInfoData);
            console.log('Management Info data successfully posted:', MIResponse);
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
                    // value={managementInfo}
                    onChange={MIChange}
                    placeholder='MI 쓰는 곳'
                ></textarea>
                <button onClick={handleSubmitItem}>Add</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
export default ManagementInfoAdd;
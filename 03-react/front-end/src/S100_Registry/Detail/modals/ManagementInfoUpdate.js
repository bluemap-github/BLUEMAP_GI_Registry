import React, {useState}from 'react';
import axios from 'axios';

const putMIUrl = (MIId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/managementInfo/${MIId}/put/`;
};

function ManagementInfoUpdate({managementInfos, onClose}){

    const str = JSON.stringify(managementInfos[0])
    const [MI, setMI] = useState(str);
    
    const MIChange = (event) => {
        setMI(event.target.value);
    };

    const handleSubmitItem = async () => {
        try {
            const MIId = managementInfos[0].id;
            const UpdatedMIData = JSON.parse(MI);
            const MIResponse = await axios.put(putMIUrl(MIId), UpdatedMIData);
            console.log('Item data successfully put:', MIResponse.data);
            onClose()
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }
    return(
        <div>
            <div>
                <textarea 
                    className='mt-3'
                    style={{ 
                        width: "100%",
                        height: "18rem",
                    }}
                    value={MI}
                    onChange={MIChange}
                ></textarea>
                <button onClick={handleSubmitItem}>update</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
export default ManagementInfoUpdate;
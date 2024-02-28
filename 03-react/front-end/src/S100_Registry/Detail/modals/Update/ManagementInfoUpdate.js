import React, {useState}from 'react';
import axios from 'axios';

const putMIUrl = (MIId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/managementInfo/${MIId}/put/`;
};

function ManagementInfoUpdate({itemList, onClose, followIdx}){
    const str = JSON.stringify(itemList.management_infos[followIdx])
    const [MI, setMI] = useState(str);
    console.log(followIdx)
    const MIChange = (event) => {
        setMI(event.target.value);
    };

    const handleSubmitItem = async () => {
        try {
            const MIId = itemList.management_infos[followIdx].id;
            const UpdatedMIData = JSON.parse(MI);
            const MIResponse = await axios.put(putMIUrl(MIId), UpdatedMIData);
            console.log('Item data successfully put:', MIResponse.data);
            onClose()
            window.location.reload();
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
import React, {useState} from "react";
import axios from "axios";

const createManagementInfoUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/managementInfo/post/`;
};


function ManagementInfoAdd({onClose, itemId}) {
    const [managementInfo, setManagementInfo] = useState([]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setManagementInfo((prevMI) => ({
          ...prevMI,
          [name]: value,
        }));
      };
    const handleSubmitItem = async () => {
        try {
            const miUrl = createManagementInfoUrl(itemId);
            const MIResponse = await axios.post(miUrl, managementInfo);
            console.log('Management Info data successfully posted:', MIResponse);
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
                    value={JSON.stringify(managementInfo)}
                    placeholder='MI 쓰는 곳'
                ></textarea>
                <div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>*proposalType</span>
                        <input type="text" className="form-control" placeholder="proposalType" name="proposalType" onChange={handleChange} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>*submittingOrganisation</span>
                        <input type="text" className="form-control" placeholder="submittingOrganisation" name="submittingOrganisation" onChange={handleChange} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>*proposedChange</span>
                        <input type="text" className="form-control" placeholder="proposedChange" name="proposedChange" onChange={handleChange} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>dateAccepted</span>
                        <input type="text" className="form-control" placeholder="dateAccepted" name="dateAccepted" onChange={handleChange} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>*dateProposed</span>
                        <input type="text" className="form-control" placeholder="dateProposed" name="dateProposed" onChange={handleChange} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>*dateAmended</span>
                        <input type="text" className="form-control" placeholder="dateAmended" name="dateAmended" onChange={handleChange} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>*proposalStatus</span>
                        <input type="text" className="form-control" placeholder="proposalStatus" name="proposalStatus" onChange={handleChange} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>controlBodyNotes</span>
                        <input type="text" className="form-control" placeholder="controlBodyNotes" name="controlBodyNotes" onChange={handleChange} />
                    </div>
                </div>
                <button onClick={handleSubmitItem}>Add</button>
            </div>
        </div>
    )
}
export default ManagementInfoAdd;
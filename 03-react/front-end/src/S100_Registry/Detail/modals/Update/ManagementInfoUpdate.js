import React, { useState } from 'react';
import axios from 'axios';

const putMIUrl = (MIId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/managementInfo/${MIId}/put/`;
};

function ManagementInfoUpdate({ itemList, onClose, followIdx }) {
    const initialMI = itemList.management_infos[followIdx];
    const [MI, setMI] = useState(initialMI);

    const MIChange = (event) => {
        const { name, value } = event.target;
        setMI(prevMI => ({
            ...prevMI,
            [name]: value
        }));
    };

    const handleSubmitItem = async () => {
        try {
            const MIId = itemList.management_infos[followIdx].id;
            const MIResponse = await axios.put(putMIUrl(MIId), MI);
            console.log('Item data successfully put:', MIResponse.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div>
            <div className='text-end'>
                <button onClick={onClose} type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div>
                <h3 className='mb-2'>Update management Info</h3>
                <div className='input-group input-group-sm mt-2'>
                    {/* <span className="input-group-text" style={{ width: "40%" }}>*proposalType</span>
                    <input
                        value={MI.proposalType}
                        type="text"
                        className="form-control"
                        placeholder="proposalType"
                        name="proposalType"
                        onChange={MIChange}
                    /> */}
                    <label style={{ width: "40%" }} class="input-group-text" for="proposalType">*proposalType</label>
                    <select class="form-select" id="proposalType" name="proposalType" onChange={MIChange}>
                        <option selected>{MI.proposalType}</option>
                        <option value="addition">addition</option>
                        <option value="clarification">clarification</option>
                        <option value="supersession">supersession</option>
                        <option value="retirement">retirement</option>
                    </select>
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%" }}>*submittingOrganisation</span>
                    <input
                        value={MI.submittingOrganisation}
                        type="text"
                        className="form-control"
                        placeholder="submittingOrganisation"
                        name="submittingOrganisation"
                        onChange={MIChange}
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%" }}>*proposedChange</span>
                    <input
                        value={MI.proposedChange}
                        type="text"
                        className="form-control"
                        placeholder="proposedChange"
                        name="proposedChange"
                        onChange={MIChange}
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%" }}>dateAccepted</span>
                    <input
                        value={MI.dateAccepted}
                        type="text"
                        className="form-control"
                        placeholder="dateAccepted"
                        name="dateAccepted"
                        onChange={MIChange}
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%" }}>*dateProposed</span>
                    <input
                        value={MI.dateProposed}
                        type="text"
                        className="form-control"
                        placeholder="dateProposed"
                        name="dateProposed"
                        onChange={MIChange}
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%" }}>*dateAmended</span>
                    <input
                        value={MI.dateAmended}
                        type="text"
                        className="form-control"
                        placeholder="dateAmended"
                        name="dateAmended"
                        onChange={MIChange}
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <label style={{ width: "40%" }} class="input-group-text" for="proposalStatus">*proposalStatus</label>
                    <select class="form-select" id="proposalStatus" name="proposalStatus" onChange={MIChange}>
                        <option selected>{MI.proposalStatus}</option>
                        <option value="notYetDetermined">notYetDetermined</option>
                        <option value="transferred">transferred</option>
                        <option value="accepted">accepted</option>
                        <option value="rejected">rejected</option>
                        <option value="withdrawn">withdrawn</option>
                        <option value="negotiation">negotiation</option>
                        <option value="appeal">appeal</option>
                        <option value="appealTransferred">appealTransferred</option>
                        <option value="appealAccepted">appealAccepted</option>
                        <option value="appealRejected">appealRejected</option>
                    </select>
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%" }}>controlBodyNotes</span>
                    <input
                        value={MI.controlBodyNotes}
                        type="text"
                        className="form-control"
                        placeholder="controlBodyNotes"
                        name="controlBodyNotes"
                        onChange={MIChange}
                    />
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>update</button>
                </div>
            </div>
        </div>
    );
}

export default ManagementInfoUpdate;

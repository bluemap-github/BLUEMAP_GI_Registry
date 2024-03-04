import React, { useState } from 'react';
import axios from 'axios';

const putMIUrl = (MIId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/managementInfo/${MIId}/put/`;
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
            <div className='text-end mb-3'>
                <button onClick={onClose} type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div>
                <div className='input-group'>
                    <span className="input-group-text" style={{ width: "40%" }}>*proposalType</span>
                    <input
                        value={MI.proposalType}
                        type="text"
                        className="form-control"
                        placeholder="proposalType"
                        name="proposalType"
                        onChange={MIChange}
                    />
                </div>
                <div className='input-group'>
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
                <div className='input-group'>
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
                <div className='input-group'>
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
                <div className='input-group'>
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
                <div className='input-group'>
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
                <div className='input-group'>
                    <span className="input-group-text" style={{ width: "40%" }}>*proposalStatus</span>
                    <input
                        value={MI.proposalStatus}
                        type="text"
                        className="form-control"
                        placeholder="proposalStatus"
                        name="proposalStatus"
                        onChange={MIChange}
                    />
                </div>
                <div className='input-group'>
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

                <button onClick={handleSubmitItem}>update</button>
            </div>
        </div>
    );
}

export default ManagementInfoUpdate;

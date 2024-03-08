import React, { useState, forwardRef } from "react";
import axios from 'axios';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const ExampleCustomInput = forwardRef(({ value, onClick }) => (
        <div onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-fill" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </div>
      ));

    return (
        <div>
            <div className='text-end'>
                <button onClick={onClose} type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div>
                <h3 className='mb-2'>Update management Info</h3>
                <div className='input-group input-group-sm mt-2'>
                    <label style={{ width: "40%", fontWeight: "bold" }} class="input-group-text" for="proposalType">*proposalType</label>
                    <select class="form-select" id="proposalType" name="proposalType" onChange={MIChange}>
                        <option selected>{MI.proposalType}</option>
                        <option value="addition">addition</option>
                        <option value="clarification">clarification</option>
                        <option value="supersession">supersession</option>
                        <option value="retirement">retirement</option>
                    </select>
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%", fontWeight: "bold" }}>*submittingOrganisation</span>
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
                    <span className="input-group-text" style={{ width: "40%", fontWeight: "bold" }}>*proposedChange</span>
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
                    <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <input
                            value={MI.dateAccepted}
                            type="text"
                            className="date-input"
                            placeholder="dateAccepted"
                            name="dateAccepted"
                            onChange={MIChange}
                        />
                        <DatePicker 
                            name="dateAccepted" 
                            selected={MI.dateAccepted} 
                            onChange={(date) => {
                                MIChange({ target: { name: 'dateAccepted', value: formatDate(date) } });
                            }} 
                            customInput={<ExampleCustomInput />}
                        />
                    </div>
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%", fontWeight: "bold" }}>*dateProposed</span>
                    <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <input
                            value={MI.dateProposed}
                            type="text"
                            className="date-input"
                            placeholder="dateProposed"
                            name="dateProposed"
                            onChange={MIChange}
                        />
                        <DatePicker 
                            name="dateAccepted" 
                            selected={MI.dateProposed} 
                            onChange={(date) => MIChange({ target: { name: 'dateProposed', value: formatDate(date) } })} 
                            customInput={<ExampleCustomInput />}
                        />
                    </div>
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" style={{ width: "40%", fontWeight: "bold" }}>*dateAmended</span>
                    <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <input
                            value={MI.dateAmended}
                            type="text"
                            className="date-input"
                            placeholder="dateAmended"
                            name="dateAmended"
                            onChange={MIChange}
                        />
                        <DatePicker 
                            name="dateAmended" 
                            selected={MI.dateAmended} 
                            onChange={(date) => MIChange({ target: { name: 'dateAmended', value: formatDate(date) } })} 
                            customInput={<ExampleCustomInput />}
                        />
                    </div>
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <label style={{ width: "40%", fontWeight: "bold" }} class="input-group-text" for="proposalStatus">*proposalStatus</label>
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

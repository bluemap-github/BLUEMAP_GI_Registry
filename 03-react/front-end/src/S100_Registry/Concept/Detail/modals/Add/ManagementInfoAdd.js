import React, { useState, forwardRef } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { POST_MANAGEMENT_INFO } from '../../../api';



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
            const miUrl = POST_MANAGEMENT_INFO(itemId);
            await axios.post(miUrl, managementInfo);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

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
                <div>
                    <h3 className='mb-2'>Add management Info</h3>
                    <div className='input-group input-group-sm mt-2'>
                        <label style={{width:"50%", fontWeight: "bold"}} class="input-group-text" for="proposalType">*proposalType</label>
                        <select class="form-select" id="proposalType" name="proposalType" onChange={handleChange}>
                            <option selected>Choose</option>
                            <option value="addition">addition</option>
                            <option value="clarification">clarification</option>
                            <option value="supersession">supersession</option>
                            <option value="retirement">retirement</option>
                        </select>
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%", fontWeight: "bold"}}>*submittingOrganisation</span>
                        <input type="text" className="form-control" placeholder="submittingOrganisation" name="submittingOrganisation" onChange={handleChange} />
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%", fontWeight: "bold"}}>*proposedChange</span>
                        <input type="text" className="form-control" placeholder="proposedChange" name="proposedChange" onChange={handleChange} />
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>dateAccepted</span>
                        <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input 
                                type="text" 
                                className="date-input" 
                                placeholder="dateAccepted" 
                                name="dateAccepted" 
                                onChange={handleChange} 
                                value={managementInfo.dateAccepted}
                            />
                            <DatePicker 
                                name="dateAccepted" 
                                selected={managementInfo.dateAccepted} 
                                onChange={(date) => handleChange({ target: { name: 'dateAccepted', value: formatDate(date) } })} 
                                customInput={<ExampleCustomInput />}
                            />
                        </div>
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%", fontWeight: "bold"}}>*dateProposed</span>
                        <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input 
                                type="text" 
                                className="date-input" 
                                placeholder="dateProposed" 
                                name="dateProposed" 
                                onChange={handleChange} 
                                value={managementInfo.dateProposed}
                            />
                            <DatePicker 
                                name="dateProposed" 
                                selected={managementInfo.dateProposed} 
                                onChange={(date) => handleChange({ target: { name: 'dateProposed', value: formatDate(date) } })} 
                                customInput={<ExampleCustomInput />}
                            />
                        </div>
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%", fontWeight: "bold"}}>*dateAmended</span>
                        <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <input 
                                type="text" 
                                className="date-input" 
                                placeholder="dateAmended" 
                                name="dateAmended" 
                                onChange={handleChange} 
                                value={managementInfo.dateAmended}
                            />
                            <DatePicker 
                                name="dateAmended" 
                                selected={managementInfo.dateAmended} 
                                onChange={(date) => handleChange({ target: { name: 'dateAmended', value: formatDate(date) } })} 
                                customInput={<ExampleCustomInput />}
                            />
                        </div>
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <label style={{ width: "50%" , fontWeight: "bold"}} class="input-group-text" for="proposalStatus">*proposalStatus</label>
                        <select class="form-select" id="proposalStatus" name="proposalStatus" onChange={handleChange}>
                            <option selected>Choose</option>
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
                        <span className="input-group-text" id="basic-addon1" style={{width:"50%"}}>controlBodyNotes</span>
                        <input type="text" className="form-control" placeholder="controlBodyNotes" name="controlBodyNotes" onChange={handleChange} />
                    </div>
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>Add</button>
                </div>
            </div>
        </div>
    )
}
export default ManagementInfoAdd;
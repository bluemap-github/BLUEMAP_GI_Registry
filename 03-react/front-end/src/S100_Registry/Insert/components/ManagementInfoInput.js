import React, { useState, forwardRef } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const managementInfoInit = {
    proposalType: '',
    submittingOrganisation: '',
    proposedChange: '',
    dateAccepted: null,
    dateProposed: '',
    dateAmended: '',
    proposalStatus: '',
    controlBodyNotes: ''
};

function ManagementInfoInput({ onFormSubmit }) {
    const [managementInfos, setManagementInfos] = useState([managementInfoInit]);
    const [toggleOpened, setToggleOpened] = useState(false);

    const handleChange = (event, idx) => {
        const { name, value } = event.target;
        const updatedManagementInfos = [...managementInfos];
        updatedManagementInfos[idx] = {
            ...updatedManagementInfos[idx],
            [name]: value
        };
        setManagementInfos(updatedManagementInfos);
        onFormSubmit(updatedManagementInfos);
        console.log(updatedManagementInfos)
    };

    const addMIInput = () => {
        setManagementInfos([...managementInfos, managementInfoInit]);
    };

    const popMIInput = (index) => {
        const newManagementInfos = [...managementInfos];
        newManagementInfos.splice(index, 1);
        setManagementInfos(newManagementInfos);
        onFormSubmit(newManagementInfos);
    };

    const toggleOpen = () => {
        setToggleOpened(!toggleOpened);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <div onClick={onClick}>
            <input type="text" className="form-control" />
        </div>
      ));

    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            {toggleOpened ? (
                <div>
                    <div className='' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{ display: 'flex', alignItems: 'center'}}>
                            <h3>Management Informations</h3>
                            <button className='btn' onClick={toggleOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <button className='btn btn-outline-secondary btn-sm' onClick={addMIInput} style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                                </svg>
                                <div style={{ marginLeft: '8px' }}>
                                    Add Management Info
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    {managementInfos.map((managementInfo, index) => (
                        <div key={index} className='p-3'>
                            {index !== 0 && <hr></hr>}
                            {index !== 0 && 
                                <div className='text-end'>
                                    <button className='btn btn-sm btn-outline-danger' onClick={() => popMIInput(index)}>Remove</button>
                                </div>
                            }
                            <div className='row'>
                                <div className='col'>
                                    <div class="input-group input-group-sm mt-2">
                                        <label class="input-group-text" for="proposalType">*proposalType</label>
                                        <select class="form-select" id="proposalType" name="proposalType" onChange={(event) => handleChange(event, index)}>
                                            <option selected>Choose</option>
                                            <option value="addition">addition</option>
                                            <option value="clarification">clarification</option>
                                            <option value="supersession">supersession</option>
                                            <option value="retirement">retirement</option>
                                        </select>
                                    </div>
                                    <div className='input-group input-group-sm mt-2'>
                                        <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*submittingOrganisation</span>
                                        <input type="text" className="form-control" placeholder="submittingOrganisation" name="submittingOrganisation" onChange={(event) => handleChange(event, index)} />
                                    </div>
                                    <div className='input-group input-group-sm mt-2'>
                                        <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*proposedChange</span>
                                        <input type="text" className="form-control" placeholder="proposedChange" name="proposedChange" onChange={(event) => handleChange(event, index)} />
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='input-group input-group-sm mt-2'>
                                        <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>dateAccepted</span>
                                        <DatePicker 
                                            dateFormat='yyyy-MM-dd'
                                            className="form-control date-picker-style" 
                                            placeholder="dateAccepted" 
                                            name="dateAccepted" 
                                            selected={managementInfo.dateAccepted} 
                                            onChange={(date) => handleChange({ target: { name: 'dateAccepted', value: formatDate(date) } }, index)} 
                                            customInput={<ExampleCustomInput />}
                                        />
                                    </div>
                                    <div className='input-group input-group-sm mt-2'>
                                        <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*dateProposed</span>
                                        <DatePicker 
                                            dateFormat='yyyy-MM-dd'
                                            className="form-control date-picker-style" 
                                            placeholder="dateProposed" 
                                            name="dateProposed" 
                                            selected={managementInfo.dateProposed} 
                                            onChange={(date) => handleChange({ target: { name: 'dateProposed', value: formatDate(date) } }, index)} 
                                        />
                                    </div>
                                    <div className='input-group input-group-sm mt-2'>
                                        <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*dateAmended</span>
                                        <DatePicker 
                                            dateFormat='yyyy-MM-dd'
                                            className="form-control date-picker-style" 
                                            placeholder="dateAmended" 
                                            name="dateAmended" 
                                            selected={managementInfo.dateAmended} 
                                            onChange={(date) => handleChange({ target: { name: 'dateAmended', value: formatDate(date) } }, index)} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col'>
                                    <div class="input-group input-group-sm mt-2">
                                        <label class="input-group-text" for="proposalStatus">*proposalStatus</label>
                                        <select class="form-select" id="proposalStatus" name="proposalStatus" onChange={(event) => handleChange(event, index)}>
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
                                </div>
                                <div className='col'>
                                    <div className='input-group input-group-sm mt-2'>
                                        <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>controlBodyNotes</span>
                                        <input type="text" className="form-control" placeholder="controlBodyNotes" name="controlBodyNotes" onChange={(event) => handleChange(event, index)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='' style={{ display: 'flex', alignItems: 'center'}}>
                    <h3>Management Informations</h3>
                    <button className='btn' onClick={toggleOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16" >
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ManagementInfoInput;

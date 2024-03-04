import React, { useState } from 'react';
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
function ManagementInfoInput({onFormSubmit }) {
    const [managementInfos, setManagementInfos] = useState([managementInfoInit]);

    const handleChange = (event, idx) => {
        const { name, value } = event.target;
        const updatedManagementInfos = [...managementInfos];
        updatedManagementInfos[idx] = {
            ...updatedManagementInfos[idx],
            [name]: value
        };
        setManagementInfos(updatedManagementInfos);
        onFormSubmit(updatedManagementInfos);
    };

    const addMIInput = () => {
        setManagementInfos([...managementInfos, managementInfoInit]); // 새로운 관리 정보 입력 창 추가
    };
    const popMIInput = (index) => {
        const newManagementInfos = [...managementInfos];
        newManagementInfos.splice(index, 1); // 인덱스에 해당하는 입력 창 제거
        setManagementInfos(newManagementInfos);
        onFormSubmit(newManagementInfos);
    };
    return (
        <div>
            <h3 className='mt-3'>Management Informations</h3>
            {managementInfos.map((managementInfo, index) => (
                <div key={index}>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*proposalType</span>
                        <input type="text" className="form-control" placeholder="proposalType" name="proposalType" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*submittingOrganisation</span>
                        <input type="text" className="form-control" placeholder="submittingOrganisation" name="submittingOrganisation" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*proposedChange</span>
                        <input type="text" className="form-control" placeholder="proposedChange" name="proposedChange" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>dateAccepted</span>
                        <input type="text" className="form-control" placeholder="dateAccepted" name="dateAccepted" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*dateProposed</span>
                        <input type="text" className="form-control" placeholder="dateProposed" name="dateProposed" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*dateAmended</span>
                        <input type="text" className="form-control" placeholder="dateAmended" name="dateAmended" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*proposalStatus</span>
                        <input type="text" className="form-control" placeholder="proposalStatus" name="proposalStatus" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group mt-3'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>controlBodyNotes</span>
                        <input type="text" className="form-control" placeholder="controlBodyNotes" name="controlBodyNotes" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <button onClick={() => popMIInput(index)}>Remove</button>
                </div>
            ))}
            <div className='text-center'>
                <button className='mt-3 btn btn-primary' onClick={addMIInput} style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                    </svg>
                    <div style={{ marginLeft: '8px' }}>
                        Add Management Info
                    </div>
                </button>
            </div>

            

        </div>
    )
}

export default ManagementInfoInput;
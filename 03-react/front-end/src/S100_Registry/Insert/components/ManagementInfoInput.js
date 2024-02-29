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
            <button className='mt-3' onClick={addMIInput}>+ Add Management Info</button>
        </div>
    )
}

export default ManagementInfoInput;
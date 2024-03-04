import React, { useState } from 'react';
const referenceInit = {
    referenceIdentifier: '',
    sourceDocument: ''
};

function ReferenceInput({onFormSubmit}) {
    const [references, setReferences] = useState([]);

    const handleChange = (event, idx) => {
        const { name, value } = event.target;
        const updatedReferences = [...references];
        updatedReferences[idx] = {
            ...updatedReferences[idx],
            [name]: value
        };
        setReferences(updatedReferences);
        onFormSubmit(updatedReferences);
    };

    const addRInput = () => {
        setReferences([...references, referenceInit]); // 새로운 관리 정보 입력 창 추가
    };
    const popRInput = (index) => {
        const newReferences = [...references];
        newReferences.splice(index, 1); // 인덱스에 해당하는 입력 창 제거
        setReferences(newReferences);
        onFormSubmit(newReferences);
    };

    return (
        <div>
            <h3 className=''>Reference</h3>
            {references.map((reference, index) => (
                <div key={index} className='p-3' style={{backgroundColor: 'yellow'}}>
                    <div className='input-group '>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*referenceIdentifier</span>
                        <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group '>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*sourceDocument</span>
                        <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <button className="btn btn-outline-danger" onClick={() => popRInput(index)} style={{ display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace-fill" viewBox="0 0 16 16">
                            <path d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8z"/>
                        </svg>
                        <div style={{ marginLeft: '8px' }}>
                            Remove R
                        </div>
                    </button>
                </div>
            ))}
            <div className='text-center'>
                <button className='mt-3 btn btn-primary' onClick={addRInput} style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                    </svg>
                    <div style={{ marginLeft: '8px' }}>
                        Add Reference
                    </div>
                </button>
            </div>

            
        </div>
    )
}

export default ReferenceInput;
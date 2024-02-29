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
                <div key={index}>
                    <div className='input-group '>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*referenceIdentifier</span>
                        <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <div className='input-group '>
                        <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*sourceDocument</span>
                        <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={(event) => handleChange(event, index)} />
                    </div>
                    <button onClick={() => popRInput(index)}>Remove R</button>
                </div>
            ))}
            <button className='' onClick={addRInput}>+ Add Reference</button>
        </div>
    )
}

export default ReferenceInput;
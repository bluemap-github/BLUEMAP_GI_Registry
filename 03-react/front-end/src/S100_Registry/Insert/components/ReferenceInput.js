import React, { useState } from 'react';

const referenceInit = {
    referenceIdentifier: '',
    sourceDocument: ''
};

function ReferenceInput({onFormSubmit}) {
    const [references, setReferences] = useState([]);
    console.log(references)

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
    
    const [toggleOpened, setToggleOpened] = useState(false);
    const toggleOpen = () => {
        setToggleOpened(!toggleOpened);
    }
    

    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            {toggleOpened ? (
                <div>
                    <div className='' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div className='' style={{ display: 'flex', alignItems: 'center'}}>
                            <h3>References</h3>
                            <button className='btn' onClick={toggleOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                            </button>
                        </div>
                        <div className='text-center'>
                            <button className='btn-sm btn btn-outline-secondary' onClick={addRInput} style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                </svg>
                                <div style={{ marginLeft: '8px' }}>
                                    Add Reference
                                </div>
                            </button>
                        </div>
                    </div>
                    { references.length > 0 ? (
                        <div>
                            {references.map((reference, index) => (
                                <div key={index} className='p-3'>
                                    {index !== 0 && <hr></hr>}
                                    <div className='text-end'>
                                        <button  className="btn btn-sm btn-outline-danger" onClick={() => popRInput(index)}>Remove</button>
                                    </div>
                                    <div className='row'>
                                        <div className='col input-group input-group-sm mt-2'>
                                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*referenceIdentifier</span>
                                            <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={(event) => handleChange(event, index)} />
                                        </div>
                                        <div className='col input-group input-group-sm mt-2'>
                                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*sourceDocument</span>
                                            <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={(event) => handleChange(event, index)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div className='size-block-inner' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <div className='text-center'>
                                    <div>No data</div>
                                    <div>Please click the 'Add' button to submit the information</div>
                                </div>
                            </div>
                        )
                    }
                </div>
            ) : (
                <div className='' style={{ display: 'flex', alignItems: 'center'}}>
                    <h3>References</h3>
                    <button className='btn' onClick={toggleOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16" >
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ReferenceInput;
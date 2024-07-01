import React, { useState } from 'react';

const referenceInit = {
    referenceIdentifier: '',
    sourceDocument: ''
};

function ReferenceInput({onFormSubmit}) {
    const [references, setReferences] = useState([]);
    const mandatoryFields = ["referenceIdentifier", "sourceDocument"];

    // eslint-disable-next-line
    const handleChange = (event, idx) => {
        const { name, value } = event.target;
        const updatedReferences = [...references];
        updatedReferences[idx] = {
            ...updatedReferences[idx],
            [name]: value
        };
        setReferences(updatedReferences);

        if (mandatoryFields.includes(name) && value.trim() === '') {
            event.target.classList.add('tag-invalid');
        } else {
            event.target.classList.remove('tag-invalid');
        }

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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                            </button>
                        </div>
                        <div className='text-center'>
                            <button className='btn-sm btn btn-outline-secondary' onClick={addRInput} style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
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
                                <div key={index} className='p-2'>
                                    {index !== 0 && <hr style={{margin: "5px"}}></hr>}
                                    <div className='row'>
                                        <div className='col-3 input-group input-group-sm mt-2' style={{width:"47%", fontWeight: "bold"}}>
                                            <span 
                                                className={`input-group-text ${mandatoryFields.includes('referenceIdentifier') && reference.referenceIdentifier.trim() === '' ? 'tag-invalid' : ''}`}
                                                id="basic-addon1" 
                                                style={{width:"45%" ,fontWeight: "bold"}}>
                                                    * Reference Identifier
                                            </span>
                                            <input 
                                                type="text" 
                                                // className="form-control"
                                                className={`form-control ${mandatoryFields.includes('referenceIdentifier') && reference.referenceIdentifier.trim() === '' ? 'tag-invalid' : ''}`} 
                                                placeholder="Reference Identifier" 
                                                name="referenceIdentifier" 
                                                onChange={(event) => handleChange(event, index)} />
                                        </div>
                                        <div className='col-3 input-group input-group-sm mt-2' style={{width:"47%", fontWeight: "bold"}}>
                                            <span 
                                                className={`input-group-text ${mandatoryFields.includes('sourceDocument') && reference.sourceDocument.trim() === '' ? 'tag-invalid' : ''}`}
                                                id="basic-addon1" 
                                                style={{width:"45%" ,fontWeight: "bold"}}>
                                                    * Source Document
                                            </span>
                                            <input 
                                                type="text" 
                                                className={`form-control ${mandatoryFields.includes('sourceDocument') && reference.sourceDocument.trim() === '' ? 'tag-invalid' : ''}`}
                                                placeholder="Source Document" 
                                                name="sourceDocument" 
                                                onChange={(event) => handleChange(event, index)} 
                                            />
                                        </div>
                                        <div className='text-end mt-2 col-1' style={{width:"5%"}}>
                                            {/* <button  className="btn btn-sm btn-outline-danger" }>Remove</button> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" viewBox="0 0 24 24" onClick={() => popRInput(index)} className='delete-button'>
                                                <path fill="currentColor" d="M12 3c-4.963 0-9 4.038-9 9s4.037 9 9 9s9-4.038 9-9s-4.037-9-9-9m0 16c-3.859 0-7-3.14-7-7s3.141-7 7-7s7 3.14 7 7s-3.141 7-7 7m.707-7l2.646-2.646a.502.502 0 0 0 0-.707a.502.502 0 0 0-.707 0L12 11.293L9.354 8.646a.5.5 0 0 0-.707.707L11.293 12l-2.646 2.646a.5.5 0 0 0 .707.708L12 12.707l2.646 2.646a.5.5 0 1 0 .708-.706z"/>
                                            </svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16" >
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ReferenceInput;
import React, { useState } from 'react';

function ReferenceSourceInput({onFormSubmit}) {
    

    const [referenceSource, setReferenceSource] = useState();
    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedReferenceSource = {
            ...referenceSource,
            [name]: value
        };
        setReferenceSource(updatedReferenceSource);
        onFormSubmit(updatedReferenceSource);
    };

    const addRSInput = () => {
        setReferenceSource({
            "referenceIdentifier": '',
            "sourceDocument": '',
            "similarity": ''
        })
    }
    const popRSInput = () => {
        setReferenceSource(null)
        onFormSubmit(null);
    }
    return (
        <div>
            <h3 className='mt-3'>Reference Sources</h3>
            {referenceSource ? (
                    <div>
                        <div className='input-group mt-3'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*referenceIdentifier</span>
                            <input type="text" className="form-control" placeholder="referenceIdentifier" name="referenceIdentifier" onChange={handleChange} />
                        </div>
                        <div className='input-group mt-3'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*sourceDocument</span>
                            <input type="text" className="form-control" placeholder="sourceDocument" name="sourceDocument" onChange={handleChange} />
                        </div>
                        <div className='input-group mt-3'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*similarity</span>
                            <input type="text" className="form-control" placeholder="similarity" name="similarity" onChange={handleChange} />
                        </div>
                        <button onClick={popRSInput}>Remove RS</button>
                    </div>
                ) : (
                    <button className='mt-3 btn btn-primary ' onClick={addRSInput} style={{ display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                        </svg>
                        <div style={{ marginLeft: '8px' }}>
                            Add Reference Source
                        </div>
                    </button>
                )}
        </div>
    )
}

export default ReferenceSourceInput;
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
                    <button onClick={addRSInput}>Add Reference Source</button>
                )}
        </div>
    )
}

export default ReferenceSourceInput;
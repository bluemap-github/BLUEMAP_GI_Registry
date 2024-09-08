import React, { useState } from 'react';

function ReferenceSourceInput({ onFormSubmit }) {
    const [toggleOpened, setToggleOpened] = useState(false);
    const [referenceSource, setReferenceSource] = useState(null);
    const mandatoryFields = ["referenceIdentifier", "sourceDocument", "similarity"];

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedReferenceSource = {
            ...referenceSource,
            [name]: value
        };
        setReferenceSource(updatedReferenceSource);

        if (mandatoryFields.includes(name) && value.trim() === '') {
            event.target.classList.add('tag-invalid');
        } else {
            event.target.classList.remove('tag-invalid');
        }

        onFormSubmit(updatedReferenceSource);
    };

    const addRSInput = () => {
        setReferenceSource({
            referenceIdentifier: '',
            sourceDocument: '',
            similarity: ''
        });
    };

    const popRSInput = () => {
        setReferenceSource(null);
        onFormSubmit(null);
    };

    const toggleOpen = () => {
        setToggleOpened(!toggleOpened);
    };

    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            {toggleOpened ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h3>Reference Source</h3>
                            <button className='btn' onClick={toggleOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                            </button>
                        </div>
                        <div className='text-center'>
                            {!referenceSource ? (
                                <div>
                                    <button className='btn btn-outline-secondary btn-sm' onClick={addRSInput} style={{ display: 'flex', alignItems: 'center' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                        </svg>
                                        <div style={{ marginLeft: '8px' }}>
                                            Add Reference Source
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <button className='btn btn-sm btn-outline-danger' onClick={popRSInput}>Remove</button>
                            )}
                        </div>
                    </div>
                    {referenceSource ? (
                        <div>
                            <div className='input-group input-group-sm' style={{ zIndex: '0' }}>
                                <span 
                                    className={`input-group-text ${mandatoryFields.includes('referenceIdentifier') && referenceSource.referenceIdentifier.trim() === '' ? 'tag-invalid' : ''}`}
                                    id="basic-addon1" 
                                    style={{ width: "20%", fontWeight: "bold" }}>
                                        * Reference Identifier
                                </span>
                                <input
                                    type="text"
                                    className={`form-control ${mandatoryFields.includes('referenceIdentifier') && referenceSource.referenceIdentifier.trim() === '' ? 'tag-invalid' : ''}`}
                                    placeholder="Reference Identifier"
                                    name="referenceIdentifier"
                                    value={referenceSource.referenceIdentifier} // Added value prop
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='input-group input-group-sm mt-2' style={{ zIndex: '0' }}>
                                <span 
                                    className={`input-group-text ${mandatoryFields.includes('sourceDocument') && referenceSource.sourceDocument.trim() === '' ? 'tag-invalid' : ''}`}
                                    id="basic-addon1" 
                                    style={{ width: "20%", fontWeight: "bold" }}>
                                        * Source Document
                                </span>
                                <input
                                    type="text"
                                    className={`form-control ${mandatoryFields.includes('sourceDocument') && referenceSource.sourceDocument.trim() === '' ? 'tag-invalid' : ''}`}
                                    placeholder="Source Document"
                                    name="sourceDocument"
                                    value={referenceSource.sourceDocument} // Added value prop
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col'>
                                <div className="input-group input-group-sm mt-2" style={{ zIndex: '0' }}>
                                    <label 
                                        style={{ width: "20%", fontWeight: "bold" }} 
                                        className={`input-group-text ${mandatoryFields.includes('similarity') && referenceSource.similarity.trim() === '' ? 'tag-invalid' : ''}`}
                                        htmlFor="similarity">
                                            * Similarity
                                    </label>
                                    <select
                                        className={`form-select ${mandatoryFields.includes('similarity') && referenceSource.similarity.trim() === '' ? 'tag-invalid' : ''}`}
                                        id="similarity"
                                        name="similarity"
                                        value={referenceSource.similarity} // Added value prop
                                        onChange={handleChange}
                                    >
                                        <option value="">Choose</option>
                                        <option value="identical">identical</option>
                                        <option value="restyled">restyled</option>
                                        <option value="contextAdded">contextAdded</option>
                                        <option value="generalization">generalization</option>
                                        <option value="specialization">specialization</option>
                                        <option value="unspecified">unspecified</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='size-block-inner' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className='text-center'>
                                <div>No data</div>
                                <div>Please click the 'Add' button to submit the information</div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='' style={{ display: 'flex', alignItems: 'center' }}>
                    <h3>Reference Source</h3>
                    <button className='btn' onClick={toggleOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReferenceSourceInput;

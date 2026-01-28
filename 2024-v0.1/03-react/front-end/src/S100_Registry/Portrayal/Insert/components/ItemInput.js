import React, { useState, useEffect } from 'react';
import Base from '../modals/Base';

function ItemInput({ onFormSubmit, apiType }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toggleOpened, setToggleOpened] = useState(true); // For toggling open/close
    const mandatoryFields = ["name", "itemStatus"];

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [formData, setFormData] = useState({
        concept_id: '1',
        itemIdentifier: '2',
        name: '',
        definition: '',
        remarks: '',
        itemStatus: '',
        alias: [],
        camelCase: '',
        definitionSource: '',
        reference: '',
        similarityToSource: '',
        justification: '',
        proposedChange: '',
        itemType: apiType,  // Initial value
    });

    useEffect(() => {
        setFormData({
            concept_id: '1',
            itemIdentifier: '2',
            name: '',
            definition: '',
            remarks: '',
            itemStatus: '',
            alias: [],
            camelCase: '',
            definitionSource: '',
            reference: '',
            similarityToSource: '',
            justification: '',
            proposedChange: '',
            itemType: apiType, 
        });
    }, [apiType]); 

    const [aliasList, setAliasList] = useState([]);
    const [formattedAliasList, setFormattedAliasList] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);

        if (mandatoryFields.includes(name) && value.trim() === '') {
            event.target.classList.add('tag-invalid');
        } else {
            event.target.classList.remove('tag-invalid');
        }

        onFormSubmit(updatedFormData);
    };

    const handleCheck = (newAliasList) => {
        const formattedAliasList = newAliasList.join('; ');
        setAliasList(newAliasList);
        setFormattedAliasList(formattedAliasList);
        setFormData(prevFormData => ({
            ...prevFormData,
            alias: newAliasList
        }));
    };

    // Toggle visibility
    const toggleOpen = () => {
        setToggleOpened(!toggleOpened);
    };

    return (
        <div className='item-input-form-bg p-3 mt-4'>
            {toggleOpened ? (
                <div>
                    <div className='' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{ display: 'flex', alignItems: 'center'}}>
                            <h3>Concept Information</h3>
                            <button className='btn' onClick={toggleOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className='row'>
                            <div className='col'>
                                <div className='input-group input-group-sm mt-2'>
                                    <span 
                                        className={`input-group-text ${mandatoryFields.includes('name') && formData.name.trim() === '' ? 'tag-invalid' : ''}`}
                                        id="basic-addon1"
                                        style={{width:"40%" ,fontWeight: "bold"}}
                                        >* Name</span>
                                    <input 
                                        type="text" 
                                        className={`form-control ${mandatoryFields.includes('name') && formData.name.trim() === '' ? 'tag-invalid' : ''}`}
                                        placeholder="Name" 
                                        name="name" 
                                        value={formData.name}  // Set value
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className='col'>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Camel Case</span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Camel Case" 
                                        name="camelCase" 
                                        value={formData.camelCase}  // Set value
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Source Of Definition</span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Source Of Definition" 
                                        name="definitionSource" 
                                        value={formData.definitionSource}  // Set value
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className='col'>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Item Type</span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="itemType" 
                                        value={formData.itemType}  // Set value
                                        disabled 
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='input-group input-group-sm mt-2'>
                                <span className="input-group-text" id="basic-addon1" style={{width:"10%"}}>Definition</span>
                                <textarea 
                                    className="form-control" 
                                    placeholder="Definition" 
                                    name="definition" 
                                    value={formData.definition}  // Set value
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className='input-group input-group-sm mt-2'>
                                <span className="input-group-text" id="basic-addon1" style={{width:"10%"}}>Remarks</span>
                                <textarea 
                                    className="form-control" 
                                    placeholder="Remarks" 
                                    name="remarks" 
                                    value={formData.remarks}  // Set value
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className='row'>
                        <Base 
                            isOpen={isModalOpen} 
                            onClose={closeModal} 
                            selectedForm={1} 
                            onformdata={handleCheck}
                            aliasData={aliasList}
                        />
                            <div className='col'>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"20.5%"}}>Alias</span>
                                    <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <input 
                                            className='date-input' 
                                            placeholder="Alias" 
                                            name="alias" 
                                            value={formattedAliasList}  // Set value
                                            disabled 
                                        />
                                        <div onClick={openModal}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                        </svg>  
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group input-group-sm mt-2">
                                    <label 
                                        className={`input-group-text ${mandatoryFields.includes('itemStatus') && formData.itemStatus.trim() === '' ? 'tag-invalid' : ''}`}
                                        htmlFor="itemStatus" 
                                        style={{width:"40%" ,fontWeight: "bold"}}>* Item Status</label>
                                    <select 
                                        className={`form-select ${mandatoryFields.includes('itemStatus') && formData.itemStatus.trim() === '' ? 'tag-invalid' : ''}`} 
                                        id="itemStatus" 
                                        name="itemStatus" 
                                        value={formData.itemStatus}  // Set value
                                        onChange={handleChange}>
                                        <option>Choose</option>
                                        <option value="processing">processing</option>
                                        <option value="valid">valid</option>
                                        <option value="superseded">superseded</option>
                                        <option value="notValid">notValid</option>
                                        <option value="retired">retired</option>
                                        <option value="clarified">clarified</option>
                                    </select>
                                </div>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Reference</span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Reference" 
                                        name="reference" 
                                        value={formData.reference}  // Set value
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className='col'>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Similarity To Source</span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Similarity To Source" 
                                        name="similarityToSource" 
                                        value={formData.similarityToSource}  // Set value
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Justification</span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Justification" 
                                        name="justification" 
                                        value={formData.justification}  // Set value
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className='input-group input-group-sm mt-2'>
                                    <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Proposed Change</span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Proposed Change" 
                                        name="proposedChange" 
                                        value={formData.proposedChange}  // Set value
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='' style={{ display: 'flex', alignItems: 'center'}}>
                    <h3>Concept Information</h3>
                    <button className='btn' onClick={toggleOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16" >
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ItemInput;

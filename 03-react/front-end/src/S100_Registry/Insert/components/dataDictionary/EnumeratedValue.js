import React, { useState } from 'react';
import Base from '../../modals/Base';
import AddRealtedValues from '../../modals/AddRealtedValues';

function EnumeratedValue({ onFormSubmit, registerId, selectedApiUrl }) {
    const mandatoryFields = ["name", "itemStatus", "enumType", "numericCode"];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {setIsModalOpen(true);};
    const closeModal = () => {setIsModalOpen(false);};

    const [isRelModalOpen, setIsRelModalOpen] = useState(false);
    const openRelModal = () => {setIsRelModalOpen(true);};
    const closeRelModal = () => {setIsRelModalOpen(false);};

    const [formData, setFormData] = useState({
        concept_id: registerId,
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
        itemType: 'EnumeratedValue',
        numericCode: '',
        enumType: '',
        associated_arrtibute_id: ''
    });

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

    return (
        <div style={{ backgroundColor: '#F8F8F8', borderColor: 'red' }} className='p-3 mt-4'>
            <h3>Enumerated Value</h3>
            <p>{selectedApiUrl}</p>
            <div className='p-3 mt-3'>
                <div className='row'>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span 
                                className={`input-group-text ${mandatoryFields.includes('name') && formData.name.trim() === '' ? 'tag-invalid' : ''}`}
                                id="basic-addon1" 
                                style={{width:"40%" ,fontWeight: "bold"}}
                            >
                                * Name
                            </span>
                            <input 
                                type="text" 
                                className={`form-control ${mandatoryFields.includes('name') && formData.name.trim() === '' ? 'tag-invalid' : ''}`}
                                placeholder="Name" 
                                name="name" 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Camel Case</span>
                            <input type="text" className="form-control" placeholder="Camel Case" name="camelCase" onChange={handleChange} />
                        </div>
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"19.5%"}}>Source Of Definition</span>
                        <input type="text" className="form-control" placeholder="Source Of Definition" name="definitionSource" onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"10%"}}>Definition</span>
                        <textarea type="text" className="form-control" placeholder="Definition" name="definition" onChange={handleChange} />
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"10%"}}>Remarks</span>
                        <textarea type="text" className="form-control" placeholder="Remarks" name="remarks" onChange={handleChange} />
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
                            <input className='date-input' placeholder="Alias" name="alias" value={formattedAliasList} disabled />
                            <div onClick={openModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3H5a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </div>
                            </div>
                            
                        </div>
                        <div className="input-group input-group-sm mt-2">
                            <label 
                                className={`input-group-text ${mandatoryFields.includes('itemStatus') && formData.itemStatus.trim() === '' ? 'tag-invalid' : ''}`}
                                htmlFor="itemStatus" 
                                style={{
                                    width:"40%",
                                    fontWeight: "bold" 
                                }}
                            >    
                                * Item Status
                            </label>
                            <select 
                                className={`form-select ${mandatoryFields.includes('itemStatus') && formData.itemStatus.trim() === '' ? 'tag-invalid' : ''}`} 
                                id="itemStatus" 
                                name="itemStatus" 
                                value={formData.itemStatus} // Added value prop
                                onChange={handleChange}>
                                <option value="">Choose</option>
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
                            <input type="text" className="form-control" placeholder="Reference" name="reference" onChange={handleChange} />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Similarity To Source</span>
                            <input type="text" className="form-control" placeholder="Similarity To Source" name="similarityToSource" onChange={handleChange} />
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Justification</span>
                            <input type="text" className="form-control" placeholder="Justification" name="justification" onChange={handleChange} />
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Proposed Change</span>
                            <input type="text" className="form-control" placeholder="Proposed Change" name="proposedChange" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span 
                                className={`input-group-text ${mandatoryFields.includes('numericCode') && formData.numericCode.trim() === '' ? 'tag-invalid' : ''}`}
                                id="basic-addon1" 
                                style={{width:"40%", fontWeight: "bold"}}
                            >
                                Numeric Code
                            </span>
                            <input 
                                type="number" // Changed to number type
                                className={`form-control ${mandatoryFields.includes('numericCode') && formData.enumType.trim() === '' ? 'tag-invalid' : ''}`} 
                                placeholder="Numeric Code" 
                                name="numericCode" 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span 
                                className={`input-group-text ${mandatoryFields.includes('enumType') && formData.enumType.trim() === '' ? 'tag-invalid' : ''}`}
                                id="basic-addon1" 
                                style={{width:"40%", fontWeight: "bold"}}
                            >
                                * Enum Type
                            </span>
                            <select 
                                className={`form-select ${mandatoryFields.includes('enumType') && formData.enumType.trim() === '' ? 'tag-invalid' : ''}`} 
                                name="enumType" 
                                value={formData.enumType} // Added value prop
                                onChange={handleChange}
                            >
                                <option value="">Choose</option>
                                <option value="S100_Codelist">S100_Codelist</option>
                                <option value="enumeration">enumeration</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>Associated Attribute ID</span>
                            <input type="text" className="form-control" placeholder="Associated Attribute ID" name="associated_arrtibute_id" onChange={handleChange} />
                        </div>
                    </div>
                </div>  
                {/* <div className='row'>
                    <AddRealtedValues
                        isOpen={isRelModalOpen}
                        onClose={closeRelModal}
                    />
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{ width: "20.5%" }}>Alias</span>
                        <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button onClick={openRelModal}>Add Alias</button>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default EnumeratedValue;

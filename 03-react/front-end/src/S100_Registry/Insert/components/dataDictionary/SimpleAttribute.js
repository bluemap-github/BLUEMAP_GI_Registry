import React, { useState } from 'react';
import Base from '../../modals/Base';
import AddRealtedValues from '../../modals/AddRealtedValues';

function SimpleAttribute({ onFormSubmit, registerId, selectedApiUrl }) {
    const mandatoryFields = ["name", "itemStatus", "quantitySpecification", "valueType"];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {setIsModalOpen(true);};
    const closeModal = () => {setIsModalOpen(false);};

    


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
        itemType: 'SimpleAttribute',
        quantitySpecification: '',
        valueType: '',
        related_enumeration_value_id_list: []
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
    const [isRelModalOpen, setIsRelModalOpen] = useState(false);
    const openRelModal = () => {setIsRelModalOpen(true);};
    const closeRelModal = () => {setIsRelModalOpen(false);};
    const [relatedEnumList, setRelatedEnumList] = useState([]);
    const handleRelatedEnumList = (selectedObj, selectedID) => {
        setRelatedEnumList(selectedObj);
        setFormData(prevFormData => ({
            ...prevFormData,
            related_enumeration_value_id_list: selectedID
        }));
    }
    const log = () => {
        console.log(formData);
    }
    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            <h3>Simple Attribute</h3>
            <button onClick={log}>check</button>
            <p>{selectedApiUrl}</p>
            <div className='p-3 mt-3'>
                <div className='row'>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span
                                className={`input-group-text ${mandatoryFields.includes('name') && formData.name.trim() === '' ? 'tag-invalid' : ''}`}
                                id="basic-addon1"
                                style={{ width: "40%", fontWeight: "bold" }}
                            >
                                * Name
                            </span>
                            <input
                                type="text"
                                className={`form-control ${mandatoryFields.includes('name') && formData.name.trim() === '' ? 'tag-invalid' : ''}`}
                                placeholder="Name"
                                name="name"
                                value={formData.name} // Added value prop
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Camel Case</span>
                            <input type="text" className="form-control" placeholder="Camel Case" name="camelCase" value={formData.camelCase} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "19.5%" }}>Source Of Definition</span>
                    <input type="text" className="form-control" placeholder="Source Of Definition" name="definitionSource" value={formData.definitionSource} onChange={handleChange} />
                </div>
                <div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{ width: "10%" }}>Definition</span>
                        <textarea type="text" className="form-control" placeholder="Definition" name="definition" value={formData.definition} onChange={handleChange} />
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{ width: "10%" }}>Remarks</span>
                        <textarea type="text" className="form-control" placeholder="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
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
                            <span className="input-group-text" id="basic-addon1" style={{ width: "20.5%" }}>Alias</span>
                            <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <input className='date-input' placeholder="Alias" name="alias" value={formattedAliasList} disabled />
                                <div onClick={openModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3H5a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="input-group input-group-sm mt-2">
                            <label
                                className={`input-group-text ${mandatoryFields.includes('itemStatus') && formData.itemStatus.trim() === '' ? 'tag-invalid' : ''}`}
                                htmlFor="itemStatus"
                                style={{
                                    width: "40%",
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
                            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Reference</span>
                            <input type="text" className="form-control" placeholder="Reference" name="reference" value={formData.reference} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Similarity To Source</span>
                            <input type="text" className="form-control" placeholder="Similarity To Source" name="similarityToSource" value={formData.similarityToSource} onChange={handleChange} />
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Justification</span>
                            <input type="text" className="form-control" placeholder="Justification" name="justification" value={formData.justification} onChange={handleChange} />
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Proposed Change</span>
                            <input type="text" className="form-control" placeholder="Proposed Change" name="proposedChange" value={formData.proposedChange} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span
                                className={`input-group-text ${mandatoryFields.includes('valueType') && formData.valueType.trim() === '' ? 'tag-invalid' : ''}`}
                                id="basic-addon1"
                                style={{ width: "40%", fontWeight: "bold" }}
                            >
                                * Value Type
                            </span>
                            <select
                                className={`form-select ${mandatoryFields.includes('valueType') && formData.valueType.trim() === '' ? 'tag-invalid' : ''}`}
                                name="valueType"
                                value={formData.valueType} // Added value prop
                                onChange={handleChange}
                            >
                                <option value="">Choose</option>
                                <option value="boolean">boolean</option>
                                <option value="enumeration">enumeration</option>
                                <option value="integer">integer</option>
                                <option value="real">real</option>
                                <option value="date">date</option>
                                <option value="text">text</option>
                                <option value="time">time</option>
                                <option value="dateTime">dateTime</option>
                                <option value="URI">URI</option>
                                <option value="URL">URL</option>
                                <option value="URN">URN</option>
                                <option value="S100_CodeList">S100_CodeList</option>
                                <option value="S100_TruncatedDate">S100_TruncatedDate</option>
                            </select>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span
                                className={`input-group-text ${mandatoryFields.includes('quantitySpecification') && formData.quantitySpecification.trim() === '' ? 'tag-invalid' : ''}`}
                                id="basic-addon1"
                                style={{ width: "40%", fontWeight: "bold" }}
                            >
                                * Quantity Specificaton
                            </span>
                            <select
                                className={`form-select ${mandatoryFields.includes('quantitySpecification') && formData.quantitySpecification.trim() === '' ? 'tag-invalid' : ''}`}
                                name="quantitySpecification"
                                value={formData.quantitySpecification} // Added value prop
                                onChange={handleChange}
                            >
                                <option value="">Choose</option>
                                <option value="angularVelocity">angularVelocity</option>
                                <option value="area">area</option>
                                <option value="density">density</option>
                                <option value="duration">duration</option>
                                <option value="frequency">frequency</option>
                                <option value="length">length</option>
                                <option value="mass">mass</option>
                                <option value="planeAngle">planeAngle</option>
                                <option value="power">power</option>
                                <option value="pressure">pressure</option>
                                <option value="salinity">salinity</option>
                                <option value="speed">speed</option>
                                <option value="temperature">temperature</option>
                                <option value="volume">volume</option>
                                <option value="weight">weight</option>
                                <option value="otherQuantity">otherQuantity</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <AddRealtedValues
                        isOpen={isRelModalOpen}
                        onClose={closeRelModal}
                        handleRelatedValueList={handleRelatedEnumList}
                    />
                    <div className='input-group input-group-sm mt-2'>
                        <div className="input-group-text" id="basic-addon1" style={{ width: "20.5%" }}>
                            <span>Related EnumeratedValue List</span>
                        </div>
                        <div className="form-control">
                            <div className='m-1' >
                                <svg onClick={openRelModal} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg> 
                            </div>
                            {relatedEnumList.length === 0 ? (
                                <div>not related Yet</div>
                            ) : (
                                <>
                                    {relatedEnumList.map((item, index) => (
                                        <div key={index} style={{ display: 'flex'}}>  
                                            <div>{item.name}</div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SimpleAttribute;

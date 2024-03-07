import React, { useState } from 'react';
import Base from '../modals/Base'

function ItemInput({ onFormSubmit }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };


    const [formData, setFormData] = useState({
        itemIdentifier: '',
        name: '',
        definition: '',
        remarks: '',
        itemStatus: '',
        alias: '',
        camelCase: '',
        definitionSource: '',
        reference: '',
        similarityToSource: '',
        justification: '',
        proposedChange: ''
    });
    const [aliasList, setAliasList] = useState([]);
    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);
        onFormSubmit(updatedFormData);
    };

    const addAlias = (addData) => {
        const updateAliasList = [...aliasList, ...addData];
        setAliasList(updateAliasList)
        console.log(updateAliasList);
    }

    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            <h3>Items</h3>
            <div className='p-3 mt-3'>
                <div className='row'>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*itemIdentifier</span>
                            <input type='number' className="form-control" placeholder="itemIdentifier" name="itemIdentifier" onChange={handleChange}/>
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*name</span>
                            <input type="text" className="form-control" placeholder="name" name="name" onChange={handleChange} />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>camelCase</span>
                            <input type="text" className="form-control" placeholder="camelCase" name="camelCase" onChange={handleChange} />
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>definitionSource</span>
                            <input type="text" className="form-control" placeholder="definitionSource" name="definitionSource" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"10%"}}>definition</span>
                        <textarea type="text" className="form-control" placeholder="definition" name="definition" onChange={handleChange} />
                    </div>
                    <div className='input-group input-group-sm mt-2'>
                        <span className="input-group-text" id="basic-addon1" style={{width:"10%"}}>remarks</span>
                        <textarea type="text" className="form-control" placeholder="remarks" name="remarks" onChange={handleChange} />
                    </div>
                </div>
                <div className='row'>
                    <Base isOpen={isModalOpen} onClose={closeModal} selectedForm={1}/>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"20.5%"}}>alias</span>
                            <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <input className='date-input' placeholder="alias" name="alias" disabled />
                                <div onClick={openModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                    </svg>  
                                </div>
                            </div>
                            
                        </div>
                        <div class="input-group input-group-sm mt-2">
                            <label class="input-group-text" for="itemStatus" style={{width:"40%"}}>*itemStatus</label>
                            <select class="form-select" id="itemStatus" name="itemStatus" onChange={handleChange}>
                                <option selected>Choose</option>
                                <option value="processing">processing</option>
                                <option value="valid">valid</option>
                                <option value="superseded">superseded</option>
                                <option value="notValid">notValid</option>
                                <option value="retired">retired</option>
                                <option value="clarified">clarified</option>
                            </select>
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>reference</span>
                            <input type="text" className="form-control" placeholder="reference" name="reference" onChange={handleChange} />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>similarityToSource</span>
                            <input type="text" className="form-control" placeholder="similarityToSource" name="similarityToSource" onChange={handleChange} />
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>justification</span>
                            <input type="text" className="form-control" placeholder="justification" name="justification" onChange={handleChange} />
                        </div>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>proposedChange</span>
                            <input type="text" className="form-control" placeholder="proposedChange" name="proposedChange" onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

    );
}

export default ItemInput;

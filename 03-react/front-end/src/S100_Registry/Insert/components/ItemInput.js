import React, { useState } from 'react';

function ItemInput({ onFormSubmit }) {
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);
        onFormSubmit(updatedFormData);
    };

    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            <h3>Items</h3>
            <div className='p-3 mt-3' >
                <div className='row'>
                    <div className='col'>
                        <div className='input-group input-group-sm mt-2'>
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>*itemIdentifier</span>
                            <input type="text" className="form-control" placeholder="itemIdentifier" name="itemIdentifier" onChange={handleChange}/>
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
                    <div className='col'>
                        <div class="input-group input-group-sm mt-2">
                            <label class="input-group-text" for="itemStatus">*itemStatus</label>
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
                            <span className="input-group-text" id="basic-addon1" style={{width:"40%"}}>alias</span>
                            <input type="text" className="form-control" placeholder="alias" name="alias" onChange={handleChange} />
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

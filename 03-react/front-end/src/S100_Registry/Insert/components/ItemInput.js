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
        <div>
            <h3>Items</h3>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*itemIdentifier</span>
                <input type="text" className="form-control" placeholder="itemIdentifier" name="itemIdentifier" onChange={handleChange}/>
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*name</span>
                <input type="text" className="form-control" placeholder="name" name="name" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>definition</span>
                <input type="text" className="form-control" placeholder="definition" name="definition" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>remarks</span>
                <input type="text" className="form-control" placeholder="remarks" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>*itemStatus</span>
                <input type="text" className="form-control" placeholder="itemStatus" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>alias</span>
                <input type="text" className="form-control" placeholder="alias" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>camelCase</span>
                <input type="text" className="form-control" placeholder="camelCase" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>definitionSource</span>
                <input type="text" className="form-control" placeholder="definitionSource" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>reference</span>
                <input type="text" className="form-control" placeholder="reference" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>similarityToSource</span>
                <input type="text" className="form-control" placeholder="similarityToSource" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>justification</span>
                <input type="text" className="form-control" placeholder="justification" name="remarks" onChange={handleChange} />
            </div>
            <div className='input-group mt-3'>
                <span className="input-group-text" id="basic-addon1" style={{width:"20%"}}>proposedChange</span>
                <input type="text" className="form-control" placeholder="proposedChange" name="remarks" onChange={handleChange} />
            </div>
        </div>
    );
}

export default ItemInput;

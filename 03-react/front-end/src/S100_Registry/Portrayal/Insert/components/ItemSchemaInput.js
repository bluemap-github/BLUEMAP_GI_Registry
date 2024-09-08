import React, { useState, useEffect } from 'react';

const ItemSchemaInput = ({ onFormSubmit, apiType }) => {
    useEffect(() => {
        setFormData({
            xmlSchema: '<schema>Sample XML Schema</schema>',
            xmlID: '',
            description: [{ text: '', language: '' }] // 초기값
        });
    }, [apiType]);

    const [formData, setFormData] = useState({
        xmlSchema: '<schema>Sample XML Schema</schema>',
        xmlID: '',
        description: [{ text: '', language: '' }] // 초기값
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        onFormSubmit({
            ...formData,
            [name]: value,
        });
    };

    const handleDescriptionChange = (index, event) => {
        const { name, value } = event.target;
        const updatedDescription = [...formData.description];
        updatedDescription[index] = {
            ...updatedDescription[index],
            [name]: value,
        };
        setFormData((prevFormData) => ({
            ...prevFormData,
            description: updatedDescription,
        }));
        onFormSubmit({ ...formData, description: updatedDescription });
    };

    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            <h3>{apiType}</h3>

            {/* XML Schema */}
            <div className='input-group input-group-sm mt-2'>
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>* XML Schema</span>
                <textarea 
                    className="form-control" 
                    name="xmlSchema" 
                    placeholder="Enter XML Schema" 
                    value={formData.xmlSchema} 
                    onChange={handleChange} 
                    rows={10}
                />
            </div>

            {/* XML ID */}
            <div className='input-group input-group-sm mt-2'>
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>* XML ID</span>
                <input 
                    type="text" 
                    className="form-control" 
                    name="xmlID" 
                    placeholder="XML ID" 
                    value={formData.xmlID} 
                    onChange={handleChange} 
                />
            </div>

            {/* Dynamic Description */}
            <div className='mt-3'>
                <h5>Description(s)</h5>
                {formData.description.map((desc, index) => (
                    <div key={index} className='input-group input-group-sm mt-2'>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="text" 
                            placeholder="Description text" 
                            value={desc.text} 
                            onChange={(e) => handleDescriptionChange(index, e)} 
                        />
                        <input 
                            type="text" 
                            className="form-control" 
                            name="language" 
                            placeholder="Language" 
                            value={desc.language} 
                            onChange={(e) => handleDescriptionChange(index, e)} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemSchemaInput;

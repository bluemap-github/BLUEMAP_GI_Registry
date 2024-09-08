import React, { useState, useEffect} from 'react';

const VisualItemInput = ({ onFormSubmit, apiType }) => {
    const mandatoryFields = ["xmlID", "itemDetail"];
    useEffect(() => {
        setFormData({
            xmlID: '',
            description: [{ text: '', language: '' }], // 처음에는 하나의 description만
            itemDetail: '',
            previewImage: '',
            engineeringImage: '',
            previewType: '',
            engineeringImageType: ''
        })
    }, [apiType]);

    const [formData, setFormData] = useState({
        xmlID: '',
        description: [{ text: '', language: '' }], // 처음에는 하나의 description만
        itemDetail: '',
        previewImage: '',
        engineeringImage: '',
        previewType: '',
        engineeringImageType: ''
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

    const addDescription = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            description: [...prevFormData.description, { text: '', language: '' }]
        }));
    };

    const removeDescription = (index) => {
        const updatedDescription = formData.description.filter((_, i) => i !== index);
        setFormData((prevFormData) => ({
            ...prevFormData,
            description: updatedDescription
        }));
        onFormSubmit({ ...formData, description: updatedDescription });
    };

    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
            <h3>{apiType}</h3>

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
                        <button type="button" className="btn btn-danger" onClick={() => removeDescription(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" className="btn btn-primary mt-2" onClick={addDescription}>
                    Add Description
                </button>
            </div>

            {/* Item Detail */}
            <div className='input-group input-group-sm mt-2'>
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>* Item Detail</span>
                <input 
                    type="text" 
                    className="form-control" 
                    name="itemDetail" 
                    placeholder="Item Detail" 
                    value={formData.itemDetail} 
                    onChange={handleChange} 
                />
            </div>

            {/* Preview Image */}
            <div className='input-group input-group-sm mt-2'>
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>Preview Image URL</span>
                <input 
                    type="text" 
                    className="form-control" 
                    name="previewImage" 
                    placeholder="Preview Image URL" 
                    value={formData.previewImage} 
                    onChange={handleChange} 
                />
            </div>

            {/* Engineering Image */}
            <div className='input-group input-group-sm mt-2'>
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>Engineering Image URL</span>
                <input 
                    type="text" 
                    className="form-control" 
                    name="engineeringImage" 
                    placeholder="Engineering Image URL" 
                    value={formData.engineeringImage} 
                    onChange={handleChange} 
                />
            </div>

            {/* Preview Type */}
            <div className='input-group input-group-sm mt-2'>
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>Preview Type</span>
                <input 
                    type="text" 
                    className="form-control" 
                    name="previewType" 
                    placeholder="Preview Type" 
                    value={formData.previewType} 
                    onChange={handleChange} 
                />
            </div>

            {/* Engineering Image Type */}
            <div className='input-group input-group-sm mt-2'>
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>Engineering Image Type</span>
                <input 
                    type="text" 
                    className="form-control" 
                    name="engineeringImageType" 
                    placeholder="Engineering Image Type" 
                    value={formData.engineeringImageType} 
                    onChange={handleChange} 
                />
            </div>
        </div>
    );
};

export default VisualItemInput;

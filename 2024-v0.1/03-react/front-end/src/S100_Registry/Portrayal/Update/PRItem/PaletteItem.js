import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import { PUT_PALETTE_ITEM } from '../../api/api';  // PaletteItem에 대한 PUT API 경로

const conceptTableFields = [
    { name: 'Name', key: 'name' },
    { name: 'Item Type', key: 'itemType' },
    { name: 'Definition', key: 'definition' },
    { name: 'Remarks', key: 'remarks' },
    { name: 'Item Status', key: 'itemStatus', inputType: 'select', options: ['processing', 'valid', 'superseded', 'notValid', 'retired', 'clarified'] },
    { name: 'Alias', key: 'alias', isAlias: true }, 
    { name: 'Camel Case', key: 'camelCase' },
    { name: 'Definition Source', key: 'definitionSource' },
    { name: 'Reference', key: 'reference' },
    { name: 'Similarity to Source', key: 'similarityToSource' },
    { name: 'Justification', key: 'justification' },
    { name: 'Proposed Change', key: 'proposedChange' },
];

const PaletteItem = ({ data, onClose }) => {
    const [formData, setFormData] = useState(data || {});
    const [xmlID, setXmlID] = useState(data.xmlID || "");
    const [transparency, setTransparency] = useState(data.transparency || "");
    const [rgbValues, setRgbValues] = useState(data.colourValue?.sRGB || { red: "", green: "", blue: "" });
    const [cieValues, setCieValues] = useState(data.colourValue?.cie || { x: "", y: "", L: "" });

    useEffect(() => {
        if (data) {
            setFormData(data);
            setXmlID(data.xmlID || "");
            setTransparency(data.transparency || "");
            setRgbValues(data.colourValue?.sRGB || { red: "", green: "", blue: "" });
            setCieValues(data.colourValue?.cie || { x: "", y: "", L: "" });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onNLSChange = (key, addNLS) => {
        const updatedFormData = { ...formData, [key]: addNLS };
        setFormData(updatedFormData);
    };

    const handleSubmit = async () => {
        const confirmed = window.confirm("Are you sure you want to update this item?");
        
        if (confirmed) {
            try {
                const { _id, ...bodyData } = formData;
                console.log('Sending PUT request with:', bodyData);
    
                // PUT 요청 보내기
                const response = await axios.put(PUT_PALETTE_ITEM, bodyData, {
                    params: {
                        item_id: _id.encrypted_data,
                        item_iv: _id.iv,
                    },
                });
    
                // 응답 코드 확인
                if (response.status >= 200 && response.status < 300) {
                    alert('Update successful');
                    onClose(); 
                    window.location.reload(); 
                } else {
                    console.error('Unexpected response:', response);
                    alert('Failed to update: Unexpected response');
                }
            } catch (error) {
                console.error('Update failed:', error.response || error.message);
                alert(`Failed to update: ${error.response?.data?.message || error.message}`);
            }
        }
    };
    
    

    // Handle change for RGB inputs
    const handleRgbChange = (e) => {
        const { name, value } = e.target;
        setRgbValues((prevRgb) => ({
            ...prevRgb,
            [name]: value
        }));
    };

    // Handle change for CIE inputs
    const handleCieChange = (e) => {
        const { name, value } = e.target;
        setCieValues((prevCie) => ({
            ...prevCie,
            [name]: value
        }));
    };

    return (
        <div>
            <h2>Update Palette Item</h2>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div style={{flex: 1}}>
                    <h4>Update Portrayal Information</h4>
                    <div className="input-group input-group-sm mb-2" style={{  marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                            XML ID
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            value={xmlID}
                            onChange={(e) => setXmlID(e.target.value)}
                        />
                    </div>  
                    <div className="input-group input-group-sm mb-2" style={{  marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                            Transparency
                        </span>
                        <input
                            type="number"
                            className="form-control"
                            value={transparency}
                            onChange={(e) => setTransparency(e.target.value)}
                        />
                    </div>  
                    <div className="input-group input-group-sm mb-2" style={{  marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '25%', fontWeight: 'bold' }}>
                            RGB Values
                        </span>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="R"
                            name="red"
                            value={rgbValues.red}
                            onChange={handleRgbChange}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="G"
                            name="green"
                            value={rgbValues.green}
                            onChange={handleRgbChange}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="B"
                            name="blue"
                            value={rgbValues.blue}
                            onChange={handleRgbChange}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2" style={{ flex: 1 }}>
                        <span className="input-group-text" style={{ width: '25%', fontWeight: 'bold' }}>
                            CIE Values
                        </span>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="X"
                            name="x"
                            value={cieValues.x}
                            onChange={handleCieChange}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Y"
                            name="y"
                            value={cieValues.y}
                            onChange={handleCieChange}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="L"
                            name="L"
                            value={cieValues.L}
                            onChange={handleCieChange}
                        />
                    </div>
                    <NLSUpdate
                        itemType={data.itemType}
                        tagName={"Description"}
                        initialData={data.description || []}
                        onFormSubmit={(addNLS) => onNLSChange("description", addNLS)}
                    />
                </div>
                <div style={{ borderLeft: '1px solid #D3D3D3', margin: '0 20px' }}></div>
                <div style={{flex: 1}}>
                    <h4>Update Concept Information</h4>
                    {conceptTableFields.map(({ name, key, inputType = 'text', options }) => (
                        <div className="input-group input-group-sm mb-1" key={key}>
                            <label className="input-group-text" style={{ width: '40%' }}>
                                {name}
                            </label>
                            {inputType === 'select' ? (
                                <select
                                    className="form-select"
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose</option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={inputType}
                                    className="form-control"
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                    placeholder={name}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary btn-sm" onClick={handleSubmit}>
                    Update
                </button>
            </div>
        </div>
    );
};

export default PaletteItem;

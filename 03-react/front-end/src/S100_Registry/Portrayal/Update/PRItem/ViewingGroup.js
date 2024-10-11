import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import { PUT_VIEWING_GROUP } from '../../api/api';  // API 경로를 설정

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

const portrayalTableFields = [];

const DisplayPlane = ({ data, onClose }) => {
    const [formData, setFormData] = useState(data || {});
    const [foundationMode, setFoundationMode] = useState(data.foundationMode || false);

    useEffect(() => {
        if (data) {
            setFormData(data);
            setFoundationMode(data.foundationMode || false);  // 초기값 설정
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFoundationModeChange = (e) => {
        setFoundationMode(e.target.checked);  // 체크박스 값 변경
        setFormData((prevData) => ({
            ...prevData,
            foundationMode: e.target.checked,  // formData에 foundationMode 값 반영
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
                const response = await axios.put(PUT_VIEWING_GROUP, bodyData, {
                    params: {
                        item_id: _id.encrypted_data,
                        item_iv: _id.iv,
                    },
                });
    
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
    
    return (
        <div>
            <h2>Update Display Plane</h2>
            <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                <div>
                    <h4>Update Portrayal Information</h4>
                    <div className="input-group input-group-sm mb-2" style={{ marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                            XML ID
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            name="xmlID"
                            value={formData.xmlID || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2" style={{ marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                            Foundation Mode
                        </span>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="foundationMode"
                            checked={foundationMode}  // 체크박스 상태 반영
                            onChange={handleFoundationModeChange}
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
                <div>
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

export default DisplayPlane;

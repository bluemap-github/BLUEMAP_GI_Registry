import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import { PUT_COLOUR_TOKEN } from '../../api/api';

const ColourToken = ({ data, onClose }) => {
    const [formData, setFormData] = useState(data || {});

    useEffect(() => {
        if (data) {
            setFormData(data);
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

    const conceptTableFields = [
        { name: 'Name', key: 'name' },
        { name: 'Item Type', key: 'itemType' },
        { name: 'Definition', key: 'definition' },
        { name: 'Remarks', key: 'remarks' },
        { name: 'Item Status', key: 'itemStatus', inputType: 'select', options: ['processing', 'valid', 'superseded', 'notValid', 'retired', 'clarified'] }, // Select 추가
        { name: 'Alias', key: 'alias', isAlias: true }, 
        { name: 'Camel Case', key: 'camelCase' },
        { name: 'Definition Source', key: 'definitionSource' },
        { name: 'Reference', key: 'reference' },
        { name: 'Similarity to Source', key: 'similarityToSource' },
        { name: 'Justification', key: 'justification' },
        { name: 'Proposed Change', key: 'proposedChange' },
    ];

    const portrayalTableFields = [
        { name: 'XML ID', key: 'xmlID' },
        { name: 'Token', key: 'token' },
    ];

    const handleSubmit = async () => {
        const confirmed = window.confirm("Are you sure you want to update this item?");
        
        if (confirmed) {
            try {
                const { _id, ...bodyData } = formData;
    
                // PUT 요청 보내기
                const response = await axios.put(PUT_COLOUR_TOKEN, bodyData, {
                    params: {
                        item_id: _id.encrypted_data,
                        item_iv: _id.iv,
                    },
                });
    
                // 응답 코드 확인 (성공적인 응답 처리)
                if (response.status >= 200 && response.status < 300) {
                    alert('Update successful');
                    onClose(); // 모달을 닫는 함수 (필요에 따라)
                    window.location.reload(); // 페이지 새로고침 (옵션)
                } else {
                    // 응답이 성공적이지 않은 경우
                    console.error('Unexpected response:', response);
                    alert('Failed to update: Unexpected response');
                }
            } catch (error) {
                // 에러가 발생한 경우
                console.error('Update failed:', error.response || error.message);
                alert(`Failed to update: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    return (
        <div>
            <h2>Update Colour Token</h2>
            <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                <div>
                    <h4>Update Portrayal Information</h4>
                    {portrayalTableFields.map(({ name, key }) => (
                        <div className="input-group input-group-sm mb-1" key={key}>
                            <label className="input-group-text" style={{ width: '40%' }}>
                                {name}
                            </label>
                            <input
                                type="text"
                                name={key}
                                className="form-control"
                                value={formData[key] || ''}
                                onChange={handleChange}
                                placeholder={name}
                            />
                        </div>
                    ))}
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

export default ColourToken;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import { PUT_CONTEXT_PARAMETER } from '../../api/api';  // Context Parameter에 대한 PUT API 경로

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

const ContextParameter = ({ data, onClose }) => {
    const [formData, setFormData] = useState(data || {});
    const [parameterType, setParameterType] = useState(data.parameterType || "");  // parameterType로 상태 변경
    const [defaultValue, setdefaultValue] = useState(data.defaultValue || "");  // defaultValue 상태

    useEffect(() => {
        if (data) {
            setFormData(data);
            setParameterType(data.parameterType || "");  // parameterType로 설정
            setdefaultValue(data.defaultValue || "");  // defaultValue 설정
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
                bodyData.parameterType = parameterType;  // parameterType를 formData에 추가
                bodyData.defaultValue = defaultValue;  // defaultValue 추가
                console.log('Sending PUT request with:', bodyData);

                // PUT 요청 보내기
                const response = await axios.put(PUT_CONTEXT_PARAMETER, bodyData, {
                    params: {
                        item_id: _id.encrypted_data,
                        item_iv: _id.iv,
                    },
                });

                // 응답 코드 확인
                if (response.status >= 200 && response.status < 300) {
                    alert('Update successful');
                    onClose();
                    window.location.reload();  // 페이지 새로고침 (옵션)
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
            <h2>Update Context Parameter</h2>
            <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
                <div>
                    <h4>Update Portrayal Information</h4>
                    <div className="input-group input-group-sm mb-2" style={{ marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                            Parameter Type
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            name="parameterType"  // parameterType으로 처리
                            value={parameterType}
                            onChange={(e) => setParameterType(e.target.value)}  // parameterType 상태 변경
                        />
                    </div>  
                    <div className="input-group input-group-sm mb-2" style={{ marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                            Default Value
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            name="defaultValue"  // defaultValue로 처리
                            value={defaultValue}
                            onChange={(e) => setdefaultValue(e.target.value)}  // defaultValue 상태 변경
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

export default ContextParameter;

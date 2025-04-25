import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {PUT_COMPLEX_ATTRIBUTE} from '../../api';


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


const CompUpdate = ({ TagItemType, data, onClose }) => {
    const [formData, setFormData] = useState(data || {})

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleSubmit = () => {
        // 사용자에게 확인 메시지 띄우기
        const userConfirmed = window.confirm('Are you sure you want to update this item?');
    
        if (userConfirmed) {
            // _id와 attributeId 속성 제거
            const { _id, subAttribute, ...filteredData } = formData;
    
            console.log('Sending PUT request with:', filteredData);
            // 여기에 axios PUT 요청을 추가합니다.
            axios.put(PUT_COMPLEX_ATTRIBUTE, filteredData, {
                params: {
                    item_id: _id.encrypted_data,
                    item_iv: _id.iv,
                }
            })
            .then(response => {
                alert('Update successful');
                onClose();
                window.location.reload(); // 페이지 새로고침
            })
            .catch(error => {
                console.error('Error updating:', error);
            });
        } else {
            console.log('Update canceled by user.');
        }
    };

    return (
        <div>
            <div>
                <h4>Update Complex Attribute</h4>
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
                                disabled={key === 'itemType'} // itemType 필드 비활성화
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
                                disabled={key === 'itemType'} // itemType 필드 비활성화
                                onChange={handleChange}
                                placeholder={name}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="text-end mt-3">
                <button 
                    type="submit" 
                    className="btn btn-primary btn-sm" 
                    onClick={handleSubmit}
                >
                    Update
                </button>
            </div>
        </div>
    );
}
export default CompUpdate;
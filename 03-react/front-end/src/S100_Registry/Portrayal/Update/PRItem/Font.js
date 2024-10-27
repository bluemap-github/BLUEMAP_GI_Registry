import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import FileUpdate from './FileUpdate';
import Cookies from 'js-cookie';
import { PUT_FONT } from '../../api/api';


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

const Font = ({ data, onClose }) => {
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

    const handleSubmit = async () => {
        const confirmed = window.confirm("Are you sure you want to update this item?");
    
        if (confirmed) {
            try {
                console.log('formData', formData);
                const { _id, ...bodyData } = formData;  // formData에서 _id를 분리
    
                // 이미 만들어진 formData 객체가 있다고 가정
                const form = new FormData();  // 새로운 FormData 객체 생성
                
                // combinedData를 FormData로 변환
                Object.keys(bodyData).forEach(key => {
                    const value = bodyData[key];
                    if (value instanceof File) {
                        form.append(key, value); // 파일 처리
                    } else if (typeof value === 'object' && value !== null) {
                        form.append(key, JSON.stringify(value)); // JSON 데이터 처리
                    } else {
                        form.append(key, value); // 일반 텍스트 데이터 처리
                    }
                });
    
                console.log('form', form);
    
                // PUT 요청 보내기
                const response = await axios.put(PUT_FONT, form, {
                    params: {
                        item_id: _id.encrypted_data,
                        item_iv: _id.iv,
                        regi_uri: Cookies.get('REGISTRY_URI'),  // 쿠키에서 REGISTRY_URI 가져오기
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',  // 헤더 설정
                    }
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
    
    const onFileChange = (key, file) => {
        const updatedFormData = { ...formData, [key]: file };
        setFormData(updatedFormData);
        // onFormSubmit(updatedFormData); // 부모로 전달
      };

    return (
        <div>
            <h2>Update Colour Palette</h2>
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
                    
                    {/* 폰트 파일 선택 필드 추가 */}
                    <FileUpdate fileTag={"Font"} data={data} onFormSubmit={(file) => onFileChange('fontFile', file)}/>
                    
                    
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

export default Font;

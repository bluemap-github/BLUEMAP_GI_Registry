import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import ImageUpdate from './ImageUpdate';
import FileUpdate from './FileUpdate';
import Cookies from 'js-cookie';


import {
    PUT_SYMBOL,
    PUT_LINE_STYLE,
    PUT_AREA_FILL,
    PUT_PIXMAP
} from '../../api/api';

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

const VisualItem = ({ TagItemType, data, onClose }) => {
    const [formData, setFormData] = useState(data || {});

    // TagItemType에 따라 사용할 PUT API를 결정하는 함수
    const getApiUrl = (TagItemType) => {
        switch (TagItemType) {
            case 'Symbol':
                return PUT_SYMBOL;
            case 'LineStyle':
                return PUT_LINE_STYLE;
            case 'AreaFill':
                return PUT_AREA_FILL;
            case 'Pixmap':
                return PUT_PIXMAP;
            default:
                throw new Error('Unknown TagItemType');
        }
    };

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
        console.log('formData', formData);
        const confirmed = window.confirm("Are you sure you want to update this item?");
    
        if (confirmed) {
            try {
                
                const { _id, ...bodyData } = formData;  // formData에서 _id를 분리

                const form = new FormData();  // FormData 객체 생성
                
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

                const apiUrl = getApiUrl(TagItemType);  // TagItemType에 따라 API URL 결정
                console.log('Sending PUT request to:', apiUrl);

                const response = await axios.put(apiUrl, form, {
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
    
    const onFileChange = (fileTag, file, typeTag, fileType) => {
        const updatedFormData = { ...formData, [fileTag]: file, [typeTag]: fileType };
        setFormData(updatedFormData);
    };

    const onSVGChange = (file) => {
        const updatedFormData = { ...formData, "itemDetail": file };
        setFormData(updatedFormData);
    };

    return (
        <div>
            <h2>Update {TagItemType}</h2>
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
                    <FileUpdate fileTag="SVG" data={data} onFormSubmit={(file) => onSVGChange(file)} />
                    <ImageUpdate fileTag="Image" data={data} onFormSubmit={(fileTag, file, typeTag, fileType) => onFileChange(fileTag, file, typeTag, fileType)} />
                    
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

export default VisualItem;

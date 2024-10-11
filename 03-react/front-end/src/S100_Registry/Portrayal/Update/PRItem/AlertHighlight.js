import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import { PUT_ALERT_HIGHLIGHT } from '../../api/api';

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

const portrayalTableFields = [
    { name: 'XML ID', key: 'xmlID' }, 
    { name: 'Style', key: 'style', inputType: 'select', options: ['AlamHighlight', 'CautionHighlight'] },
];

const AlertHighlight = ({ data, onClose }) => {
    const [formData, setFormData] = useState(data || {});
    const [optional, setOptional] = useState(data.optional || false); // optional 필드 상태 추가
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (data) {
            setFormData(data); // 초기 데이터 설정
            setOptional(data.optional || false); // optional 상태 설정
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleOptionalChange = (e) => {
        const isChecked = e.target.checked;
        setOptional(isChecked); // optional 상태 업데이트
        setFormData((prevData) => ({
            ...prevData,
            optional: isChecked, // optional 필드를 formData에 추가
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
                const response = await axios.put(PUT_ALERT_HIGHLIGHT, bodyData, {
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
            <h2>Update Alert Highlight</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div>
                    <h4>Update Portrayal Information</h4>
                    {portrayalTableFields.map(({ name, key, inputType = 'text', options }) => (
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
                    
                    {/* Optional 필드 추가 */}
                    <div className="input-group input-group-sm mb-2" style={{ marginRight: '10px' }}>
                        <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                            Optional
                        </span>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="optional"
                            checked={optional}  // 체크박스 상태 반영
                            onChange={handleOptionalChange} // onChange 핸들러 적용
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
                <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </div>
        </div>
    );
};

export default AlertHighlight;

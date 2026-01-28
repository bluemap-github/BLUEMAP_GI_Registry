import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NLSUpdate from './NLSUpdate';
import { PUT_ALERT_MESSAGE } from '../../api/api';

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

const AlertMessage = ({ data, onClose }) => {
    const [formData, setFormData] = useState(data || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        if (!confirmed) return;

        setLoading(true);
        setError(null);

        try {
            const { _id, ...bodyData } = formData;
            const response = await axios.put(PUT_ALERT_MESSAGE, bodyData, {
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
                setError('Failed to update: Unexpected response');
            }
        } catch (err) {
            setError(`Failed to update: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Update Alert Message</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 출력 */}
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
                    <NLSUpdate
                        itemType={data.itemType}
                        tagName={"Description"}
                        initialData={data.description || []}
                        onFormSubmit={(addNLS) => onNLSChange("description", addNLS)}
                    />
                    <NLSUpdate
                        itemType={data.itemType}
                        tagName={"Text"}
                        initialData={data.text || []}  // 추가: text 데이터가 initialData로 전달됨
                        onFormSubmit={(addNLS) => onNLSChange("text", addNLS)}  // text 업데이트 처리
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
                <button type="submit" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </div>
        </div>
    );
};

export default AlertMessage;

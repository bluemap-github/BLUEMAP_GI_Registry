import React, { useState } from 'react';
import NLSUpdate from '../../Update/PRItem/NLSUpdate';
import axios from 'axios';
import {PUT_ALERT} from '../../api/api';

const conceptTableFields = [
    { name: 'Name', key: 'name' },
    { name: 'Item Type', key: 'itemType', disabled: true },
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
    { name: 'XML ID', key: 'xmlID' },
];

const preProcessingData = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const extractedId = { ...data._id };
    delete data._id;

    const reMakingRouteMonitor = [];
    const reMakingRoutePlan = [];

    if (data.routeMonitor) {
        for (const monitor of data.routeMonitor) {
            if (monitor && monitor._id) {
                reMakingRouteMonitor.push(monitor._id);
            }
        }
    }

    if (data.routePlan) {
        for (const plan of data.routePlan) {
            if (plan && plan._id) {
                reMakingRoutePlan.push(plan._id);
            }
        }
    }

    data.routeMonitor = reMakingRouteMonitor;
    data.routePlan = reMakingRoutePlan;

    if (!data.description) {
        data.description = [];
    }

    return { data, extractedId };
};

const UpdatePRAlertItem = ({ data, onClose }) => {
    const { data: preProcessedData, extractedId } = preProcessingData(data);
    const [formData, setFormData] = useState(preProcessedData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDescriptionChange = (updatedDescription) => {
        setFormData((prevData) => ({
            ...prevData,
            description: updatedDescription,
        }));
    };

    const submitAlertItem = async () => {
        const confirmed = window.confirm('Are you sure you want to update this item?');
        if (confirmed) {
            try {
                const bodyData = formData;
                console.log('Sending PUT request with:', bodyData);

                // PUT 요청 보내기
                const response = await axios.put(PUT_ALERT, bodyData, {
                    params: {
                        item_id: extractedId.encrypted_data,
                        item_iv: extractedId.iv,
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
            }
            catch (error) {
                console.error('Update failed:', error.response || error.message);
                alert(`Failed to update: ${error.response?.data?.message || error.message}`);
            }
        }
    }
    return (
        <div>
            <h3>Processed Data:</h3>
            {/* <pre>{JSON.stringify(extractedId, null, 2)}</pre> */}
            {conceptTableFields.map(({ name, key, inputType = 'text', options, disabled = false }) => (
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
                            disabled={disabled}  // 비활성화 처리
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
                            disabled={disabled}  // 비활성화 처리
                        />
                    )}
                </div>
            ))}

            {/* Pass description and handle description updates */}
            <NLSUpdate 
                initialData={formData.description || []}  // undefined일 경우 빈 배열로 처리
                onFormSubmit={handleDescriptionChange} 
                tagName="Description"
            />

            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary btn-sm" onClick={submitAlertItem}>
                    Update
                </button>
            </div>
        </div>
    );
};

export default UpdatePRAlertItem;

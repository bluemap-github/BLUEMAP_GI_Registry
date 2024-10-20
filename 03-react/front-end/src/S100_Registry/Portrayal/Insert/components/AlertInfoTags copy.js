import React, { useState } from 'react';

const AlertInfoTags = ({ tagName, onFormSubmit }) => {
    const priorityType = ['alam', 'warning', 'caution', 'indication'];

    // 템플릿을 배열로 수정
    const alertInfoTemplate = {
        priority: [
            {
                priority: '',
                default: false,
                optional: false,
            }
        ]
    };

    const [alertInfoList, setAlertInfoList] = useState([alertInfoTemplate]);

    // Handle priority change (배열 내 특정 항목 업데이트)
    const handleChange = (alertIndex, priorityIndex, e) => {
        const updatedAlertInfo = [...alertInfoList];
        updatedAlertInfo[alertIndex].priority[priorityIndex].priority = e.target.value;
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo);
    };

    // Handle default checkbox change (배열 내 특정 항목 업데이트)
    const handleDefault = (alertIndex, priorityIndex, e) => {
        const updatedAlertInfo = [...alertInfoList];
        updatedAlertInfo[alertIndex].priority[priorityIndex].default = e.target.checked;
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo);
    };

    // Handle optional checkbox change (배열 내 특정 항목 업데이트)
    const handleOptional = (alertIndex, priorityIndex, e) => {
        const updatedAlertInfo = [...alertInfoList];
        updatedAlertInfo[alertIndex].priority[priorityIndex].optional = e.target.checked;
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo);
    };

    // Add new alert info
    const addAlertInfo = () => {
        setAlertInfoList([...alertInfoList, alertInfoTemplate]);
    };

    // Remove alert info
    const removeAlertInfo = (index) => {
        const updatedAlertInfo = alertInfoList.filter((_, i) => i !== index);
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo);
    };

    return (
        <div style={{ padding: '10px', backgroundColor: 'white' }} className='mb-4'>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: '8px' }}>
                <h5>{tagName}</h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={addAlertInfo} style={{ display: 'flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                    </svg>
                    <div style={{ marginLeft: '8px' }}>Add Alert Info</div>
                </button>
            </div>

            {alertInfoList.map((alertInfo, alertIndex) => (
                <div key={alertIndex}>
                    {alertInfo.priority.map((priorityInfo, priorityIndex) => (
                        <div key={priorityIndex} className="input-group input-group-sm mb-2">
                            <span className="input-group-text" style={{ width: '10%', fontWeight: 'bold' }}>Priority</span>
                            <select
                                className="form-select"
                                value={priorityInfo.priority || ''}
                                onChange={(e) => handleChange(alertIndex, priorityIndex, e)}
                            >
                                <option value="" disabled>Select Priority</option>
                                {priorityType.map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>

                            <span className="input-group-text" style={{ width: '30%' }}>
                                <span style={{ fontWeight: 'bold' }}>Default</span>
                                <input
                                    style={{ marginLeft: '15px' }}
                                    onChange={(e) => handleDefault(alertIndex, priorityIndex, e)}
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    checked={priorityInfo.default || false}
                                />
                                <label style={{ marginLeft: '10px' }}>
                                    {priorityInfo.default ? 'Enabled' : 'Disabled'}
                                </label>
                            </span>

                            <span className="input-group-text" style={{ width: '30%' }}>
                                <span style={{ fontWeight: 'bold' }}>Optional</span>
                                <input
                                    style={{ marginLeft: '15px' }}
                                    onChange={(e) => handleOptional(alertIndex, priorityIndex, e)}
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    checked={priorityInfo.optional || false}
                                />
                                <label style={{ marginLeft: '10px' }}>
                                    {priorityInfo.optional ? 'Enabled' : 'Disabled'}
                                </label>
                            </span>

                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeAlertInfo(alertIndex)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AlertInfoTags;

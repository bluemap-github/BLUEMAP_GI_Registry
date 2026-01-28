import React, { useState, useEffect } from 'react';

const AlertInfoUpdate = ({ tagName, onFormSubmit, initialData }) => {
    const priorityType = ['alam', 'warning', 'caution', 'indication'];

    // 기본 템플릿 설정
    const alertInfoTemplate = {
        priority: [
            {
                priority: 'alam',  // 기본값 설정
                default: false,
                optional: false,
            }
        ]
    };

    // initialData가 없으면 기본 템플릿으로 초기화
    const [alertInfoList, setAlertInfoList] = useState(initialData.length > 0 ? initialData : [alertInfoTemplate]);

    // Handle priority change
    const handleChange = (alertIndex, priorityIndex, e) => {
        const updatedAlertInfo = [...alertInfoList];
        updatedAlertInfo[alertIndex].priority[priorityIndex].priority = e.target.value || 'alam'; // 빈 값 방지
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo); // 부모 컴포넌트로 업데이트된 데이터 전달
    };

    // Handle default checkbox change
    const handleDefault = (alertIndex, priorityIndex, e) => {
        const updatedAlertInfo = [...alertInfoList];
        updatedAlertInfo[alertIndex].priority[priorityIndex].default = e.target.checked;
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo);
    };

    // Handle optional checkbox change
    const handleOptional = (alertIndex, priorityIndex, e) => {
        const updatedAlertInfo = [...alertInfoList];
        updatedAlertInfo[alertIndex].priority[priorityIndex].optional = e.target.checked;
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo);
    };

    // Add new alert info
    const addAlertInfo = () => {
        const newInfo = { ...alertInfoTemplate };
        const updatedList = [...alertInfoList, newInfo];
        setAlertInfoList(updatedList);
        onFormSubmit(updatedList);
    };

    // Remove alert info
    const removeAlertInfo = (index) => {
        const updatedAlertInfo = alertInfoList.filter((_, i) => i !== index);
        setAlertInfoList(updatedAlertInfo);
        onFormSubmit(updatedAlertInfo);
    };

    // initialData가 변경되면 상태 업데이트
    useEffect(() => {
        if (initialData) {
            setAlertInfoList(initialData);
        }
    }, [initialData]);

    return (
        <div style={{ padding: '10px', backgroundColor: 'white', maxHeight: '200px', overflowY: 'auto' }} className='mb-4'>
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
                                value={priorityInfo.priority || 'alam'}
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

export default AlertInfoUpdate;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PUT_MANAGEMENT_INFO } from '../api/api';

const PRMngUpdateModal = ({ IsOpened, onClose, data }) => {
    // 데이터가 변경될 때마다 formData가 업데이트되도록 useEffect 사용
    const [formData, setFormData] = useState(data || {});

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const tableFields = [
        { name: 'Proposal Type', key: 'proposalType', inputType: 'select', options: ['addition', 'clarification', 'supersession', 'retirement'] },
        { name: 'Submitting Organisation', key: 'submittingOrganisation' },
        { name: 'Proposed Change', key: 'proposedChange' },
        { name: 'Date Accepted', key: 'dateAccepted', inputType: 'date' },
        { name: 'Date Proposed', key: 'dateProposed', inputType: 'date' },
        { name: 'Date Amended', key: 'dateAmended', inputType: 'date' },
        { name: 'Proposal Status', key: 'proposalStatus', inputType: 'select', options: ['notYetDetermined', 'transferred', 'accepted', 'rejected', 'withdrawn', 'negotiation', 'appeal', 'appealTransferred', 'appealAccepted', 'appealRejected'] },
        { name: 'Control Body Notes', key: 'controlBodyNotes' },
    ];

    // 입력값 변경 시 호출되는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const callUpdate = async () => {
        
        const confirmSubmit = window.confirm("Are you sure you want to add this Management information?");
        if (!confirmSubmit) return; // Exit if the user cancels
        try {
            // _id는 파라미터로 추출
            const { _id, ...bodyData } = formData;
            // axios 요청
            await axios.put(PUT_MANAGEMENT_INFO, bodyData, {
                params: {
                    item_id: _id.encrypted_data,
                    item_iv: _id.iv,
                }
            });

            alert('Update successful');
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Update failed:', error);
            alert('Update failed');
        }
    };

    // 모달이 열리지 않았으면 null 반환
    if (!IsOpened) {
        return null;
    }

    return (
        <div className="modal-style">
            <div className="modal-content-style">
                <div className='text-end'>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                <div>
                    <h4>Management Info Update</h4>
                    <form>
                        {tableFields.map(({ name, key, inputType = 'text', options }) => (
                            <div className="input-group input-group-sm mb-1" key={key}>
                                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                                    {name}
                                </span>
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
                                        placeholder={`Enter ${name}`}
                                        value={formData[key] || ''}
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                        ))}
                    </form>
                </div>
                <div className='text-end'>
                    <button className="btn btn-secondary btn-sm" onClick={callUpdate}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default PRMngUpdateModal;

import React, { useState } from 'react'; 
import { PUT_ALERT, PUT_ALERT_INFO } from '../../api/api';
import axios from 'axios';

const priorityType = ['alarm', 'warning', 'caution', 'indication'];

const UpdateAlertInfoUpdate = ({ data, page, onClose }) => {
    const [alertData, setAlertData] = useState(data[page] || {}); // data[page] 전체를 초기값으로 설정

    // priority 배열이 없을 경우를 대비한 기본값 처리
    const priorityArray = alertData.priority || [];

    // 폼에서 변경 사항 처리
    const handlePriorityChange = (index, field, value) => {
        const updatedPriorityArray = [...priorityArray];
        updatedPriorityArray[index][field] = value;

        // alertData의 priority 필드 업데이트
        setAlertData({
            ...alertData,
            priority: updatedPriorityArray,
        });
    };

    // 항목 추가 함수
    const handleAddPriority = () => {
        const newPriorityItem = {
            priority: '', // 기본값은 비어있는 상태로 설정
            default: false,
            optional: false,
        };
        setAlertData({
            ...alertData,
            priority: [...priorityArray, newPriorityItem],
        });
    };

    // 항목 제거 함수
    const handleRemovePriority = (index) => {
        const updatedPriorityArray = priorityArray.filter((_, i) => i !== index);
        setAlertData({
            ...alertData,
            priority: updatedPriorityArray,
        });
    };

    const fetchPUTAlertInfo = async () => {
        try {
            // PUT 요청을 보내기 전에 alertData를 전처리
            const { _id, ...processedAlertData } = alertData; // _id를 추출하고 나머지 데이터를 processedAlertData에 저장
    
            // PUT 요청 보내기
            const response = await axios.put(PUT_ALERT_INFO, processedAlertData, {
                params: { item_id: _id },
            });
            console.log('PUT AlertInfo Response:', response.data);
    
            // 성공적으로 PUT 요청이 완료되면 onClose 호출
            onClose();
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error('Error updating AlertInfo:', error);
        }
    };
    
    return (
        <div>
            <pre>{JSON.stringify(alertData, null, 2)}</pre>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3>Update AlertInfo</h3>
                <button type="button" className="btn btn-outline-secondary" onClick={handleAddPriority}>
                    Add AlertInfo
                </button>
            </div>
            {priorityArray.map((priorityItem, index) => (
                <div key={index} className="input-group mt-3">
                    <span className="input-group-text" style={{ width: '10%', fontWeight: 'bold' }}>
                        Priority
                    </span>
                    <select
                        className="form-select"
                        value={priorityItem.priority} // 선택된 값을 설정
                        onChange={(e) => handlePriorityChange(index, 'priority', e.target.value)} // 값 변경 처리
                    >
                        <option value="" disabled>
                            Select Priority
                        </option>
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
                            className="form-check-input mt-0"
                            type="checkbox"
                            checked={priorityItem.default} // 체크박스 상태 설정
                            onChange={(e) => handlePriorityChange(index, 'default', e.target.checked)} // 체크박스 값 변경 처리
                        />
                    </span>

                    <span className="input-group-text" style={{ width: '30%' }}>
                        <span style={{ fontWeight: 'bold' }}>Optional</span>
                        <input
                            style={{ marginLeft: '15px' }}
                            className="form-check-input mt-0"
                            type="checkbox"
                            checked={priorityItem.optional} // 체크박스 상태 설정
                            onChange={(e) => handlePriorityChange(index, 'optional', e.target.checked)} // 체크박스 값 변경 처리
                        />
                    </span>

                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleRemovePriority(index)} // 항목 제거 처리
                    >
                        Remove
                    </button>
                </div>
            ))}

            <div className='text-end'>
                <button className="btn btn-primary mt-3" onClick={fetchPUTAlertInfo}>
                    Update AlertInfo
                </button>
            </div>
        </div>
    );
};

export default UpdateAlertInfoUpdate;

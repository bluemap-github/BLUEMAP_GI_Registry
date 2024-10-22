import React, { useState } from 'react';
import { POST_MESSAGE_ASSOCIATION, POST_HIGHLIGHT_ASSOCIATION, POST_ALERT_INFO, PUT_ALERT} from '../../api/api';
import DynamicAssociationForm from '../../Insert/components/DynamicAssociationForm';
import Cookies from 'js-cookie';
import axios from 'axios';
const regi_uri = Cookies.get('REGISTRY_URI');
const priorityType = ['alarm', 'warning', 'caution', 'indication'];
const Association = {
    'msg' : POST_MESSAGE_ASSOCIATION,
    'highlight' : POST_HIGHLIGHT_ASSOCIATION
}
const preProcessingData = (data) => {
    // 데이터의 깊은 복사본을 생성
    data = JSON.parse(JSON.stringify(data));

    // _id 필드를 추출하여 별도의 변수에 저장하고, 원본 객체에서는 삭제
    const extractedId = { ...data._id };
    delete data._id;  // _id 필드를 data에서 제거

    const reMakingRouteMonitor = [];
    const reMakingRoutePlan = [];

    // routeMonitor 배열을 순회하면서 _id 값만 추출하여 새로운 배열에 저장
    if (data.routeMonitor) {
        for (const monitor of data.routeMonitor) {
            if (monitor && monitor._id) {
                reMakingRouteMonitor.push(monitor._id);
            }
        }
    }

    // routePlan 배열을 순회하면서 _id 값만 추출하여 새로운 배열에 저장
    if (data.routePlan) {
        for (const plan of data.routePlan) {
            if (plan && plan._id) {
                reMakingRoutePlan.push(plan._id);
            }
        }
    }

    // 가공된 배열을 data에 다시 삽입
    data.routeMonitor = reMakingRouteMonitor;
    data.routePlan = reMakingRoutePlan;

    return { data, extractedId };  // 가공된 data와 추출된 _id 반환
}


const AddAlertInfoModal = ({ IsOpened, onClose, data, routeType }) => {
    const { data: preProcessedData, extractedId } = preProcessingData(data);
    const [alertInfo, setAlertInfo] = useState({
        priority: [
            {
                priority: '',
                default: false,
                optional: false,
            }
        ]
    });
    const [associationData, setAssociationData] = useState({});

    // 우선 폼이 열리지 않으면 아무것도 렌더링하지 않음
    if (!IsOpened) {
        return null;
    }

    // 변경사항 처리 함수
    const handleChange = (priorityIndex, field, value) => {
        const updatedPriority = [...alertInfo.priority];
        updatedPriority[priorityIndex][field] = value;
        setAlertInfo({ ...alertInfo, priority: updatedPriority });
    };

    const handleDefault = (priorityIndex, e) => {
        handleChange(priorityIndex, 'default', e.target.checked);
    };

    const handleOptional = (priorityIndex, e) => {
        handleChange(priorityIndex, 'optional', e.target.checked);
    };

    const removeAlertPriority = (priorityIndex) => {
        const updatedPriority = alertInfo.priority.filter((_, index) => index !== priorityIndex);
        setAlertInfo({ ...alertInfo, priority: updatedPriority });
    };

    const addAlertPriority = () => {
        const newPriority = {
            priority: '',
            default: false,
            optional: false,
        };
        setAlertInfo({
            ...alertInfo,
            priority: [...alertInfo.priority, newPriority]
        });
    };

    const handleAssociation = (associationData) => {
        setAssociationData(associationData);
    }

    const fetchAddAlertInfo = async () => {
        try {
            // 1. alertInfo를 POST 요청으로 보냅니다.
            console.log("Sending alertInfo:", alertInfo); // alertInfo 확인
            if (typeof alertInfo !== 'object') {
                throw new Error("alertInfo is not an object");
            }
            const alertResponse = await axios.post(POST_ALERT_INFO, alertInfo, {params: {regi_uri}});
            const responseId = alertResponse.data.inserted_id; // 받은 _id를 저장
            console.log(responseId);
            console.log(responseId);
            console.log(responseId);
            console.log(responseId);
            console.log("POST_ALERT_INFO Response:", alertResponse.data);
    
            // 2. associationData를 POST 요청으로 보냅니다.
            for (const key in associationData) {
                if (associationData.hasOwnProperty(key)) {
                    const postData = {
                        parent_id: responseId, // 받은 responseId를 parent_id로 설정
                        child_id: associationData[key], // associationData에서 데이터 사용
                    };
                    
                    console.log(`Sending association data for ${key}:`, postData); // associationData 확인
                    if (typeof postData !== 'object') {
                        throw new Error(`postData for ${key} is not an object`);
                    }
    
                    const associationApi = Association[key];
                    if (associationApi) {
                        const associationResponse = await axios.post(associationApi, postData);
                        console.log(`POST ${key} Association Response:`, associationResponse.data);
                    } else {
                        console.error(`No association API for key: ${key}`);
                    }
                }
            }
    
            // 3. preProcessedData의 routeType에 따라 routePlan 또는 routeMonitor에 responseId 추가
            console.log("Pre-processed data before adding responseId:", preProcessedData);
            if (routeType === 'routePlan') {
                preProcessedData.routePlan.push(responseId);
            } else if (routeType === 'routeMonitor') {
                preProcessedData.routeMonitor.push(responseId);
            }
            
            // 4. PUT 요청을 보내 preProcessedData 업데이트
            console.log("보낼꾸얌 preProcessedData:", preProcessedData);
            if (typeof preProcessedData !== 'object') {
                throw new Error("preProcessedData is not an object");
            }
            const putResponse = await axios.put(PUT_ALERT, preProcessedData, 
                { params: 
                    { 
                        item_id: extractedId.encrypted_data,
                        item_iv: extractedId.iv,
                     } });
            console.log("PUT_ALERT Response:", putResponse.data);
    
            // 성공적으로 완료된 경우 페이지 새로고침 또는 다른 처리
            window.location.reload();
        } catch (error) {
            console.error("Error in fetchAddAlertInfo:", error);
        }
    };
    
    

    return (
        <div className="modal-style">
            <div className="modal-content-style" style={{ width: '1000px', maxHeight: '700px', overflowY: 'auto' }}>
                {/* <pre>{JSON.stringify(alertInfo, null, 2)}</pre>
                <pre>{JSON.stringify(associationData, null, 2)}</pre> */}
                <pre>{JSON.stringify(preProcessedData, null, 2)}</pre>
                <div className='text-end'>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                <div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <h2>Add {routeType}</h2>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={addAlertPriority}
                        >
                            + Add Alert Priority
                        </button>
                    </div>

                    {/* Priority 항목들 렌더링 */}
                    {alertInfo.priority.map((priorityInfo, priorityIndex) => (
                        <div key={priorityIndex} className="input-group mt-3">
                            <span className="input-group-text" style={{ width: '10%', fontWeight: 'bold' }}>
                                Priority
                            </span>
                            <select
                                className="form-select"
                                value={priorityInfo.priority}
                                onChange={(e) => handleChange(priorityIndex, 'priority', e.target.value)}
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
                                    onChange={(e) => handleDefault(priorityIndex, e)}
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    checked={priorityInfo.default}
                                />
                                <label style={{ marginLeft: '10px' }}>
                                    {priorityInfo.default ? 'Enabled' : 'Disabled'}
                                </label>
                            </span>

                            <span className="input-group-text" style={{ width: '30%' }}>
                                <span style={{ fontWeight: 'bold' }}>Optional</span>
                                <input
                                    style={{ marginLeft: '15px' }}
                                    onChange={(e) => handleOptional(priorityIndex, e)}
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    checked={priorityInfo.optional}
                                />
                                <label style={{ marginLeft: '10px' }}>
                                    {priorityInfo.optional ? 'Enabled' : 'Disabled'}
                                </label>
                            </span>

                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeAlertPriority(priorityIndex)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <DynamicAssociationForm
                    itemType={'AlertInfo'}
                    onFormSubmit={handleAssociation}
                />
                <div className='text-end mt-4'>
                    <button className='btn btn-primary' onClick={fetchAddAlertInfo}>Add {routeType}</button>
                </div>
            </div>
        </div>
    );
};

export default AddAlertInfoModal;

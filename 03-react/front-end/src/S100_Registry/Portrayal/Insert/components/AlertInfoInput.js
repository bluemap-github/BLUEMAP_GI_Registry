import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DynamicAssociationForm from './DynamicAssociationForm';
import { 
    POST_SYMBOL_ASSOCIATION, POST_ICON_ASSOCIATION, POST_VIEWING_GROUP_ASSOCIATION, 
    POST_ITEM_SCHEMA_ASSOCIATION, POST_COLOUR_TOKEN_ASSOCIATION, POST_PALETTE_ASSOCIATION, 
    POST_DISPLAY_MODE_ASSOCIATION, POST_MESSAGE_ASSOCIATION, 
    POST_HIGHLIGHT_ASSOCIATION, POST_VALUE_ASSOCIATION,
    POST_ALERT_INFO
 } from '../../api/api';

// API 맵핑 객체
const associationPostAPI = {
    symbol: POST_SYMBOL_ASSOCIATION,
    icon: POST_ICON_ASSOCIATION,
    viewingGroup: POST_VIEWING_GROUP_ASSOCIATION,
    itemSchema: POST_ITEM_SCHEMA_ASSOCIATION,
    colourToken: POST_COLOUR_TOKEN_ASSOCIATION,
    palette: POST_PALETTE_ASSOCIATION,
    displayMode: POST_DISPLAY_MODE_ASSOCIATION,
    msg: POST_MESSAGE_ASSOCIATION,
    highlight: POST_HIGHLIGHT_ASSOCIATION,
    value: POST_VALUE_ASSOCIATION,
};

const priorityType = ['alarm', 'warning', 'caution', 'indication'];

const AlertInfoInput = ({ tagName, onFormSubmit }) => {
    const [allSets, setAllSets] = useState([
        {
            associationAndAPI: [], // 초기 세트 상태
            alertInfoList: [{ priority: [{ priority: '', default: false, optional: false }] }],
        },
    ]);

    const priorityType = ['alarm', 'warning', 'caution', 'indication'];

    // 새로운 세트를 추가하는 함수
    const addSet = () => {
        setAllSets((prevSets) => [
            ...prevSets,
            {
                associationAndAPI: [], // 새로운 세트의 초기 상태
                alertInfoList: [{ priority: [{ priority: '', default: false, optional: false }] }],
            },
        ]);
        onFormSubmit([...allSets, {
            associationAndAPI: [],
            alertInfoList: [{ priority: [{ priority: '', default: false, optional: false }] }],
        }]);
    };

    // 특정 세트를 삭제하는 함수
    const removeSet = (setIndex) => {
        setAllSets((prevSets) => {
            const updatedSets = prevSets.filter((_, index) => index !== setIndex);
            onFormSubmit(updatedSets);
            return updatedSets;
        });
    };

    // 특정 세트의 alertInfoList를 업데이트하는 함수
    const updateAlertInfoList = (setIndex, alertInfoList) => {
        setAllSets((prevSets) => {
            const updatedSets = [...prevSets];
            updatedSets[setIndex].alertInfoList = alertInfoList;
            onFormSubmit(updatedSets);
            return updatedSets;
        });
    };

    // 특정 세트의 associationAndAPI를 업데이트하는 함수
    const updateAssociationAndAPI = (setIndex, associationAndAPI) => {
        setAllSets((prevSets) => {
            const updatedSets = [...prevSets];
            updatedSets[setIndex].associationAndAPI = associationAndAPI;
            onFormSubmit(updatedSets);
            return updatedSets;
        });
    };

    // Handle priority change
    const handleChange = (setIndex, alertIndex, priorityIndex, e) => {
        const updatedAlertInfoList = [...allSets[setIndex].alertInfoList];
        updatedAlertInfoList[alertIndex].priority[priorityIndex].priority = e.target.value;
        updateAlertInfoList(setIndex, updatedAlertInfoList);
    };

    // Handle default checkbox change
    const handleDefault = (setIndex, alertIndex, priorityIndex, e) => {
        const updatedAlertInfoList = [...allSets[setIndex].alertInfoList];
        updatedAlertInfoList[alertIndex].priority[priorityIndex].default = e.target.checked;
        updateAlertInfoList(setIndex, updatedAlertInfoList);
    };

    // Handle optional checkbox change
    const handleOptional = (setIndex, alertIndex, priorityIndex, e) => {
        const updatedAlertInfoList = [...allSets[setIndex].alertInfoList];
        updatedAlertInfoList[alertIndex].priority[priorityIndex].optional = e.target.checked;
        updateAlertInfoList(setIndex, updatedAlertInfoList);
    };

    // Add new alert priority
    const addAlertPriority = (setIndex, alertIndex) => {
        const updatedAlertInfoList = [...allSets[setIndex].alertInfoList];
        updatedAlertInfoList[alertIndex].priority.push({ priority: '', default: false, optional: false });
        updateAlertInfoList(setIndex, updatedAlertInfoList);
    };

    // Remove specific priority info
    const removeAlertPriority = (setIndex, alertIndex, priorityIndex) => {
        const updatedAlertInfoList = [...allSets[setIndex].alertInfoList];
        updatedAlertInfoList[alertIndex].priority = updatedAlertInfoList[alertIndex].priority.filter(
            (_, pIndex) => pIndex !== priorityIndex
        );
        updateAlertInfoList(setIndex, updatedAlertInfoList);
    };

    const handleAssociation = (setIndex, updatedData) => {
    
        // updatedData를 JSON으로 파싱
        const parsedData = Object.keys(updatedData).reduce((acc, key) => {
            try {
                acc[key] = JSON.parse(updatedData[key]); // JSON 문자열을 객체로 변환
            } catch (e) {
                acc[key] = updatedData[key]; // JSON이 아니면 그대로 유지
            }
            return acc;
        }, {});
    
        // 현재 세트의 associationAndAPI 가져오기
        const updatedAssociationAndAPI = [...allSets[setIndex].associationAndAPI];
    
        // parsedData를 updatedAssociationAndAPI에 반영하는 로직
        Object.keys(parsedData).forEach((key) => {
            const value = parsedData[key];
    
            // associationPostAPI에서 해당 key에 대한 API 주소 가져오기
            const apiKey = associationPostAPI[key];
    
            if (apiKey) {
                // 이미 존재하는 항목인지 확인
                const existingIndex = updatedAssociationAndAPI.findIndex((item) => item.key === apiKey);
    
                if (existingIndex > -1) {
                    // 이미 존재하는 항목을 업데이트
                    updatedAssociationAndAPI[existingIndex] = { key: apiKey, value };
                } else {
                    // 새로운 항목을 추가
                    updatedAssociationAndAPI.push({ key: apiKey, value });
                }
            } else {
                console.error(`API not found for key: ${key}`);
            }
        });
    
        // associationAndAPI 업데이트
        updateAssociationAndAPI(setIndex, updatedAssociationAndAPI);
    };
    
    

    const indexLog = (setIndex) => {
        console.log(setIndex, "??");
        console.log(allSets[setIndex]);
    };
    const veiwAllLog = () => {
        console.log(allSets);
    }


    return (
        <div style={{ backgroundColor: 'white' }} className="mb-2 p-3">
            <div>
                {/* <button onClick={veiwAllLog}>viewall</button> */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h5>{tagName}</h5>
                    <button id="addSets" className="btn btn-outline-secondary btn-sm" onClick={addSet}>
                        + Add Set
                    </button>
                </div>

                {allSets.map((set, setIndex) => (
                    <div key={setIndex} id="AlertInfoTags" className="card p-3 mt-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5>{tagName} Set {setIndex + 1}</h5>
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeSet(setIndex)}
                                disabled={allSets.length === 1} // 최소 1개는 유지
                            >
                                Remove Set
                            </button>
                        </div>
                        {/* <button onClick={() => indexLog(setIndex)}>인덱스별 로그</button> */}
                        <div style={{ backgroundColor: 'white' }}>
                            {set.alertInfoList.map((alertInfo, alertIndex) => (
                                <div key={alertIndex}>
                                    <div className="text-end">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => addAlertPriority(setIndex, alertIndex)}
                                        >
                                            + Add Alert Information
                                        </button>
                                    </div>
                                    {alertInfo.priority.map((priorityInfo, priorityIndex) => (
                                        <div key={priorityIndex} className="input-group mt-3">
                                            <span 
                                                className={`input-group-text ${priorityInfo.priority ? '' : 'tag-invalid'}`}
                                                style={{ width: '10%', fontWeight: 'bold' }}>
                                                Priority
                                            </span>
                                            <select
                                                className={`form-select ${priorityInfo.priority ? '' : 'tag-invalid'} `}
                                                value={priorityInfo.priority || ''}
                                                onChange={(e) => handleChange(setIndex, alertIndex, priorityIndex, e)}
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
                                                    onChange={(e) => handleDefault(setIndex, alertIndex, priorityIndex, e)}
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
                                                    onChange={(e) => handleOptional(setIndex, alertIndex, priorityIndex, e)}
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
                                                onClick={() => removeAlertPriority(setIndex, alertIndex, priorityIndex)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* DynamicAssociationForm을 세트마다 렌더링 */}
                            <DynamicAssociationForm
                                itemType={'AlertInfo'}
                                onFormSubmit={(data) => handleAssociation(setIndex, data)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertInfoInput;




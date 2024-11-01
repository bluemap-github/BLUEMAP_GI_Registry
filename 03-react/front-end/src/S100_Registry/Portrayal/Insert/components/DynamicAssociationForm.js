import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
    GET_SYMBOL_LIST,
    GET_COLOUR_TOKEN_LIST,
    GET_PALETTE_ITEM_LIST,
    GET_COLOUR_PALETTE_LIST,
    GET_DISPLAY_MODE_LIST,
    GET_VIEWING_GROUP_LAYER_LIST,
    GET_VIEWING_GROUP_LIST,
    GET_ALERT_MESSAGE_LIST,
    GET_ITEM_SCHEMA_LIST,
    GET_ALERT_HIGHLIGHT_LIST
} from '../../api/api';  // Import the API URLs here

import FullScreenLoadingSpinner from '../../../../Common/FullScreenLoadingSpinner';
const callAPI = {
    'Symbol': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false
        }

    ],
    'LineStyle': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        },
        { 
            name: 'Symbol List', 
            associationName: 'symbol',
            required: false,
            apiCall: GET_SYMBOL_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false
        }
    ],
    'AreaFill': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        },
        { 
            name: 'Symbol List', 
            associationName: 'symbol',
            required: false,
            apiCall: GET_SYMBOL_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false
        }
    ],
    'Pixmap': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false
        }
    ],
    'ColourToken': [
        { 
            name: 'Palette Item List', 
            associationName: 'value',
            required: true,
            apiCall: GET_PALETTE_ITEM_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        }
    ],
    'PaletteItem': [
        { 
            name: 'Colour Palette List', 
            associationName: 'palette',
            required: true,
            apiCall: GET_COLOUR_PALETTE_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        }
    ],
    'ViewingGroupLayer': [
        { 
            name: 'Display Mode List', 
            associationName: 'displayMode',
            required: false,
            apiCall: GET_DISPLAY_MODE_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        }
    ],
    'ViewingGroup': [
        { 
            name: 'Viewing Group Layer List', 
            associationName: 'viewingGroup',
            required: false,
            apiCall: GET_VIEWING_GROUP_LAYER_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        }
    ],
    'AlertHighlight': [
        { 
            name: 'Connect With Alert Message', 
            associationName: 'msg',
            required: false,
            apiCall: GET_ALERT_MESSAGE_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false 
        },
        { 
            name: 'Viewing Group List', 
            associationName: 'viewingGroup',
            required: true,
            apiCall: GET_VIEWING_GROUP_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : true 
        }
    ],
    'AlertMessage': [
        { 
            name: 'Symbol List', 
            associationName: 'icon',
            required: false,
            apiCall: GET_SYMBOL_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false 
        }
    ],
    'AlertInfo': [
        { 
            name: 'Alert Message List', 
            associationName: 'msg',
            required: true,
            apiCall: GET_ALERT_MESSAGE_LIST, 
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false 
        },
        { 
            name: 'Connect With Alert Highlight', 
            associationName: 'highlight',
            required: false,
            apiCall: GET_ALERT_HIGHLIGHT_LIST,
            defaultData: { parent_id: "", child_id: "" },
            isPlural : false
        }
    ]

};

const DynamicAssociationForm = ({ itemType, onFormSubmit }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [inputFields, setInputFields] = useState({}); // 각 어소시에이션별 입력 필드를 관리하기 위한 객체

    const regi_uri = Cookies.get('REGISTRY_URI');

    useEffect(() => {
        if (itemType && callAPI[itemType]) {
            setLoading(true);

            const fetchData = async () => {
                try {
                    // callAPI[itemType] 배열의 모든 apiCall을 실행
                    const apiPromises = callAPI[itemType].map((item) => {
                        return axios.get(item.apiCall, { params: {
                            regi_uri,
                            search_term: "",
                            status : "",
                            category : "",
                            sort_key: "name",
                            sort_direction: "ascending",
                            page: 1,
                            page_size: 1000,
                          }, });
                    });

                    // 모든 API 요청이 완료될 때까지 대기
                    const responses = await Promise.all(apiPromises);

                    // 응답 데이터를 어소시에이션 이름에 맞게 저장
                    const dataMap = {};
                    responses.forEach((response, index) => {
                        const item = callAPI[itemType][index];
                        dataMap[item.associationName] = response.data.data;
                    });

                    setData(dataMap);

                    // 각 어소시에이션별로 입력 필드 초기화
                    const initialInputFields = {};
                    callAPI[itemType].forEach(item => {
                        if (item.isPlural) {
                            initialInputFields[item.associationName] = [{}]; // 다중 입력 필드
                        } else {
                            initialInputFields[item.associationName] = [{}]; // 단일 입력 필드
                        }
                    });
                    setInputFields(initialInputFields);

                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [itemType, regi_uri]);

    const updateFields = (associationName, index, value) => {
        const [encrypted_data, iv] = value.split(",");
    
        setInputFields(prevFields => {
            const updatedFields = { ...prevFields };
    
            if (callAPI[itemType].find(item => item.associationName === associationName).isPlural) {
                const associationFields = [...updatedFields[associationName]];
                associationFields[index] = { encrypted_data, iv };
                updatedFields[associationName] = associationFields;
            } else {
                updatedFields[associationName] = { encrypted_data, iv };
            }
    
            // 상태 업데이트 후 데이터를 전달하는 함수 호출
            submitUpdatedData(updatedFields);
    
            return updatedFields;
        });
    };
    
    const submitUpdatedData = (updatedFields) => {
        setTimeout(() => {
            const updatedData = {};
            Object.keys(updatedFields).forEach(assocName => {
                updatedData[assocName] = updatedFields[assocName];
            });
    
            onFormSubmit(updatedData);  // 상위 컴포넌트에 데이터 전송
        }, 0);  // 렌더링 이후에 처리
    };
    
    // handleSelectChange에서 updateFields 호출
    const handleSelectChange = (associationName, index, value) => {
        updateFields(associationName, index, value);
    };
    

    const handleAddField = (associationName) => {
        setInputFields(prevFields => {
            const updatedFields = { ...prevFields };
            const associationFields = [...updatedFields[associationName], {}];
            updatedFields[associationName] = associationFields;
            return updatedFields;
        });
    };

    const handleRemoveField = (associationName, index) => {
        setInputFields(prevFields => {
            const updatedFields = { ...prevFields };
            const associationFields = [...updatedFields[associationName]];
            associationFields.splice(index, 1);
            updatedFields[associationName] = associationFields;
            return updatedFields;
        });
    };

    if (!itemType) {
        return (
            <div style={{ backgroundColor: '#F8F8F8' }} className="p-3 mt-4">
                <h3>No Item Type Selected</h3>
                <p>Please select an item type to proceed with the form.</p>
            </div>
        );
    }

    if (!callAPI[itemType]) {
        return (
            <div className="item-input-form-bg mt-4">
                <h3>{itemType} Association Form</h3>
                <div className="size-block-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <strong>No Association here</strong>
                </div>
            </div>
        );
    }

    if (loading) return <FullScreenLoadingSpinner />;

    const consoleAssociation = () => {
        console.log(inputFields);
    }

    return (
        <div>
            {itemType === 'AlertInfo' ? (<></>): (
            <h3>{itemType} Association Form</h3>)}
            {(callAPI[itemType] || []).map((item, idx) => (
                <div
                    key={idx}
                    className={itemType === 'AlertInfo' ? 'mt-3' : 'p-2 mt-3 pb-3'}
                    style={itemType === 'AlertInfo' ? {} : { backgroundColor: 'white' }}
                >
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {itemType === 'AlertInfo' ? (<></>): (
                        <h5>{item.name}</h5>)}
                        {item.isPlural && (
                            <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => handleAddField(item.associationName)}>
                                + Add Another {item.name}
                            </button>
                        )}
                    </div>
                    {/* 단일 선택 */}
                    {!item.isPlural && (
                        <div className={itemType === 'AlertInfo' ? '' : 'p-2'}>
                            <div className="input-group input-group" style={{ width: '100%' }}>
                                <label
                                    className="input-group-text"
                                    style={{ width: '40%' }}
                                >
                                    {item.name}
                                </label>
                                <select
                                    className="form-select"
                                    onChange={(e) => handleSelectChange(item.associationName, 0, e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {data[item.associationName] && data[item.associationName].map((entry, index) => (
                                        entry && entry._id && entry._id.encrypted_data ? (
                                            <option key={index} value={`${entry._id.encrypted_data},${entry._id.iv}`}>
                                                {entry.name}
                                            </option>
                                        ) : (
                                            <option key={index} disabled>
                                                Invalid Data
                                            </option>
                                        )
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    {/* 다중 선택 */} 
                    {/* 다중 선택인 경우에만 Add 버튼 표시 */}
                    
                    {item.isPlural && inputFields[item.associationName] && inputFields[item.associationName].map((_, index) => (
                        <div key={index} >
                            <div style={{display: 'flex'}}>
                                <div className="input-group input-group mt-2" style={{ width: '100%', display: 'flex'}}>
                                    <label
                                        className="input-group-text"
                                        style={{ width: '40%' }}
                                    >
                                        {item.name}
                                    </label>
                                    <select
                                        className="form-select"
                                        onChange={(e) => handleSelectChange(item.associationName, index, e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {data[item.associationName] && data[item.associationName].map((entry, idx2) => (
                                            entry && entry._id && entry._id.encrypted_data ? (
                                                <option key={idx2} value={`${entry._id.encrypted_data},${entry._id.iv}`}>
                                                    {entry.name}
                                                </option>
                                            ) : (
                                                <option key={idx2} disabled>
                                                    Invalid Data
                                                </option>
                                            )
                                        ))}
                                    </select>
                                </div>
                                {inputFields[item.associationName].length > 1 && (
                                    <button
                                        className="btn btn-outline-danger mt-2"
                                        style={{marginLeft: '5px'}}
                                        onClick={() => handleRemoveField(item.associationName, index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            
                        </div>
                    ))}
                    
                </div>
            ))}
        </div>
    );
};

export default DynamicAssociationForm;
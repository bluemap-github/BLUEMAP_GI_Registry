import React, { useEffect, useState } from 'react';
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
    PUT_SYMBOL_ASSOCIATION,
    PUT_ICON_ASSOCIATION,
    PUT_VIEWING_GROUP_ASSOCIATION,
    PUT_ITEM_SCHEMA_ASSOCIATION,
    PUT_COLOUR_TOKEN_ASSOCIATION,
    PUT_PALETTE_ASSOCIATION,
    PUT_DISPLAY_MODE_ASSOCIATION,
    PUT_MESSAGE_ASSOCIATION,
    PUT_HIGHLIGHT_ASSOCIATION,
    PUT_VALUE_ASSOCIATION
} from '../api/api';
import axios from 'axios';
import Cookies from 'js-cookie';
import FullScreenLoadingSpinner from '../../../Common/FullScreenLoadingSpinner';
const associationPostAPI = {
    'symbol': PUT_SYMBOL_ASSOCIATION,
    'icon': PUT_ICON_ASSOCIATION,
    'viewingGroup': PUT_VIEWING_GROUP_ASSOCIATION,
    'itemSchema': PUT_ITEM_SCHEMA_ASSOCIATION,
    'colourToken': PUT_COLOUR_TOKEN_ASSOCIATION,
    'palette': PUT_PALETTE_ASSOCIATION,
    'displayMode': PUT_DISPLAY_MODE_ASSOCIATION,
    'msg': PUT_MESSAGE_ASSOCIATION,
    'highlight': PUT_HIGHLIGHT_ASSOCIATION,
    'value': PUT_VALUE_ASSOCIATION,
  }

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
            name: 'Alert Message List', 
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
    ]
};


const PRAssoUpdateModal = ({ IsOpened, onClose, propsData, UpdateAssoType, itemID, itemIV }) => {
    const [assoData, setAssoData] = useState({});
    const [inputFields, setInputFields] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (UpdateAssoType && callAPI[UpdateAssoType]) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const regi_uri = Cookies.get('REGISTRY_URI');
    
                    // API 호출
                    const apiPromises = callAPI[UpdateAssoType].map((item) => {
                        return axios.get(item.apiCall, { params: { regi_uri } });
                    });
    
                    const responses = await Promise.all(apiPromises);
    
                    // 각 어소시에이션 데이터를 저장
                    const dataMap = {};
                    const initialFields = {};
    
                    responses.forEach((response, index) => {
                        const associationName = callAPI[UpdateAssoType][index].associationName;
                        
                        // response 및 response.data가 유효한지 확인
                        if (response && response.data && response.data.data) {
                            dataMap[associationName] = response.data.data;
                            
                            // propsData가 배열인지 확인하여 데이터를 미리 채움
                            if (Array.isArray(propsData)) {
                                const filteredData = propsData.filter(
                                    (d) => d.associationName === associationName
                                );
                                initialFields[associationName] = filteredData.length > 0 
                                    ? filteredData.map((item) => ({
                                        child_id: item.child_id,
                                        child_iv: item.child_iv,
                                        xml_id: item.xml_id
                                    }))
                                    : [{ child_id: '', child_iv: '', xml_id: '' }];
                            } else {
                                // propsData가 없을 경우 기본값으로 빈 필드 제공
                                initialFields[associationName] = [{ child_id: '', child_iv: '', xml_id: '' }];
                            }
                        }
                    });
    
                    // API에서 가져온 데이터와 propsData로 채워진 데이터를 설정
                    setAssoData(dataMap);
                    setInputFields(initialFields);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching association data:', error);
                    setLoading(false);
                }
            };
    
            fetchData();
        }
    }, [UpdateAssoType, propsData]);

    const handleAddField = (associationName) => {
        setInputFields((prevFields) => ({
            ...prevFields,
            [associationName]: [...prevFields[associationName], { child_id: '', child_iv: '' }]
        }));
    };

    const handleRemoveField = (associationName, index) => {
        setInputFields((prevFields) => ({
            ...prevFields,
            [associationName]: prevFields[associationName].filter((_, idx) => idx !== index)
        }));
    };

    const handleInputChange = (associationName, idx, key, value) => {
        console.log('handleInputChange:', associationName, idx, key, value);
        setInputFields((prevFields) => {
            const updatedFields = [...prevFields[associationName]];
            updatedFields[idx][key] = value;
            return { ...prevFields, [associationName]: updatedFields };
        });
    };


    const handleSubmit = async () => {
        const postData = {};
    
        // inputFields에서 필요한 값을 모아서 postData에 저장
        Object.keys(inputFields).forEach((associationName) => {
            postData[associationName] = inputFields[associationName].map((field) => ({
                child_id: field.child_id,
                child_iv: field.child_iv,
            }));
        });
    
    
        // API 매핑 및 요청
        try {
            const confirmSubmit = window.confirm("Are you sure you want to update this Association?");
            if (!confirmSubmit) return; // Exit if the user cancels
            // 각 associationName에 맞는 API로 POST 요청 보내기
            for (const associationName of Object.keys(postData)) {
                const apiEndpoint = associationPostAPI[associationName];
    
                if (apiEndpoint) {
                    const associationsData = {
                        associations: postData[associationName], // 데이터를 'associations' 필드로 감싸기
                    };
    
                    console.log(`Sending data to API ${apiEndpoint}:`, associationsData);
    
                    // 실제 API 요청 (POST)
                    const response = await axios.put(apiEndpoint, associationsData, {
                        params: {
                            item_id: itemID,
                            item_iv: itemIV,
                        }
                    });
                    
                    console.log(`Response from ${apiEndpoint}:`, response.data);
                } else {
                    console.log(`No API found for ${associationName}`);
                }
            }
            alert('Association updated successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    };
    
    

    if (!IsOpened) {
        return null;
    }

    if (loading) {
        return <FullScreenLoadingSpinner />;
    }

    return (
        <div className="modal-style">
            <div className="modal-content-style" style={{width: '800px'}}>
                <div className="text-end">
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                <div>
                    <h3>{UpdateAssoType} Association Update</h3>
                    <div>
                        {Object.keys(assoData).map((associationName, index) => (
                            <div key={index} className="input-group input-group mt-2" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                {inputFields[associationName]?.map((field, idx) => (
                                    <div key={idx} className="d-flex mt-2">
                                        <label className="input-group-text" style={{ width: '40%' }}>
                                            {associationName}
                                        </label>
                                        <select
                                            className="form-select"
                                            value={`${field.child_id},${field.child_iv}`}
                                            onChange={(e) => {
                                                const [child_id, child_iv] = e.target.value.split(',');
                                                handleInputChange(associationName, idx, 'child_id', child_id);
                                                handleInputChange(associationName, idx, 'child_iv', child_iv);
                                            }}
                                        >
                                            <option value="">{field.child_id}, {field.xml_id}</option>
                                            {assoData[associationName] &&
                                                assoData[associationName].map((entry, idx2) => (
                                                    <option key={idx2} value={`${entry._id.encrypted_data},${entry._id.iv}`}>
                                                        {entry._id.encrypted_data}, {entry.name}
                                                    </option>
                                                ))}
                                        </select>
                                        {inputFields[associationName].length > 1 && (
                                            <button className="btn btn-danger btn-sm ms-2" onClick={() => handleRemoveField(associationName, idx)}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {callAPI[UpdateAssoType].find((item) => item.associationName === associationName).isPlural && (
                                    <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => handleAddField(associationName)}>
                                        + Add Another {associationName}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PRAssoUpdateModal;
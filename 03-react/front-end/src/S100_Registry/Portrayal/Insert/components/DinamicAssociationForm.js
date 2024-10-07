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
    GET_ITEM_SCHEMA_LIST
} from '../../api/api';  // Import the API URLs here

const callAPI = {
    'Symbol': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" }
        }

    ],
    'LineStyle': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        },
        { 
            name: 'Symbol List', 
            associationName: 'symbol',
            required: false,
            apiCall: GET_SYMBOL_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" }
        }
    ],
    'AreaFill': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        },
        { 
            name: 'Symbol List', 
            associationName: 'symbol',
            required: false,
            apiCall: GET_SYMBOL_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" }
        }
    ],
    'Pixmap': [
        { 
            name: 'Colour Token List', 
            associationName: 'colourToken',
            required: false,
            apiCall: GET_COLOUR_TOKEN_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        },
        {
            name: 'Item Schema List',
            associationName: 'itemSchema',
            required: false,
            apiCall: GET_ITEM_SCHEMA_LIST,
            defaultData: { parent_id: "", child_id: "" }
        }
    ],
    'ColourToken': [
        { 
            name: 'Palette Item List', 
            associationName: 'value',
            required: true,
            apiCall: GET_PALETTE_ITEM_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        }
    ],
    'PaletteItem': [
        { 
            name: 'Colour Palette List', 
            associationName: 'palette',
            required: true,
            apiCall: GET_COLOUR_PALETTE_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        }
    ],
    'ViewingGroupLayer': [
        { 
            name: 'Display Mode List', 
            associationName: 'displayMode',
            required: false,
            apiCall: GET_DISPLAY_MODE_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        }
    ],
    'ViewingGroup': [
        { 
            name: 'Viewing Group Layer List', 
            associationName: 'viewingGroup',
            required: false,
            apiCall: GET_VIEWING_GROUP_LAYER_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        }
    ],
    'AlertHighlight': [
        { 
            name: 'Alert Message List', 
            associationName: 'msg',
            required: false,
            apiCall: GET_ALERT_MESSAGE_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        },
        { 
            name: 'Viewing Group List', 
            associationName: 'viewingGroup',
            required: true,
            apiCall: GET_VIEWING_GROUP_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        }
    ],
    'AlertMessage': [
        { 
            name: 'Symbol List', 
            associationName: 'icon',
            required: false,
            apiCall: GET_SYMBOL_LIST, 
            defaultData: { parent_id: "", child_id: "" } 
        }
    ]
};

const DinamicAssociationForm = ({ itemType, onFormSubmit }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedData, setSelectedData] = useState({});
    const regi_uri = Cookies.get('REGISTRY_URI');

    useEffect(() => {
        if (itemType && callAPI[itemType]) {
            setLoading(true);
            const fetchData = async () => {
                try {
                    const apiPromises = callAPI[itemType].map((item) =>
                        axios.get(item.apiCall, { params: { regi_uri } })
                    );
                    const responses = await Promise.all(apiPromises);
                    const dataMap = responses.map((res) => res.data.data);
                    setData(dataMap);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [itemType, regi_uri]);

    const handleSelectChange = (itemName, value) => {
        const [encrypted_data, iv] = value.split(",");  // 쉼표로 분리
        const updatedData = { 
            ...selectedData, 
            [itemName]: { encrypted_data, iv }  // 객체 형태로 저장
        };
        setSelectedData(updatedData);
        onFormSubmit(updatedData);  // 선택된 데이터를 상위 컴포넌트로 전달
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
            <div className="item-input-form-bg p-3 mt-4">
                <h3>{itemType} Association Form</h3>
                <div className="size-block-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <strong>No Association here</strong>
                </div>
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="item-input-form-bg p-3 mt-4">
            <h3>{itemType} Association Form</h3>
            <div>
                {(callAPI[itemType] || []).map((item, index) => (
                    <div key={index} style={{ display: 'flex' }}>
                        <div className="input-group input-group-sm mt-2" style={{ width: '50%' }}>
                            <label 
                                className="input-group-text" 
                                style={{ width: '30%', color: item.required ? 'red' : 'black' }}
                            >
                                {item.name}
                            </label>
                            <select
                                className="form-select"
                                onChange={(e) => handleSelectChange(item.associationName, e.target.value)}
                            >
                                <option value="">Select</option>
                                {data[index] &&
                                    data[index].map((entry, idx) => (
                                        <option key={idx} value={`${entry._id.encrypted_data},${entry._id.iv}`}>
                                            {entry.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="mt-2" style={{ marginLeft: '10px' }}>
                            <strong>Selected Data:</strong>{' '}
                            {selectedData[item.name] || 'No data selected'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DinamicAssociationForm;
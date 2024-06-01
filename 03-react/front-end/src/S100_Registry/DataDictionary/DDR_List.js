import React, { useState, useEffect } from 'react';
import {GET_ENUMERATED_VALUE_LIST, GET_SIMPLE_ATTRIBUTE_LIST, GET_COMPLEX_ATTRIBUTE_LIST, GET_FEATURE_LIST, GET_INFORMATION_LIST} from './api.js'
import axios from 'axios';
import {USER_SERIAL} from '../../userSerial.js'
const DDRList = ({ data }) => {
    const [getapi, setApi] = useState(GET_ENUMERATED_VALUE_LIST);
    const [response, setResponse] = useState([]);
    const [viewItemType, setViewItemType] = useState("enumerated_value");

    useEffect(() => {
        switch (data) {
            case 1:
                setApi(GET_ENUMERATED_VALUE_LIST);
                setViewItemType("enumerated_value_one");
                break;
            case 2:
                setApi(GET_SIMPLE_ATTRIBUTE_LIST);
                setViewItemType("simple_attribute_one");
                break;
            case 3:
                setApi(GET_COMPLEX_ATTRIBUTE_LIST);
                setViewItemType("complex_attribute_one");
                break;
            case 4:
                setApi(GET_FEATURE_LIST);
                setViewItemType("feature_one");
                break;
            case 5:
                setApi(GET_INFORMATION_LIST);
                setViewItemType("information_one");
                break;
        }
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(getapi);
            setResponse(result.data);
        };
      
        fetchData();
    }, [getapi]);

    return (
        <div>
            {response.length === 0 ? (
                <div>Loading...</div>
            ) : (
                response.register_items.length === 0 ? (
                    <div style={{backgroundColor: "pink"}}>No data available</div>
                ) : (
                    response.register_items.map(item => (
                        <div key={item._id} style={{backgroundColor :"skyblue", border: "1px solid black"}}>
                            <div>{item._id}</div>
                            <div>{item.concept_id}</div>
                            <div>{item.itemType}</div>
                            <div>{item.name}</div>
                            <div>{item.definition}</div>
                            <button onClick={() => window.location=`/dataDictionary/${viewItemType}/${USER_SERIAL}/${item._id}`}>Detail</button>
                        </div>
                    ))
                )
            )}
            {response.length === 0 && <div>No data available</div>}
        </div>
    );
};

export default DDRList;
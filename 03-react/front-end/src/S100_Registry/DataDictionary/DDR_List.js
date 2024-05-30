import React, { useState, useEffect } from 'react';
import {GET_ENUMERATED_VALUE_LIST, GET_SIMPLE_ATTRIBUTE_LIST, GET_COMPLEX_ATTRIBUTE_LIST, GET_FEATURE_LIST, GET_INFORMATION_LIST} from './api.js'
import axios from 'axios';
import {USER_SERIAL} from '../../userSerial.js'
const DDRList = ({ data }) => {
    const [getapi, setApi] = useState(GET_ENUMERATED_VALUE_LIST);
    const [response, setResponse] = useState([]);

    useEffect(() => {
        switch (data) {
            case 1:
                setApi(GET_ENUMERATED_VALUE_LIST);
                break;
            case 2:
                setApi(GET_SIMPLE_ATTRIBUTE_LIST);
                break;
            case 3:
                setApi(GET_COMPLEX_ATTRIBUTE_LIST);
                break;
            case 4:
                setApi(GET_FEATURE_LIST);
                break;
            case 5:
                setApi(GET_INFORMATION_LIST);
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
                response.register_items.map(item => (
                    <div key={item._id} style={{backgroundColor :"skyblue", border: "1px solid black"}}>
                        <div>{item._id}</div>
                        <div>{item.concept_id}</div>
                        <div>{item.itemType}</div>
                        <div>{item.name}</div>
                        <div>{item.definition}</div>
                        <button onClick={() => window.location=`/dataDictionary/${USER_SERIAL}/${item._id}`}>Detail</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default DDRList;
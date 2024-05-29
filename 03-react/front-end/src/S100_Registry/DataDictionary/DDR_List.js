import React, { useState, useEffect } from 'react';
import {GET_ENUMERATED_VALUE_LIST, GET_SIMPLE_ATTRIBUTE_LIST} from './api.js'
import axios from 'axios';

const DDRList = ({ data }) => {
    const [getapi, setApi] = useState(GET_ENUMERATED_VALUE_LIST);
    const [response, setResponse] = useState([]);

    useEffect(() => {
        switch (data) {
            case 1:
                setApi(GET_ENUMERATED_VALUE_LIST);
                break;
            case 2:
                // setApi("ComplexAttribute");
                setApi(GET_SIMPLE_ATTRIBUTE_LIST);
                break;
            case 3:
                setApi("ComplexAttribute");
                break;
            case 4:
                setApi("Feature");
                break;
            case 5:
                setApi("Information");
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
            여기가 {JSON.stringify(response)} 리스트 담길곳
        </div>
    );
};

export default DDRList;
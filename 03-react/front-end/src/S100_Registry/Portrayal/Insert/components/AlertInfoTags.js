import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GET_ALERT_INFO_LIST } from '../../api/api';

const AlertInfoTags = ({ tagName, onFormSubmit }) => {
    const [alertInfoList, setAlertInfoList] = useState([]);

    useEffect(() => {
        const fetchAlertInfoList = async () => {
            try {
                const response = await axios.get(GET_ALERT_INFO_LIST, {
                    params: {
                        regi_uri: Cookies.get('REGISTRY_URI') // 쿠키에서 regi_uri 가져오기
                    }
                });
                setAlertInfoList(response.data.data); // API 응답을 상태로 저장
                console.log('Alert Info List:', response.data.data);
            } catch (error) {
                console.error('Error fetching Alert Info List:', error);
            }
        };

        fetchAlertInfoList();
    }, []);

    return (
        <div>
        <h5>{tagName}</h5>
        {alertInfoList.length > 0 ? (
            <ul >
            {alertInfoList.map((info, index) => (
                <li key={index} className="card p-3">
                <p>Concept ID: {info.concept_id}</p>
                {info.priority.map((priorityItem, priorityIndex) => (
                    <ul
                    key={priorityIndex}
                    className="list-group"
                    >
                        <li className="list-group-item">Priority: {priorityItem.priority} / Default: {priorityItem.default ? "True" : "False"} / Optional: {priorityItem.optional ? "True" : "False"}</li>
                    </ul>
                ))}
                </li>
            ))}
            </ul>
        ) : (
            <p>No alert info available</p>
        )}
        </div>

    );
};

export default AlertInfoTags;

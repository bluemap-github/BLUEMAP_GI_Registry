import React, { useState, useEffect } from 'react'; 
import { GET_ALERT_HIGHLIGHT_LIST, GET_ALERT_MESSAGE_LIST, PUT_HIGHLIGHT_ASSOCIATION, PUT_MESSAGE_ASSOCIATION } from '../../api/api';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getDecryptedItem, setEncryptedItem } from "../../../../cryptoComponent/storageUtils";

const UpdateAlertAssociation = ({ data, priorityID, onClose}) => {
    // console.log(JSON.stringify(data[priorityID]?.message), "?????");
    const [highlight, setHighlight] = useState(data[priorityID]?.highlight || null);
    const [message, setMessage] = useState(data[priorityID]?.message || null);
    const [getHighlight, setGetHighlight] = useState([]);
    const [getMessage, setGetMessage] = useState([]);
    const [isupdatedHighlight, setIsUpdatedHighlight] = useState(false);    
    const [isupdatedMessage, setIsUpdatedMessage] = useState(false);
    const regi_uri = getDecryptedItem('REGISTRY_URI');
    
    // API 요청에 사용할 기본 파라미터
    const params = {
        params: {
            regi_uri,
            search_term: "",
            status: "",
            category: "",
            sort_key: "name",
            sort_direction: "ascending",
            page: 1,
            page_size: 1000,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Highlight 리스트 가져오기
                const highlightResponse = await axios.get(GET_ALERT_HIGHLIGHT_LIST, params);
                if (highlightResponse.data && highlightResponse.data.data) {
                    // console.log(highlightResponse.data.data);
                    setGetHighlight(highlightResponse.data.data); // 데이터를 옵션에 사용
                }

                // Message 리스트 가져오기
                const messageResponse = await axios.get(GET_ALERT_MESSAGE_LIST, params);
                if (messageResponse.data && messageResponse.data.data) {
                    setGetMessage(messageResponse.data.data); // 데이터를 옵션에 사용
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [priorityID, regi_uri]); // 의존성 배열에 `priorityID`와 `regi_uri` 추가

    // Highlight association 업데이트 함수
    const updateHighlightAssociation = (e) => {
        const selectedOption = getHighlight.find(option => option._id.encrypted_data === e.target.value);
    
        if (selectedOption) {
            // highlight의 기존 child_id 유지하며 selectedOption의 encrypted_data와 iv를 업데이트
            setHighlight({
                parent_id: priorityID,
                child_id: {
                    encrypted_data: selectedOption._id.encrypted_data,
                    iv: selectedOption._id.iv,
                }
            });
        }
        setIsUpdatedHighlight(true);
    };

    // Message association 업데이트 함수
    const updateMessageAssociation = (e) => {
        const selectedOption = getMessage.find(option => option._id.encrypted_data === e.target.value);
    
        if (selectedOption) {
            // message의 기존 child_id 유지하며 selectedOption의 encrypted_data와 iv를 업데이트
            setMessage({
                parent_id: priorityID,
                child_id: {
                    encrypted_data: selectedOption._id.encrypted_data,
                    iv: selectedOption._id.iv,
                }
            });
        }
        setIsUpdatedMessage(true);
    };

    function transformData(data) {
        return {
            "associations": [{
                "child_id": data.child_id.encrypted_data,
                "child_iv": data.child_id.iv
            }]
        };
    }

    const fetchPUTAssociations = async () => {
        if (!isupdatedHighlight && !isupdatedMessage) {
            alert('There is no association to update');
        } else {
            // console.log(highlight, isupdatedHighlight);
            // console.log(message, isupdatedMessage);
            if (isupdatedHighlight) {
                const postData = transformData(highlight);
                try {
                    await axios.put(PUT_HIGHLIGHT_ASSOCIATION, postData, {params: { 
                        item_id : priorityID,
                        item_type : "AlertInfo"
                     }});
                    setIsUpdatedHighlight(false);
                } catch (error) {
                    console.error('Error updating highlight association:', error);
                }
            }
    
            if (isupdatedMessage) {
                const postData = transformData(message);
                try {
                    await axios.put(PUT_MESSAGE_ASSOCIATION, postData, {params: { 
                        item_id : priorityID,
                        item_type : "AlertInfo"
                     }});
                    setIsUpdatedMessage(false);
                } catch (error) {
                    console.error('Error updating message association:', error);
                }
            }
            onClose();
            window.location.reload();
            
        } 
    }

    return (
        <div>
            <h3>Update Association With AlertInfo</h3>
            {/* Message 선택 */}
            <div>
                <div className="input-group input-group mt-3" style={{ width: '100%' }}>
                    <label className="input-group-text" style={{ width: '40%' }}>
                        message
                    </label>
                    <select
                        className="form-select"
                        value={message?.child_id?.encrypted_data || ""} // 안전한 접근
                        onChange={updateMessageAssociation} // 중간 함수에서 로직 처리
                    >   
                        {
                            message?.data?.length > 0 ? (
                                <option value="">{message.data[0].xmlID}</option>
                            ) : (
                                <option value="">Select</option>
                            )
                        }
                        {getMessage.length > 0 ? (
                            getMessage.map((option) => (
                                <option key={option._id?.encrypted_data} value={option._id.encrypted_data}>
                                    {option.xmlID} {/* xmlID 표시 */}
                                </option>
                            ))
                        ) : (
                            <option disabled>No options available</option>
                        )}
                    </select>
                </div>
            </div>
            <div>
                <div className="input-group input-group mt-3" style={{ width: '100%' }}>
                    <label className="input-group-text" style={{ width: '40%' }}>
                        highlight
                    </label>
                    <select
                        className="form-select"
                        value={highlight?.child_id?.encrypted_data || ""} // 안전한 접근
                        onChange={updateHighlightAssociation} // 중간 함수에서 로직 처리
                    >
                        {
                            highlight?.data?.length > 0 ? (
                                <option value="">{highlight.data[0].xmlID}</option>
                            ) : (
                                <option value="">Select</option>
                            )
                        }
                        {getHighlight.length > 0 ? (
                            getHighlight.map((option) => (
                                <option key={option._id?.encrypted_data} value={option._id.encrypted_data}>
                                    {option.xmlID} {/* xmlID 표시 */}
                                </option>
                            ))
                        ) : (
                            <option disabled>No options available</option>
                        )}
                    </select>
                </div>
            </div>

            <div className='text-end'>
                <button className="btn btn-primary mt-3" onClick={fetchPUTAssociations}>
                    Update Association
                </button>
            </div>
        </div>
    );
};

export default UpdateAlertAssociation;

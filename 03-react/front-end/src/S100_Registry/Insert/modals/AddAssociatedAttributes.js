import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { SEARCH_RELATED_ITEM } from '../../DataDictionary/api.js';
import { getDecryptedItem, setEncryptedItem } from "../../../cryptoComponent/storageUtils";

const mandatoryFields = ["attributeId"];

const AddAssociatedAttributes = ({ handleRelatedValueList }) => {
    const regi_uri = getDecryptedItem('REGISTRY_URI');
    const [data, setData] = useState([]);
    const [selectedObj, setSelectedObj] = useState(null);
    const [selectedID, setSelectedID] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isInvalid, setIsInvalid] = useState(true); // 선택이 안 됐을 때 관리하는 상태

    const handleChange = (e) => {
        const selectedId = e.target.value;
        const selectedItem = data.find(item => item._id === selectedId);

        if (selectedItem) {
            setSelectedObj(selectedItem);
            setSelectedID(selectedItem._id);
            handleRelatedValueList(selectedItem, selectedItem._id);
            setIsInvalid(false); // 선택된 경우 에러 상태 해제
        } else {
            setSelectedObj(null);
            setSelectedID('');
            setIsInvalid(true); // 선택이 취소된 경우 에러 상태 설정
        }
    };

    useEffect(() => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                regi_uri: regi_uri,
                search_term: searchTerm,
                item_type: 'SimpleAttribute'
            }
        })
        .then(response => {
            setData(response.data.search_result);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, []);

    return (
        <div className="input-group mt-3">
            <label 
                className={`input-group-text ${isInvalid ? 'tag-invalid' : ''}`} // 기본 클래스 유지, 에러일 때만 추가 클래스
                htmlFor="attributeId" 
                style={{
                    width:"40%",
                    fontWeight: "bold" 
                }}
            >    
                * Associated Attribute ID
            </label>
            <select
                className={`form-select ${isInvalid ? 'tag-invalid' : ''}`} // 선택 안됐을 때 'tag-invalid' 클래스 추가
                value={selectedID} // 현재 선택된 ID 반영
                onChange={handleChange}
                id="attributeId" // label과 연동되는 id
            >
                <option value="">Select an attribute</option>
                {data.length === 0 ? (
                    <option value="" disabled>No data available</option>
                ) : (
                    data.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

export default AddAssociatedAttributes;

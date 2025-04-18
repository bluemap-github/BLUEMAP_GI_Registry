import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PUT_SUB_ATTRIBUTE, PUT_DISTINCTION } from '../../api.js';
import { SEARCH_RELATED_ITEM } from '../../../IHO_DataDictionary/api.js';
import Cookies from 'js-cookie';
import { getDecryptedItem, setEncryptedItem } from "../../../../cryptoComponent/storageUtils";

const UpdateAPIs = {
    'ComplexAttribute': PUT_SUB_ATTRIBUTE,
    'FeatureType': PUT_DISTINCTION,
    'InformationType': PUT_DISTINCTION
};
const associatedType = {
    'ComplexAttribute': 'subAttribute',
    'FeatureType': 'distinction',
    'InformationType': 'distinction'
};

const callAPIItemTypes = {
    'ComplexAttribute': 'SimpleAttribute,ComplexAttribute',
    'FeatureType': 'FeatureType',
    'InformationType': 'InformationType'
};

const SubDistinctUpdate = ({ TagItemType, onClose, formData }) => {
    const role = getDecryptedItem('role'); // Get the user's role from cookies
    const regi_uri = getDecryptedItem('REGISTRY_URI');  // 쿠키에서 레지스트리 URI 가져오기
    const [selectedValues, setSelectedValues] = useState([]);    
    const [searchResults, setSearchResults] = useState([]);  // API로 가져온 데이터를 저장할 상태
    const [filteredList, setFilteredList] = useState([]);  // 필터링된 리스트
    const [selectBoxes, setSelectBoxes] = useState([{}]);  // 선택된 박스들

    // 초기 값 설정: formData에서 selectedValues에 미리 값을 반영
    useEffect(() => {
        if (formData && formData[associatedType[TagItemType]]) {
            const formDataResults = formData[associatedType[TagItemType]].map(item => ({
                ...item,
                is_changed: false  // 모든 항목에 is_encrypted 속성을 추가하고 true로 설정
            }));
            setSelectedValues(formDataResults);  // 초기 데이터를 selectedValues에 설정
            setSelectBoxes(formDataResults.length ? formDataResults : [{}]);  // formData에 맞게 select box 개수 조정
        }
    }, [TagItemType, formData]);

    // API 호출로 관련 데이터를 가져오는 useEffect
    useEffect(() => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                regi_uri: regi_uri,
                item_type: callAPIItemTypes[TagItemType]  // 필요한 경우 item_type 변경 가능
            }
        })
        .then(response => {
            console.log('response.data.search_result', response.data.search_result);
            setSearchResults(response.data.search_result);
            setFilteredList(response.data.search_result);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, [regi_uri, TagItemType]);  // regi_uri 또는 TagItemType이 바뀔 때마다 API 호출

    const handleSelectChange = (index, e) => {
        const updatedSelectedValues = [...selectedValues];
        updatedSelectedValues[index] = {
            ...updatedSelectedValues[index],
            changed_id: e.target.value,  // encrypted_data를 업데이트
            is_changed: true  // is_encrypted를 true로 설정
        };
        setSelectedValues(updatedSelectedValues);
        console.log('updatedSelectedValues', updatedSelectedValues);
    };

    const addSelectBox = () => {
        setSelectedValues([...selectedValues, {}]);  // 빈 객체 추가
    };

    const removeSelectBox = (index) => {
        const updatedSelectedValues = [...selectedValues];
        updatedSelectedValues.splice(index, 1);
        setSelectedValues(updatedSelectedValues);
    };

    const handleSubmit = () => {
        // 선택된 값들을 API로 수정 요청 보내는 로직 구현
        axios.put(UpdateAPIs[TagItemType], {
            'associations' : selectedValues,
        }, {
            params: {
                regi_uri: regi_uri,
                item_id: formData._id.encrypted_data,
                item_iv: formData._id.iv  
        }})
            .then(response => {
                alert('Updated successfully');
                onClose();
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating!', error);
            });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Update</h3>
                <>{role === 'owner' && (
                        <button 
                        className="btn btn-outline-secondary btn-sm mt-2" 
                        onClick={addSelectBox}
                    >
                        + Add Related Values
                    </button>
                )}
                </>
            </div>
            <div className="mt-3">
                {selectedValues.map((value, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div className="input-group input-group" style={{ flex: 1 }}>
                            <label 
                                className='input-group-text'
                                style={{ width: "40%", fontWeight: "bold" }}
                            >    
                                Related Feature ID
                            </label>
                            <select
                                className="form-select"
                                value={value.encrypted_data || ''}  // 배열 값에 따라 미리 선택된 값 설정
                                onChange={(e) => handleSelectChange(index, e)}
                                style={{ marginRight: '10px', flex: 1 }}
                            >
                                <option value="">{value.name}</option>
                                {filteredList.length === 0 ? (
                                    <option value="" disabled>No data available</option>
                                ) : (
                                    filteredList.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        {/* 셀렉트박스가 하나 이상일 때만 Remove 버튼을 표시 */}
                        {selectedValues.length > 1 && (
                            <button 
                                className="btn btn-outline-danger"
                                onClick={() => removeSelectBox(index)}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button 
                className="btn btn-primary mt-3"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default SubDistinctUpdate;

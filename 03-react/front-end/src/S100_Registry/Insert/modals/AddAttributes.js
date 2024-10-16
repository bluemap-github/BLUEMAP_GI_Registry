import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SEARCH_RELATED_ITEM } from '../../DataDictionary/api';
import Cookies from 'js-cookie'; 

function AddAttributes({ handleRelatedEnumList, relatedEnumList, componentType }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedValues, setSelectedValues] = useState(relatedEnumList);
    const [selectBoxes, setSelectBoxes] = useState([{}]); // 처음에 하나의 셀렉트 박스
    const [filteredList, setFilteredList] = useState([]);
    const regi_uri = Cookies.get('REGISTRY_URI');
    const [searchTerm, setSearchTerm] = useState('');
    const [itemTypes, setItemTypes] = useState('All');

    // 검색 결과를 가져오는 useEffect
    useEffect(() => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                regi_uri: regi_uri,
                item_type: callAPIItemTypes
            }
        })
        .then(response => {
            setSearchResults(response.data.search_result);
            setFilteredList(response.data.search_result);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

    }, []);

    // 선택된 값 상태를 업데이트하는 함수 (중복 검사 추가)
    const handleSelectChange = (index, e) => {
        const selectedId = e.target.value;
        const selectedItem = searchResults.find(item => item._id === selectedId);

        // 이미 선택된 값이 있는지 확인 (중복 검사)
        const isDuplicate = selectedValues.some(value => value?._id === selectedItem?._id);

        if (isDuplicate) {
            alert('This value has already been selected.');
        } else {
            // 각 셀렉트 박스의 선택 값을 저장하는 로직
            const updatedSelectedValues = [...selectedValues];
            updatedSelectedValues[index] = selectedItem;
            setSelectedValues(updatedSelectedValues);
            handleRelatedEnumList(updatedSelectedValues);
        }
    };

    // 셀렉트 박스를 추가하는 함수
    const addSelectBox = () => {
        setSelectBoxes([...selectBoxes, {}]);
    };

    // 셀렉트 박스를 삭제하는 함수
    const removeSelectBox = (index) => {
        // 선택된 값을 업데이트하여 해당 인덱스의 값을 제거
        const updatedSelectedValues = [...selectedValues];
        updatedSelectedValues.splice(index, 1);
        setSelectedValues(updatedSelectedValues);

        // 셀렉트 박스 리스트에서 해당 인덱스의 셀렉트 박스 제거
        const updatedSelectBoxes = [...selectBoxes];
        updatedSelectBoxes.splice(index, 1);
        setSelectBoxes(updatedSelectBoxes);
    };

    // 필터링 로직
    const runFilter = () => {
        const filtered = searchResults.filter((item) => {
            if (itemTypes === 'All') {
                return item.name.includes(searchTerm);
            }
            return item.name.includes(searchTerm) && item.itemType === itemTypes;
        });
        setFilteredList(filtered);
    };

    let callAPIItemTypes;
    switch (componentType) {
        case 'ComplexAttribute':
            callAPIItemTypes = 'SimpleAttribute,ComplexAttribute';
            break;
        case 'Feature':
            callAPIItemTypes = 'FeatureType';
            break;
        case 'Information':
            callAPIItemTypes = 'InformationType';
            break;
        default:
            break;
    }

    return (
        <div>
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h3>Submit Related Values</h3>
                    {/* 버튼을 눌러 새로운 Select 박스를 추가 */}
                    <button 
                        className="btn btn-primary" 
                        onClick={addSelectBox}
                    >
                        Add Related Values
                    </button>
                </div>

                {/* Select 박스 리스트 */}
                <div className='mt-3'>
                    {selectBoxes.map((_, index) => (
                        <div style={{diaplay: 'flex'}}>
                            <div className="input-group input-group mb-2" key={index} >
                                <label 
                                    className='input-group-text'
                                    style={{
                                        width:"40%",
                                        fontWeight: "bold" 
                                    }}
                                >    
                                    * Associated Attribute ID
                                </label>
                                <select
                                    className="form-select"
                                    value={selectedValues[index]?._id || ''} // 선택된 값을 반영
                                    onChange={(e) => handleSelectChange(index, e)}
                                    style={{ marginRight: '10px', flex: 1 }} // 셀렉트박스 넓이 조정
                                >
                                    <option value="">Select a value</option>
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
                            <button 
                                className="btn btn-danger"
                                onClick={() => removeSelectBox(index)}
                            >
                                Remove
                            </button>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
        
    );
}

export default AddAttributes;

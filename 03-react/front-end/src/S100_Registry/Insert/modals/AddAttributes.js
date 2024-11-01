import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SEARCH_RELATED_ITEM } from '../../DataDictionary/api';
import Cookies from 'js-cookie';

function AddAttributes({ handleRelatedEnumList, relatedEnumList, componentType, InputTitle }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedValues, setSelectedValues] = useState(relatedEnumList);
    const [selectBoxes, setSelectBoxes] = useState([{}]);
    const [filteredList, setFilteredList] = useState([]);
    const regi_uri = Cookies.get('REGISTRY_URI');
    const [searchTerm, setSearchTerm] = useState('');
    const [itemTypes, setItemTypes] = useState('All');

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

    const handleSelectChange = (index, e) => {
        const selectedId = e.target.value;
        const selectedItem = searchResults.find(item => item._id === selectedId);

        const isDuplicate = selectedValues.some(value => value?._id === selectedItem?._id);

        if (isDuplicate) {
            alert('This value has already been selected.');
        } else {
            const updatedSelectedValues = [...selectedValues];
            updatedSelectedValues[index] = selectedItem;
            setSelectedValues(updatedSelectedValues);
            handleRelatedEnumList(updatedSelectedValues);
        }
    };

    const addSelectBox = () => {
        setSelectBoxes([...selectBoxes, {}]);
    };

    const removeSelectBox = (index) => {
        const updatedSelectedValues = [...selectedValues];
        updatedSelectedValues.splice(index, 1);
        setSelectedValues(updatedSelectedValues);

        const updatedSelectBoxes = [...selectBoxes];
        updatedSelectBoxes.splice(index, 1);
        setSelectBoxes(updatedSelectBoxes);
    };

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
        case 'FeatureType':
            callAPIItemTypes = 'FeatureType';
            break;
        case 'InformationType':
            callAPIItemTypes = 'InformationType';
            break;
        default:
            break;
    }

    // 모든 셀렉트박스가 비어있는지 확인하는 함수, ComplexAttribute일 경우 검사하지 않음
    const isAnyValueSelected = selectedValues.some(value => value?._id);

    return (
        <div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h3 style={{ color: (isAnyValueSelected || (componentType === 'FeatureType' || componentType === 'InformationType')) ? 'black' : 'red' }}>
                            {InputTitle}
                        </h3>
                        {componentType === 'ComplexAttribute' && !isAnyValueSelected && (
                            <div style={{ color: 'red', marginLeft: '10px' }}>(attribute ID is required.)</div>
                        )}
                    </div>

                    
                    <button 
                        className="btn btn-outline-secondary btn-sm mt-2" 
                        onClick={addSelectBox}
                    >
                        + Add Related Values
                    </button>
                </div>

                <div className="mt-3">
                    {selectBoxes.map((_, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div className="input-group input-group" style={{ flex: 1 }}>
                                <label 
                                    className='input-group-text'
                                    style={{ width: "40%", fontWeight: "bold" }}
                                >    
                                    Associated Attribute ID
                                </label>
                                <select
                                    className="form-select"
                                    value={selectedValues[index]?._id || ''}
                                    onChange={(e) => handleSelectChange(index, e)}
                                    style={{ marginRight: '10px', flex: 1 }}
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
                            {/* 셀렉트박스가 하나 이상일 때만 Remove 버튼을 표시 */}
                            {selectBoxes.length > 1 && (
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
            </div>
        </div>
    );
}

export default AddAttributes;

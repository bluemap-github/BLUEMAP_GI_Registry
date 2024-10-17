import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { SEARCH_RELATED_ITEM } from '../../api.js';
import { PUT_ASSOCIATED_ATTRIBUTE } from '../../api.js';

const EnumAssoUpdate = ({ IsOpened, onClose, formData }) => {
    const regi_uri = Cookies.get('REGISTRY_URI'); // 쿠키에서 레지스트리 URI 가져오기
    const [data, setData] = useState([]);
    const [selectedObj, setSelectedObj] = useState(null);
    const [selectedID, setSelectedID] = useState(''); // 초기값을 formData에서 가져오기 위해 변경
    const [isInvalid, setIsInvalid] = useState(true); // 선택 안된 상태
    const [isDifferent, setIsDifferent] = useState(false); // 선택된 값이 변경된 경우

    const handleChange = (e) => {
        const selectedId = e.target.value;
        const selectedItem = data.find(item => item._id === selectedId);

        if (selectedItem) {
            setSelectedObj(selectedItem);
            setSelectedID(selectedItem._id);
            setIsInvalid(false); // 선택된 경우 유효 상태로 변경
        } else {
            setSelectedObj(null);
            setSelectedID('');
            setIsInvalid(true); // 선택이 취소된 경우 에러 상태 설정
        }
        setIsDifferent(true); // 선택된 값이 변경된 경우 true로 설정
    };

    // formData.attributeId[0]에서 초기값 설정
    useEffect(() => {
        if (formData && formData.attributeId && formData.attributeId.length > 0) {
            const initialId = {
                'item_id': formData.attributeId[0].encrypted_data,
                'item_iv': formData.attributeId[0].iv
            }
            setSelectedID(initialId); // 초기값 설정
            setSelectedObj({
                _id: initialId,
                name: formData.attributeId[0].name // 선택된 name 설정
            });
            setIsInvalid(false); // 초기값이 있으므로 유효 상태로 설정
        }
    }, [formData]);

    // 데이터 로드
    useEffect(() => {
        axios.get(SEARCH_RELATED_ITEM, {
            params: {
                regi_uri: regi_uri,
                search_term: "",
                item_type: 'SimpleAttribute'
            }
        })
        .then(response => {
            setData(response.data.search_result);
            console.log('EnumAssoUpdate??????????', response.data.search_result);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, [regi_uri]);

    const handleUpdate = async () => {
        if (selectedObj) {
            const data = {
                'regi_uri': regi_uri,
                'is_row_id' : isDifferent,
                'updated_id': selectedObj._id,
                'child_id': formData._id
            };
            console.log(data);
            try {
                const response = await axios.put(PUT_ASSOCIATED_ATTRIBUTE, data);
                console.log('handleUpdate', response);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        else {
            setIsInvalid(true); // 선택이 안된 경우 에러 상태 설정
        }
    }

    return (
        <div>
            <div>
                <h3>Update Associated Attribute</h3>
            </div>
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
                    {formData.attributeId && formData.attributeId.length > 0 ? (
                        <option value="">{formData.attributeId[0].name}</option>
                    ) : (<option value="">Select an attribute</option>)}
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
            <div className="text-end mt-3">
                <button 
                    className='btn btn-primary'
                    onClick={handleUpdate}
                    >Update</button>
            </div>
        </div>
    );
};

export default EnumAssoUpdate;

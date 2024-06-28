import React, { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../../../../context/ItemContext';
import axios from 'axios';
import { PUT_ITEM_URL } from '../../../api';


function ItemUpdate({ items, onClose }) {
    const [item, setItem] = useState(items);
    const { itemDetails } = useContext(ItemContext); 
    const { item_id, item_iv } = itemDetails;

    useEffect(() => {
        setItem(items); // props로 받은 items를 초기 상태로 설정
    }, [items]);

    const ItemChange = (event) => {
        // 이전 상태 복제
        const updatedItem = { ...item };
        // 새로운 값을 추가하거나 업데이트
        updatedItem[event.target.name] = event.target.value;
        // 업데이트된 상태 설정
        setItem(updatedItem);
    };

    const handleSubmitItem = async () => {
        try {
            await axios.put(PUT_ITEM_URL, item, {
                params: {
                    item_id: item_id,
                    item_iv: item_iv
                }
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div>
            <div className='text-end'>
                <button onClick={onClose} type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div>
                <h3 className='mb-2'>Update Item</h3>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*Item Identifier</span>
                    <input
                        type='number'
                        value={item.itemIdentifier} // 객체의 해당 속성에 접근
                        className="form-control"
                        placeholder="itemIdentifier"
                        name="itemIdentifier"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*Name</span>
                    <input
                        value={item.name} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="name"
                        name="name"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Definition</span>
                    <input
                        value={item.definition} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="definition"
                        name="definition"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Remarks</span>
                    <input
                        value={item.remarks} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="remarks"
                        name="remarks"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*Item Status</span>
                    <input
                        value={item.itemStatus} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="itemStatus"
                        name="itemStatus"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Alias</span>
                    <input
                        value={item.alias} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="alias"
                        name="alias"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Camel Case</span>
                    <input
                        value={item.camelCase} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="camelCase"
                        name="camelCase"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Definition Source</span>
                    <input
                        value={item.definitionSource} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="definitionSource"
                        name="definitionSource"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Reference</span>
                    <input
                        value={item.reference} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="reference"
                        name="reference"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Similarity to Source</span>
                    <input
                        value={item.similarityToSource} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="similarityToSource"
                        name="similarityToSource"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Justification</span>
                    <input
                        value={item.justification} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="justification"
                        name="justification"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>Proposed Change</span>
                    <input
                        value={item.proposedChange} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="proposedChange"
                        name="proposedChange"
                        onChange={ItemChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>update</button>
                </div>
                
            </div>
        </div>
    )
}
export default ItemUpdate;

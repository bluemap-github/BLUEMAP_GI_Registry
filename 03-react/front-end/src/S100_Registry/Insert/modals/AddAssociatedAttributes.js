import React, { useState } from 'react';
import AttSearch from './search/AttSearch';

const AddAssociatedAttributes = ({isOpen, onClose, handleRelatedValueList}) => {
    const [data, setData] = useState([]);
    const [selectedObj, setSelectedObj] = useState();
    const [selectedID, setSelectedID] = useState();

    

    const handleSetData = (data) => {
        setData(data);
    };

    const handleChange = (e, item) => {
        if (e.target.checked) {
            setSelectedObj(item);
            setSelectedID(item._id);
        } else {
            // 필요한 필드만 초기화하고 나머지는 빈 상태 유지
            setSelectedObj([]);
            setSelectedID('');
        }
    };

    const handleSubmit = () => {
        handleRelatedValueList(selectedObj, selectedID);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-style">
            <div className="modal-content-style">
                <div className='text-end' style={{height: "10%"}}>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
            <div>
            <AttSearch onSearch={handleSetData} />
            <div
                className="mt-2"
                style={{
                    maxHeight: '300px', // 원하는 높이로 설정
                    overflowY: 'auto',  // 내용이 넘칠 경우 스크롤 가능
                    padding: '10px',   // 패딩 추가
                    border: '1px solid #ccc',  // 테두리 추가
                    borderRadius: '5px',  // 둥근 테두리 추가
                    marginBottom: '10px' // 하단 여백 추가
                }}
            >
                {data.length === 0 ? (
                    <p style={{ color: '#888' }}>No data available</p>
                ) : (
                    <>
                        {data.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                    marginBottom: '5px',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    value={item._id}
                                    checked={selectedID === item._id}
                                    onChange={(e) => handleChange(e, item)}
                                    style={{ marginRight: '10px' }}
                                />
                                <label style={{ fontSize: '16px', color: '#333' }}>
                                    {item.name}
                                </label>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className='text-end'>
                <button className='btn btn-outline-primary' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
      </div>
    </div>
    );
};

export default AddAssociatedAttributes;
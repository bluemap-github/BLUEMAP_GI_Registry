import React, { useState } from 'react';
import AttSearch from './search/AttSearch';

const AddAssociatedAttributes = ({isOpen, onClose, handleRelatedValueList}) => {
    const [data, setData] = useState([]);
    const [selectedObj, setSelectedObj] = useState(null);
    const [selectedID, setSelectedID] = useState(null);

    

    const handleSetData = (data) => {
        setData(data);
    };

    const handleChange = (e, item) => {
        if (e.target.checked) {
            setSelectedObj(item);
            setSelectedID(item._id);
        } else {
            setSelectedObj(null);
            setSelectedID(null);
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
        <div 
            className="modal"
            style={{
                position: "fixed", /* 화면에 고정 */
                top: "0", /* 화면 상단에 배치 */
                left: "0", /* 화면 왼쪽에 배치 */
                width: "100%", /* 전체 화면 너비 */
                height: "100%", /* 전체 화면 높이 */
                backgroundColor: "rgba(0, 0, 0, 0.5)", /* 배경 색상 및 투명도 설정 */
                display: "flex", /* 내부 요소를 수평 정렬하기 위해 */
                justifyContent: "center", /* 내부 요소를 수평 가운데 정렬하기 위해 */
                alignItems: "center", /* 내부 요소를 수직 가운데 정렬하기 위해 */
                zIndex : "9999" /* 다른 요소 위에 위치하도록 설정 */
            }}
            >
            <div 
                className="modal-content"
                style={{
                maxWidth: "40rem",
                maxHeight: "40rem",
                backgroundColor: "white", /* 모달 내용 배경 색상 */
                padding: "20px", /* 내용 패딩 설정 */
                borderRadius: "8px", /* 내용 모서리를 둥글게 만듭니다 */
                }}
            >
        <div className='text-end' style={{height: "10%"}}>
            <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
        </div>
        <div>
            <AttSearch onSearch={handleSetData} />
            <div>
                {data.length === 0 ? (<p>no data</p>) : (
                    <>
                    {
                        data.simple_attributes.map((item, index) => (
                            <div key={index}>
                                <input 
                                    type="checkbox" 
                                    value={item._id} 
                                    checked={selectedID === item._id}
                                    onChange={(e) => handleChange(e, item)} 
                                />
                                <label>{item.name}</label>
                            </div>
                        ))
                    }
                    </>
                )}
            </div>
            <div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
      </div>
    </div>
    );
};

export default AddAssociatedAttributes;

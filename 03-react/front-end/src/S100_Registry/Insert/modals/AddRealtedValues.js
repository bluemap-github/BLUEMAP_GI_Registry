import React, { useEffect, useState } from 'react';
import EnumSearch from './search/EnumSearch';


function AddRealtedValues({ isOpen, onClose, handleRelatedValueList}) {
    const [data, setData] = useState([]);
    const [selectedObj, setSelectedObj] = useState([]);
    const [selectedID, setSelectedID] = useState([]);
    useEffect(() => {
    }, []);

    const handleSetData = (data) => {
        setData(data);
    };

    const handleSubmit = () => {
        handleRelatedValueList(selectedObj, selectedID);
        onClose();
    };

    const log = () => {
        console.log(selectedObj);
        console.log(selectedID);
    }
    if (!isOpen) {
        return null;
    }
    const handleChange = (e, item) => {
        if (e.target.checked) {
            setSelectedObj([...selectedObj, item]);
            setSelectedID([...selectedID, item._id]);
        } else {
            setSelectedObj(selectedObj.filter((obj) => obj !== item));
            setSelectedID(selectedID.filter((id) => id !== item._id));
        }
    };
    const handleChangeUn = (item) => {
        // 선택된 항목을 필터링하여 목록에서 제거
        setSelectedObj((prevSelectedObj) => prevSelectedObj.filter((obj) => obj._id !== item._id));
        setSelectedID((prevSelectedID) => prevSelectedID.filter((id) => id !== item._id));
    };

    return (
        <div>
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
                    maxWidth: "80rem",
                    maxHeight: "80rem",
                    backgroundColor: "white", 
                    padding: "20px", 
                    borderRadius: "8px",
                    }}
                >
                    <div className='text-end' style={{height: "10%"}}>
                        <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                    </div>
                    <div>
                    <div>
                        <h3>Submit Realted Values</h3>
                            <EnumSearch getResData={handleSetData}/>
                            <div style={{display: "flex"}}>
                                <div style={{backgroundColor : "skyblue", width: "50%"}}>
                                    {data.length === 0 ? (<p>no data</p>) : (
                                        <>
                                        {
                                            data.map((item, index) => (
                                                <div key={index}>
                                                    <input type="checkbox" value={item._id} onChange={(e) => handleChange(e, item)} />
                                                    <label>{item.name}</label>
                                                </div>
                                            ))
                                        }
                                        </>
                                    )}
                                </div>
                                <div>
                                    <button onClick={log}>add</button>
                                </div>
                                <div>
                                    <h3>Selected</h3>
                                    <ul>
                                        {selectedObj.map((item, index) => (
                                            <div style={{ display: "flex" }}>
                                                <li key={index}>{item.name}</li>
                                                <button onClick={() => handleChangeUn(item)}>unselect</button>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                    </div>
                    </div>
                    <div className='text-end'>
                        <button className='btn btn-sm btn-primary' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddRealtedValues;
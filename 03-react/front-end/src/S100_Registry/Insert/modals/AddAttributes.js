import React, { useState } from 'react';
import AttSearch from './search/AttSearch';

function AddAttributes({ isOpen, onClose }) {
    // const [inputValue, setInputValue] = useState('');
    const [searchResults, setSearchResults] = useState({});

    // const handleInputChange = (event) => {
    //     setInputValue(event.target.value);
    // };

    // const handleSubmit = () => {
    //     // 입력된 데이터를 처리하는 로직 추가
    //     console.log('Submitted Value:', inputValue);
    //     onClose();
    // };

    const handleSearch = (results) => {
        setSearchResults(results);
    };

    if (!isOpen) {
        return null;
    }

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
                    zIndex: "9999" /* 다른 요소 위에 위치하도록 설정 */
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
                    <div className='text-end' style={{ height: "10%" }}>
                        <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                    </div>
                    <div>
                        <h3>Submit Related Values</h3>
                    </div>
                    {/* <div>
                        <input 
                            type="text" 
                            value={inputValue} 
                            onChange={handleInputChange} 
                            placeholder="Enter value" 
                            style={{ width: "30%", padding: "10px", margin: "10px 0", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                    </div> */}
                    <div className='text-end'>
                        {/* <button className='btn btn-sm btn-primary' onClick={handleSubmit}>Submit</button> */}
                    </div>
                    <AttSearch onSearch={handleSearch} />
                    <div>
                        <h4>Search Results:</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAttributes;

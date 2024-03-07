import React, { useEffect, useState } from 'react';

function AddAlias() {
    const [aliasList, setAliasList] = useState([]);
    
    const addAlias = (event) => {
        event.preventDefault(); // 이벤트의 기본 동작 방지 (페이지 새로고침 방지)
        const newAlias = event.target.previousElementSibling.value.trim(); // 입력 필드에서 값을 가져옴
        if (newAlias !== '') {
            const newAliasList = [...aliasList, newAlias]; // 새로운 별명을 포함한 새 배열 생성
            setAliasList(newAliasList); // 상태 업데이트
            // 입력 필드 초기화
            event.target.previousElementSibling.value = '';
        }
    }

    const removeAlias = (aliasToRemove) => {
        const updatedAliasList = aliasList.filter(alias => alias !== aliasToRemove);
        setAliasList(updatedAliasList);
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Submit Alias</h3>
                <div>
                    <input></input>
                    <button onClick={addAlias}>Add</button>
                </div>
            </div>
            <div>
                {aliasList.map((alias) => (
                    <div key={alias} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '10px' }}>
                        <div>{alias}</div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16" onClick={() => removeAlias(alias)}>
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <button>Submit</button>
            </div>
        </div>
    )
}

export default AddAlias;
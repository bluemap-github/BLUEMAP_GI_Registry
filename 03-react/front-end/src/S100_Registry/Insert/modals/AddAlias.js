import React, { useEffect, useState } from 'react';

function AddAlias({ onClose, onAliasSubmit, aliasData}) {
    const [aliasList, setAliasList] = useState([...aliasData]);
    
    const addAlias = (event) => {
        event.preventDefault();
        const newAlias = event.target.previousElementSibling.value.trim(); // 입력 필드에서 값을 가져옴
        if (newAlias !== '') {
            const newAliasList = [...aliasList, newAlias]; 
            setAliasList(newAliasList); 
            event.target.previousElementSibling.value = '';
        }
    }

    const removeAlias = (aliasToRemove) => {
        const updatedAliasList = aliasList.filter(alias => alias !== aliasToRemove);
        setAliasList(updatedAliasList);
    }
    const handleSubmit = () => {
        onAliasSubmit(aliasList);
        onClose();
    };

    return (
        <div>
            <div>
                <h3>Submit Alias</h3>
                <div className="input-group input-group-sm mb-3" style={{ width: "40%" }}>
                    <input type="text" className="form-control" aria-describedby="button-addon2" style={{}}/>
                    <button className="btn btn-outline-secondary" onClick={addAlias} type="button" id="button-addon2">Add</button>
                </div>
            </div>
            <div className='mb-3'>
                <h5>Registered alias</h5>
                {aliasList.length > 0? (
                    <div className='p-2 wrap' style={{ display: 'flex', flexWrap: 'wrap', width: "100%", backgroundColor: '#F8F8F8', alignItems: 'center', marginRight: '10px' }}>
                        {aliasList.map((alias) => (
                            <div 
                                key={alias} 
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    marginRight: '10px', 
                                    backgroundColor: '#E0ECF8', 
                                    borderRadius: "20px",
                                }} 
                                className='p-1 m-1 shadow-sm'
                            >
                                <div className='m-1'>{alias}</div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle m-1" viewBox="0 0 16 16" onClick={() => removeAlias(alias)}>
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='p-3' style={{ backgroundColor: '#F8F8F8',display: 'flex',justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>
                        <div className='text-center'>
                            <div>No data</div>
                            <div>Please click the 'Add' button to submit the information</div>
                        </div>
                    </div>
                )}
            </div>
            <div className='text-end'>
                <button className='btn btn-sm btn-primary' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default AddAlias;

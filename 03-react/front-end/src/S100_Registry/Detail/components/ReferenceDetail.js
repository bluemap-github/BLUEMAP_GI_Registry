import React from 'react';

function ReferenceDetail({itemList, handleUpdateButtonClick, handleFollowIdx, handleKeyIdx}) {
    const handleClick = (idx) => {
        handleUpdateButtonClick(4);
        handleFollowIdx(idx);
    }
    const handleAddClick = () => {
        handleUpdateButtonClick(7);
    }
    const handleDelete = (idx) => {
        handleUpdateButtonClick(11);
        handleKeyIdx(idx);
    }
    return (
        <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
            <h4>References</h4>
            <button onClick={handleAddClick}>+ Add</button>
            {itemList.references.map((ref, idx) => (
            <li key={ref.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                <h5>refrence {idx+1}</h5>
                <div>Source Document : {ref.sourceDocument}</div>
                <button style={{maxWidth:"70px"}} onClick={() => handleClick(idx)}>Update</button>
                <div>
                    <button className='btn btn-danger' onClick={() => handleDelete(ref.id)}>Delete</button>
                </div>
            </li>
            ))}
        </div>
    )
}

export default ReferenceDetail
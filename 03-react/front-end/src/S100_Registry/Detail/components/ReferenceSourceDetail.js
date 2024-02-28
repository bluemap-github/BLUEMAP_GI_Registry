import React from 'react';

function ReferenceSourceDetail({itemList, handleUpdateButtonClick, handleKeyIdx}){
    const handleClick = () => {
        handleUpdateButtonClick(3);
    }
    const handleAddClick = () => {
        handleUpdateButtonClick(6);
    }
    const handleDelete = (idx) => {
        handleUpdateButtonClick(10);
        handleKeyIdx(idx);
    }
    return (
        <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
            <h4>Reference Sources</h4>
            <button onClick={handleAddClick}>+ Add</button>
            {itemList.reference_sources.map((source, idx) => (
                <li key={source.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                    <h5>source {idx+1}</h5>
                    <div>Source Document : {source.sourceDocument}</div>
                    <div>Similarity : {source.similarity}</div>
                    <button style={{maxWidth:"70px"}} onClick={handleClick}>Update</button>
                    <div>
                        <button className='btn btn-danger' onClick={() => handleDelete(source.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </div>
    )
}

export default ReferenceSourceDetail;
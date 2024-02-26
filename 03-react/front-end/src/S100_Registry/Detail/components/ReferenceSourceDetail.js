import React from 'react';

function ReferenceSourceDetail({itemList}){
    return (
        <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
            <h4>Reference Sources</h4>
            {itemList.reference_sources.map((source, idx) => (
                <li key={source.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                    <h5>source {idx+1}</h5>
                    <div>Source Document : {source.sourceDocument}</div>
                    <div>Similarity : {source.similarity}</div>
                    <button style={{maxWidth:"70px"}}>Update</button>
                </li>
            ))}
        </div>
    )
}

export default ReferenceSourceDetail;
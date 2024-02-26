import React from 'react';

function ReferenceDetail({itemList}) {
    return (
        <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
            <h4>References</h4>
            {itemList.references.map((ref, idx) => (
            <li key={ref.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                <h5>refrence {idx+1}</h5>
                <div>Source Document : {ref.sourceDocument}</div>
                <button style={{maxWidth:"70px"}}>Update</button>
            </li>
            ))}
        </div>
    )
}

export default ReferenceDetail
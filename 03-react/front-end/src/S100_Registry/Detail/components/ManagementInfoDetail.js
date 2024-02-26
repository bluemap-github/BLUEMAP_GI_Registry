import React from 'react';

function ManagementInfoDetail({itemList, handleUpdateButtonClick}) {
    const handleClick = () => {
        // handleUpdateButtonClick 함수를 호출할 때 변수를 함께 전달
        handleUpdateButtonClick(2);
    };
    return (
        <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
            <h4>Management Details</h4>
            {itemList.management_infos.map((info, idx) => (
            <li key={info.id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                <h5>info {idx+1}</h5>
                <div>Proposal Type : {info.proposalType}</div>
                <div>Submitting Org : {info.submittingOrganisation}</div>
                <div>Proposed Change : {info.proposedChange}</div>
                <div>Date Proposed : {info.dateProposed}</div>
                <div>Date Accepted : {info.dateAmended}</div>
                <button style={{maxWidth:"70px"}} onClick={handleClick}>Update</button>
            </li>
            ))}
        </div>
    )
}

export default ManagementInfoDetail;
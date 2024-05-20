import React, { useState } from 'react';

function ManagementInfoDetail({itemList, handleUpdateButtonClick, handleFollowIdx, handleKeyIdx}) {
    const handleClick = (idx) => {
        // handleUpdateButtonClick 함수를 호출할 때 변수를 함께 전달
        handleUpdateButtonClick(2);
        handleFollowIdx(idx);
    };
    const handleAddClick = () => {
        handleUpdateButtonClick(5);
    }
    const handleDelete = (idx) => {
        handleUpdateButtonClick(9);
        handleKeyIdx(idx);
    }
    const [toggleOpened, setToggleOpened] = useState(true);
    const toggleOpen = () => {
        setToggleOpened(!toggleOpened);
    }
    return (
    <div>
        {toggleOpened ? (
            <div>
                <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#F8F8F8'}}>
                    <div className='' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div className='' style={{ display: 'flex', alignItems: 'center'}}>
                            <h4>Management Details</h4>
                            <button className='btn' onClick={toggleOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                            </button>
                        </div>
                        {toggleOpened && <button className='btn btn-outline-secondary btn-sm' onClick={handleAddClick}>+ Add</button>}
                    </div>  
                    {itemList.management_infos.map((info, idx) => (
                    <li key={info._id} className="mt-3 mb-3 card p-3" style={{listStyle: 'none'}}>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                <th 
                                    colSpan="2" 
                                    className='text-center table-dark' 
                                    scope="col" style={{width: '25%'}}
                                >   
                                <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:"100%"}}>
                                    <div className='text-center' style={{ display: 'flex', alignItems: 'center', width:"80%"}}>
                                        <div>
                                            Management Detail
                                            {itemList.management_infos.length > 1 && <span><span> </span>{idx+1}</span>}
                                        </div>
                                    </div>
                                </div>
                                    
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th className='text-center' scope="row" style={{width: '25%'}}>proposalType</th>
                                <td>{info.proposalType}</td>
                                </tr>
                                <tr>
                                <th className='text-center' scope="row">submittingOrganisation</th>
                                <td>{info.submittingOrganisation}</td>
                                </tr>
                                <tr>
                                <th className='text-center' scope="row">proposedChange</th>
                                <td>{info.proposedChange}</td>
                                </tr>
                                <tr>
                                <th className='text-center' scope="row">dateAccepted</th>
                                <td>{info.dateAccepted}</td>
                                </tr>
                                <tr>
                                <th className='text-center' scope="row">dateProposed</th>
                                <td>{info.dateProposed}</td>
                                </tr>
                                <tr>
                                <th className='text-center' scope="row">dateAmended</th>
                                <td>{info.dateAmended}</td>
                                </tr>
                                <tr>
                                <th className='text-center' scope="row">proposalStatus</th>
                                <td>{info.proposalStatus}</td>
                                </tr>
                                <tr>
                                <th className='text-center' scope="row">controlBodyNotes</th>
                                <td>{info.controlBodyNotes}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-end'>
                            <button 
                                className='btn btn-secondary btn-sm'
                                style={{maxWidth:"70px"}} 
                                onClick={() => handleClick(idx)}
                            >Update</button>
                            {itemList.management_infos.length > 1 && <button className='btn btn-sm btn-danger m-1' onClick={() => handleDelete(info._id)}>Delete</button>}
                        </div>
                    </li>
                    ))}
                </div>
            </div>
            
        ) : (
            <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#F8F8F8'}}>
            <div className='' style={{ display: 'flex', alignItems: 'center'}}>
                <h4>Management Details</h4>
                <button className='btn' onClick={toggleOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16" >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                </button>
                </div>
            </div>
        ) }
        

    </div>
    )
}

export default ManagementInfoDetail;
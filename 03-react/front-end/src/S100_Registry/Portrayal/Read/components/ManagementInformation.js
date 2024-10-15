import React, { useState } from 'react';
import Cookies from 'js-cookie'; 
import PRMngUpdateModal from '../../Update/PRMngUpdateModal'; // Update 모달 컴포넌트
import PRMngAddModal from '../../Update/PRMngAddModal';
import axios from 'axios';
import {DEL_MANAGEMENT_INFO} from '../../api/api';

// 테이블 필드 정의
const tableFields = [
    { name: 'Proposal Type', key: 'proposalType' },
    { name: 'Submitting Organisation', key: 'submittingOrganisation' },
    { name: 'Proposed Change', key: 'proposedChange' },
    { name: 'Date Accepted', key: 'dateAccepted' },
    { name: 'Date Proposed', key: 'dateProposed' },
    { name: 'Date Amended', key: 'dateAmended' },
    { name: 'Proposal Status', key: 'proposalStatus' },
    { name: 'Control Body Notes', key: 'controlBodyNotes' },
];

// 토글 아이콘 컴포넌트
const ToggleButtonIcon = ({ isOpened }) => (
    isOpened ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
    )
);

const ManagementInformation = ({ items, item_id, item_iv }) => {
    const [toggleOpened, setToggleOpened] = useState(true);
    const [updateItem, setUpdateItem] = useState({});
    const [isOpened, setIsOpened] = useState(false);
    const [isAddOpened, setIsAddOpened] = useState(false);
    const role = Cookies.get('role');

    const handleUpdateClick = (item) => {
        setUpdateItem(item);
        setIsOpened(true);
    };

    const handleDeleteClick = async (item) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        
        if (confirmed) {
            try {
    
                await axios({
                    method: 'delete',
                    url: DEL_MANAGEMENT_INFO,
                    data: {
                        item_id: item._id.encrypted_data,
                        item_iv: item._id.iv,
                    },
                });
    
                alert('Item deleted successfully');
                window.location.reload();
            } catch (error) {
                console.error('Deletion failed:', error);
                alert('Failed to delete the item');
            }
        } else {
            console.log("Deletion canceled");
        }
    };

    const onClose = () => {
        setIsOpened(false);
    };
    const onAddClose = () => {
        setIsAddOpened(false);
    };

    const toggleOpen = () => setToggleOpened(!toggleOpened);

    const handleAddClick = () => {
        setIsAddOpened(true);
    };

    if (!tableFields || tableFields.length === 0) {
        return <div>No fields to display.</div>;
    }
    return (
        <>
            <PRMngUpdateModal IsOpened={isOpened} onClose={onClose} data={updateItem} />
            <PRMngAddModal IsOpened={isAddOpened} onClose={onAddClose} item_id={item_id} item_iv={item_iv}/>
            <div className="mt-1 mb-3 p-3" style={{ backgroundColor: '#F8F8F8' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h4>Management Details</h4>
                        <button className='btn' onClick={toggleOpen}>
                            <ToggleButtonIcon isOpened={toggleOpened} />
                        </button>
                    </div>
                    {toggleOpened && role === 'owner' && (
                        <button className='btn btn-outline-secondary btn-sm' onClick={handleAddClick}>+ Add</button>
                    )}
                </div>

                {toggleOpened && items.map((item, idx) => (
                    <div key={idx} className="mt-3 mb-3 card p-3">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th colSpan="2" className='text-center table-primary' scope="col">
                                        Management Detail {idx + 1}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!items || items.length === 0 || items === null ? (
                                    <tr>
                                        <td colSpan={tableFields.length} className="text-center">No management information available.</td>
                                    </tr>
                                ) : (
                                    <>
                                        {tableFields.map(({ name, key }) => (
                                            <tr key={key}>
                                                <th className="text-center" style={{ width: '25%' }}>{name}</th>
                                                <td>{item[key] || "--"}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                        {role === 'owner' && (
                            <div className='text-end'>
                                <button
                                    className='btn btn-secondary btn-sm'
                                    onClick={() => handleUpdateClick(item)}
                                >Update</button>
                                {items.length > 1 && (
                                    <button className='btn btn-danger btn-sm m-1' onClick={() => handleDeleteClick(item)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default ManagementInformation;

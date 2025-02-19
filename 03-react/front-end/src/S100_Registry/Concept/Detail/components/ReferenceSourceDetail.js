import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Import Cookies to check the role
import TableContents from './tags/TableContens';
import { getDecryptedItem } from "../../../../cryptoComponent/storageUtils";

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

const ReferenceSourceDetail = ({ itemList, handleUpdateButtonClick, handleKeyIdx }) => {
    const [toggleOpened, setToggleOpened] = useState(true);
    const role = getDecryptedItem('role'); // Get the user's role from cookies

    const handleClick = () => handleUpdateButtonClick(3);
    const handleAddClick = () => handleUpdateButtonClick(6);
    const handleDelete = (idx) => {
        handleUpdateButtonClick(10);
        handleKeyIdx(idx);
    };
    const toggleOpen = () => setToggleOpened(!toggleOpened);
    if (!itemList || !itemList.reference_sources) {
        return <div>No reference sources available</div>;
    }

    return (
        <div className='mt-1 mb-3 p-3' style={{ backgroundColor: '#F8F8F8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h4>Reference Source</h4>
                    <button className='btn' onClick={toggleOpen}>
                        <ToggleButtonIcon isOpened={toggleOpened} />
                    </button>
                </div>
                {toggleOpened && itemList.reference_sources.length === 0 && role === 'owner' && (
                    <button className='btn btn-outline-secondary btn-sm' onClick={handleAddClick}>+ Add</button>
                )}
            </div>
            {toggleOpened && (
                <div>
                    {itemList.reference_sources.length > 0 ? (
                        <div>
                            {itemList.reference_sources.map((source, idx) => (
                                <li key={source._id} className="mt-3 mb-3 card p-3" style={{ listStyle: 'none' }}>
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th colSpan="2" className='text-center table-primary' scope="col" style={{ width: '25%' }}>
                                                    Reference Source
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <TableContents name='Reference Identifier' itemValue={source.referenceIdentifier} />
                                            <TableContents name='Source Document' itemValue={source.sourceDocument} />
                                            <TableContents name='Similarity' itemValue={source.similarity} />
                                        </tbody>
                                    </table>
                                    {role === 'owner' && (
                                        <div className='text-end'>
                                            <button className='btn btn-secondary btn-sm' style={{ maxWidth: "70px" }} onClick={handleClick}>Update</button>
                                            <button className='btn btn-sm btn-danger m-1' onClick={() => handleDelete(source._id)}>Delete</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </div>
                    ) : (
                        <div className='size-block-inner mt-2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className='text-center'>
                                <div>No data</div>
                                <div>Please click the 'Add' button to submit the information</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ReferenceSourceDetail;

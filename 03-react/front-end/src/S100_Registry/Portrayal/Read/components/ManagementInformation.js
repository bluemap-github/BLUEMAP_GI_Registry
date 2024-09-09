import React from 'react';
import Cookies from 'js-cookie';

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

const ManagementInformation = ({ items }) => {
    const role = Cookies.get('role');  

    const handleUpdateClick = () => {
        console.log("Update clicked"); 
    };

    const handleDeleteClick = () => {
        console.log("Delete clicked"); 
    };

    if (!items || items.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {items.map((item, idx) => (
                <div key={idx} className="mb-3 p-3" style={{ backgroundColor: '#F8F8F8' }}>
                    <div className="mt-3 mb-3 card p-3">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                        Management Information {idx + 1}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableFields.map(({ name, key, isXML, isDescription }) => (
                                    <tr key={key}>
                                        <th className="text-center" style={{ width: '25%' }}>{name}</th>
                                        <td>
                                            {isXML ? (
                                                <pre>{item[key]}</pre>
                                            ) : isDescription && Array.isArray(item[key]) ? ( 
                                                <ul>
                                                    {item[key].map((desc, index) => (
                                                        <li key={index}>
                                                            <strong>Text:</strong> {desc.text || "--"}, <strong>Language:</strong> {desc.language || "--"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                item[key] || "--" 
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {role === 'owner' && (  
                            <div className="text-end">
                                <button className="btn btn-secondary btn-sm" onClick={handleUpdateClick}>Update</button>
                                <button className="btn btn-sm btn-danger m-1" onClick={handleDeleteClick}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default ManagementInformation;

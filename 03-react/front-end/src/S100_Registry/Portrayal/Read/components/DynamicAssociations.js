import React from 'react';

const DynamicAssociations = ({ associationItems }) => {
    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className="p-3 mb-3">
            <div className="mt-3 mb-3 card p-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                associated items
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {associationItems.map((item, index) => (
                            <tr key={index}> {/* key prop 추가 */}
                                <th className="text-center" style={{ width: '25%' }}>{item.associationName}</th>
                                <td>
                                    {item.api}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DynamicAssociations;

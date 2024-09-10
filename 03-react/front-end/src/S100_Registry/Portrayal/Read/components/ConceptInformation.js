import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// 테이블 필드 정의
const tableFields = [
    { name: 'Name', key: 'name' },
    { name: 'Item Type', key: 'itemType' },
    { name: 'Definition', key: 'definition' },
    { name: 'Remarks', key: 'remarks' },
    { name: 'Item Status', key: 'itemStatus' },
    { name: 'Alias', key: 'alias', isAlias: true }, // isAlias 추가
    { name: 'Camel Case', key: 'camelCase' },
    { name: 'Definition Source', key: 'definitionSource' },
    { name: 'Reference', key: 'reference' },
    { name: 'Similarity to Source', key: 'similarityToSource' },
    { name: 'Justification', key: 'justification' },
    { name: 'Proposed Change', key: 'proposedChange' },
];

const ConceptInformation = ({ items }) => {
    const navigate = useNavigate();
    const role = Cookies.get('role');  // role 가져오기

    const handleUpdateClick = () => {
        console.log("Update clicked");
    };

    const handleDeleteClick = () => {
        console.log("Delete clicked");
    };

    if (!items) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="mb-3 p-3" style={{ backgroundColor: '#F8F8F8' }}>
                <div className="mt-3 mb-3 card p-3">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                    Concept Informations
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableFields.map(({ name, key, isAlias, isXML, isDescription }) => (
                                <tr key={key}>
                                    <th className="text-center" style={{ width: '25%' }}>{name}</th>
                                    <td>
                                        {isXML ? (
                                            <pre>{items[key]}</pre>
                                        ) : isDescription && Array.isArray(items[key]) ? ( 
                                            <ul>
                                                {items[key].map((desc, index) => (
                                                    <li key={index}>
                                                        <strong>Text:</strong> {desc.text || "--"}, <strong>Language:</strong> {desc.language || "--"}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : isAlias && Array.isArray(items[key]) ? (  // isAlias 처리
                                            items[key].length > 0 ? (
                                                <ul>
                                                    {items[key].map((alias, index) => (
                                                        <li key={index}>{alias}</li>
                                                    ))}
                                                </ul>
                                            ) : "--"
                                        ) : (
                                            items[key] || "--"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ConceptInformation;

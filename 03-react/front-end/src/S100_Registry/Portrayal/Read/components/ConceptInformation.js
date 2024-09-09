import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ItemContext } from '../../../../context/ItemContext';


// 테이블 필드 정의
const tableFields = [
    { name: 'ID', key: '_id' },
    { name: 'Item Type', key: 'itemType' },
    { name: 'Concept ID', key: 'concept_id' },
    { name: 'Item Identifier', key: 'itemIdentifier' },
    { name: 'Name', key: 'name' },
    { name: 'Item Status', key: 'itemStatus' },
    { name: 'Definition', key: 'definition' },
    { name: 'Remarks', key: 'remarks' },
];

const ConceptInformation = ({ items }) => {
    const navigate = useNavigate();
    const role = Cookies.get('role');  // role 가져오기
    
   

    const handleUpdateClick = () => {
        console.log("Update clicked"); // 이곳에 업데이트 로직을 추가할 수 있음
    };

    const handleDeleteClick = () => {
        console.log("Delete clicked"); // 이곳에 삭제 로직을 추가할 수 있음
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
                            {tableFields.map(({ name, key, isXML, isDescription }) => (
                                <tr key={key}>
                                    <th className="text-center" style={{ width: '25%' }}>{name}</th>
                                    <td>
                                        {isXML ? (
                                            <pre>{items[key]}</pre>
                                        ) : isDescription && Array.isArray(items[key]) ? ( // description 필드가 배열일 경우에만 map을 실행
                                            <ul>
                                                {items[key].map((desc, index) => (
                                                    <li key={index}>
                                                        <strong>Text:</strong> {desc.text}, <strong>Language:</strong> {desc.language}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            items[key] || "--" // 값이 없을 경우 "N/A" 출력
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// 공통 테이블 필드 정의
const commonFields = [
    { name: 'XML ID', key: 'xmlID' },
    { name: 'Descriptions', key: 'description', isDescription: true },
];

// Visual Item 공통 필드 정의
const visualItemFields = [
    { name: 'Item Detail', key: 'itemDetail' },
    { name: 'Preview Image', key: 'previewImage' },
    { name: 'Engineering Image', key: 'engineeringImage' },
    { name: 'Preview Type', key: 'previewType' },
    { name: 'Engineering Image Type', key: 'engineeringImageType' },
];

// 각 itemType에 따라 다른 추가 필드 정의
const specificFields = {
    'Symbol': visualItemFields,
    'LineStyle': visualItemFields,
    'AreaFill': visualItemFields,
    'Pixmap': visualItemFields,
    'SymbolSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'LineStyleSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'AreaFillSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'PixmapSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'ColourProfileSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'ColourToken': [
        { name: 'Token', key: 'token' },
    ],
    'PaletteItem': [],
    'ColourPalette': [],
    'DisplayMode': [],
    'DisplayPlane': [],
    'ViewingGroupLayer': [],
    'ViewingGroup': [],
    'Font': [],
    'ContextParameter': [],
    'DrowingPriority': [],
    'Alert': [],
    'AlertHighlight': [],
    'AlertMessage': [],
};

// 테이블 필드를 리팩토링하여 공통 필드 + 특정 필드를 결합
const getTableFields = (itemType) => [
    ...commonFields,
    ...(specificFields[itemType] || [])
];

const PortrayalDetails = ({ items, itemType }) => {
    const navigate = useNavigate();
    const role = Cookies.get('role');  // role 가져오기

    const moveToList = () => {
        navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/list`);
    };

    const handleUpdateClick = () => {
        console.log("Update clicked");
    };

    const handleDeleteClick = () => {
        console.log("Delete clicked");
    };

    if (!items) {
        return <div>Loading...</div>;
    }

    // itemType에 맞는 테이블 필드 선택
    const fields = getTableFields(itemType);

    return (
        <>
            <div className="mb-3 p-3" style={{ backgroundColor: '#F8F8F8' }}>
                <div className="mt-3 mb-3 card p-3">
                    <table className="table table-sm table-bordered">
                        <thead>
                            <tr>
                                <th colSpan="2" className="text-center table-primary" style={{ width: '25%' }}>
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map(({ name, key, isAlias, isDescription }) => (
                                <tr key={key}>
                                    <th className="text-center" style={{ width: '25%' }}>{name}</th>
                                    <td>
                                        {isDescription && Array.isArray(items[key]) ? (
                                            <ul>
                                                {items[key].map((desc, index) => (
                                                    <li key={index}>
                                                        <strong>Text:</strong> {desc.text || "--"}, <strong>Language:</strong> {desc.language || "--"}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : isAlias && Array.isArray(items[key]) ? (
                                            items[key].map((alias, index) => <span key={index}>{alias} </span>)
                                        ) : (
                                            items[key] || "--"
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
        </>
    );
};

export default PortrayalDetails;

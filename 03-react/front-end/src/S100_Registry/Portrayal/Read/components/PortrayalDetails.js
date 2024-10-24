import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PRItemUpdateModal from '../../Update/PRItemUpdateModal';
import { DEPLOY_URL } from '../../../index';
import {
    DELETE_SYMBOL, DELETE_LINE_STYLE, DELETE_AREA_FILL, DELETE_PIXMAP, 
    DELETE_SYMBOL_SCHEMA, DELETE_LINE_STYLE_SCHEMA, DELETE_AREA_FILL_SCHEMA, DELETE_PIXMAP_SCHEMA, DELETE_COLOUR_PROFILE_SCHEMA,
    DELETE_COLOUR_TOKEN, DELETE_PALETTE_ITEM, DELETE_COLOUR_PALETTE, DELETE_DISPLAY_PLANE, DELETE_DISPLAY_MODE, DELETE_VIEWING_GROUP_LAYER,
    DELETE_VIEWING_GROUP, DELETE_FONT, DELETE_CONTEXT_PARAMETER, DELETE_DRAWING_PRIORITY, DELETE_ALERT, DELETE_ALERT_HIGHLIGHT, DELETE_ALERT_MESSAGE
} from '../../api/api';
import axios from 'axios';

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
    'PaletteItem': [
        { name: 'Transparency', key: 'transparency' },
        { name: 'Colour (sRGB)', key: 'colourValue.sRGB', isColourValue: 'sRGB' },
        { name: 'Colour (CIE)', key: 'colourValue.cie', isColourValue: 'CIE' }
    ],
    'ColourPalette': [],
    'DisplayMode': [],
    'DisplayPlane': [
        { name: 'Order', key: 'order' }
    ],
    'ViewingGroupLayer': [],
    'ViewingGroup': [
        { name: 'Foundation Mode', key: 'foundationMode' }
    ],
    'Font': [
        { name: 'Font File', key: 'fontFile' },
        { name: 'Font Type', key: 'fontType' }
    ],
    'ContextParameter': [
        { name: 'Parameter Type', key: 'parameterType' },
        { name: 'Default Value', key: 'defaultValue' }
    ],
    'DrawingPriority': [
        { name: 'Priority', key: 'priority' }
    ],
    'Alert': [
        // { name: 'Route Monitor', key: 'routeMonitor', isAlert: true },
        // { name: 'Route Plan', key: 'routePlan', isAlert: true }
    ],
    'AlertHighlight': [
        { name: 'Optional', key: 'optional' },
        { name: 'Style', key: 'style' }
    ],
    'AlertMessage': [
        { name: 'Text', key: 'text', isText: true },
    ],
};

const deleteAPIs = {
    'Symbol': DELETE_SYMBOL,
    'LineStyle': DELETE_LINE_STYLE,
    'AreaFill': DELETE_AREA_FILL,
    'Pixmap': DELETE_PIXMAP,
    'SymbolSchema': DELETE_SYMBOL_SCHEMA,
    'LineStyleSchema': DELETE_LINE_STYLE_SCHEMA,
    'AreaFillSchema': DELETE_AREA_FILL_SCHEMA,
    'PixmapSchema': DELETE_PIXMAP_SCHEMA,
    'ColourProfileSchema': DELETE_COLOUR_PROFILE_SCHEMA,
    'ColourToken': DELETE_COLOUR_TOKEN,
    'PaletteItem': DELETE_PALETTE_ITEM,
    'ColourPalette': DELETE_COLOUR_PALETTE,
    'DisplayPlane': DELETE_DISPLAY_PLANE,
    'DisplayMode': DELETE_DISPLAY_MODE,
    'ViewingGroupLayer': DELETE_VIEWING_GROUP_LAYER,
    'ViewingGroup': DELETE_VIEWING_GROUP,
    'Font': DELETE_FONT,
    'ContextParameter': DELETE_CONTEXT_PARAMETER,
    'DrawingPriority': DELETE_DRAWING_PRIORITY,
    'Alert': DELETE_ALERT,
    'AlertHighlight': DELETE_ALERT_HIGHLIGHT,
    'AlertMessage': DELETE_ALERT_MESSAGE,
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

    const [IsOpened, setIsOpened] = useState(false);
    const handleUpdateClick = () => {
        setIsOpened(true);
    };
    const handleDeleteClick = async () => {

        try {
            const res = await axios.delete(deleteAPIs[itemType], {
                params: {
                    item_id: items._id.encrypted_data,
                    item_iv: items._id.iv
                }
            });

            if (res.status === 200) {
                alert('Item deleted successfully');
                moveToList();  // 삭제 후 목록으로 이동
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Failed to delete item');
        } finally {
            console.log('Delete request sent');
        }
    };

    const onClose = () => {
        setIsOpened(false);
    };
    if (!items) {
        return <div>Loading...</div>;
    }

    // itemType에 맞는 테이블 필드 선택
    const fields = getTableFields(itemType);

    
    
    return (
        <>
        <PRItemUpdateModal IsOpened={IsOpened} onClose={onClose} data={items}/>
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
                            {fields.map(({ name, key, isAlias, isDescription, isColourValue, isText, isAlert }) => (
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
                                        ) : isColourValue === 'sRGB' ? (
                                            <div>
                                                <strong>Red:</strong> {items.colourValue?.sRGB?.red || "--"} <br />
                                                <strong>Green:</strong> {items.colourValue?.sRGB?.green || "--"} <br />
                                                <strong>Blue:</strong> {items.colourValue?.sRGB?.blue || "--"}
                                            </div>
                                        ) : isColourValue === 'CIE' ? (
                                            <div>
                                                <strong>X:</strong> {items.colourValue?.cie?.x || "--"} <br />
                                                <strong>Y:</strong> {items.colourValue?.cie?.y || "--"} <br />
                                                <strong>L:</strong> {items.colourValue?.cie?.L || "--"}
                                            </div>
                                        ) : isText && Array.isArray(items[key]) ? (
                                            <ul>
                                                {items[key].map((txt, index) => (
                                                    <li key={index}>
                                                        <strong>Text:</strong> {txt.text || "--"}, <strong>Language:</strong> {txt.language || "--"}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : isAlert && Array.isArray(items[key]) ? (
                                            <ul>
                                                {items[key].map((alert, alertIndex) => (
                                                    <li key={alertIndex}>
                                                        <strong>{name} Set {alertIndex + 1}:</strong>
                                                        <ul>
                                                            {alert.priority.map((priority, priorityIndex) => (
                                                                <li key={priorityIndex}>
                                                                    <strong>Priority:</strong> {priority.priority || "--"}, <strong>Default:</strong> {priority.default || "--"}, <strong>Optional:</strong> {priority.optional || "--"}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : key === 'itemDetail' && items[key] ? (
                                            // Item Detail 항목의 경우 다운로드 버튼만 표시
                                            <div>
                                                <a href={`${DEPLOY_URL}${items[key]}`} download={items[key]} className="btn btn-sm btn-primary">
                                                    자세히
                                                </a>
                                            </div>
                                        ) : (key === 'previewImage' || key === 'engineeringImage') && items[key] ? (
                                            // Preview Image와 Engineering Image는 미리보기와 다운로드 버튼
                                            <div style={{display: 'flex'}}>
                                                <img 
                                                    src={`${DEPLOY_URL}${items[key]}`} 
                                                    alt={name} 
                                                    style={{ maxWidth: '250px', height: 'auto' }} 
                                                />
                                                <div>
                                                    <a href={`${DEPLOY_URL}${items[key]}`} download={items[key]} className="btn btn-sm btn-primary mt-2">
                                                        다운로드
                                                    </a>
                                                </div>
                                                <p>{items[key]}</p>
                                            </div>
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

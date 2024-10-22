import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Axios 라이브러리 사용
import { GET_MESSAGE_ASSOCIATION_LIST, GET_HIGHLIGHT_ASSOCIATION_LIST } from '../../api/api';
import UpdateModal from '../../Update/PRAlertUpdate/UpdateModal';

const tableFields = [
    { name: 'XML ID', key: 'xmlID' },
    { name: 'Descriptions', key: 'description', isDescription: true },
];

const AlertDetails = ({ items }) => {
    const [associations, setAssociations] = useState({});
    const [updateType, setUpdateType] = useState('');
    const [updatePage, setUpdatePage] = useState(0);
    const [isOpened, setIsOpened] = useState(false);

    // Priority _id당 GET 요청 보내기
    const fetchAssociations = async (id) => {
        try {
            const [messageResponse, highlightResponse] = await Promise.all([
                axios.get(GET_MESSAGE_ASSOCIATION_LIST, { params: { item_id: id } }),
                axios.get(GET_HIGHLIGHT_ASSOCIATION_LIST, { params: { item_id: id } })
            ]);

            // 각각의 _id에 대한 결과를 state에 저장
            setAssociations(prevState => ({
                ...prevState,
                [id]: {
                    message: messageResponse.data,
                    highlight: highlightResponse.data
                }
            }));
        } catch (error) {
            console.error(`Error fetching associations for _id: ${id}`, error);
        }
    };

    useEffect(() => {
        // routeMonitor의 _id로 GET 요청
        items?.routeMonitor?.forEach(monitor => {
            fetchAssociations(monitor._id);
        });

        // routePlan의 _id로 GET 요청
        items?.routePlan?.forEach(plan => {
            fetchAssociations(plan._id);
        });
    }, [items]);  // items가 변경될 때만 effect 실행

    const renderAssociationData = (data) => {
        if (data.length === 0) {
            return <p>연결된 게 없습니다</p>;
        }

        return (
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        <strong>XML ID:</strong> {item.xmlID || "--"}, <strong>Item Type:</strong> {item.item_type || "--"}
                    </li>
                ))}
            </ul>
        );
    };

    const handleUpdateClick = (type, page) => {
        setUpdateType(type);  // UpdateType을 설정
        setUpdatePage(page);  // 페이지 설정
        setIsOpened(true);    // 모달 열기
    };

    const onClose = () => {
        setIsOpened(false);
    };

    if (!items) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Portrayal Information */}
            <UpdateModal IsOpened={isOpened} onClose={onClose} data={items} UpdateType={updateType} page={updatePage}/>
            <div className="mb-3 p-3" style={{ backgroundColor: '#F8F8F8' }}>
                <div className="mt-3 mb-3 card p-3">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                    Portrayal Information
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableFields.map(({ name, key, isDescription }) => (
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
                                        ) : (
                                            items[key] || "--"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='text-end'>
                        <button className='btn btn-sm btn-outline-primary' onClick={() => handleUpdateClick('AlertItem', 0)}>Update Alert</button>
                    </div>
                </div>
            </div>

            {/* Route Monitor Information */}
            <div className="mb-3 p-3" style={{ backgroundColor: '#F8F8F8' }}>
                <div className="mt-3 mb-3 card p-3">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                    Route Monitor Information
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.routeMonitor?.map((monitor, index) => (
                                <tr key={index}>
                                    <th className="text-center" style={{ width: '25%' }}>Priority, {monitor._id}</th>
                                    <td>
                                        <ul>
                                            {monitor.priority.map((priority, pIndex) => (
                                                <li key={pIndex}>
                                                    <strong>Priority:</strong> {priority.priority}, <strong>Default:</strong> {priority.default ? 'Yes' : 'No'}, <strong>Optional:</strong> {priority.optional ? 'Yes' : 'No'}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className='text-end'>
                                            <button className='btn btn-sm btn-outline-primary'  onClick={() => handleUpdateClick('RouteMonitor', index)}>Update Route Monitor</button>
                                        </div>
                                        <hr style={{ borderTop: '1px solid gray', width: '100%', margin: '20px 0' }} />
                                        {/* 이 부분이  Route Monitor Association 부분*/}
                                        <p><strong>Message Association:</strong> {renderAssociationData(associations[monitor._id]?.message?.data || [])}</p>
                                        <p><strong>Highlight Association:</strong> {renderAssociationData(associations[monitor._id]?.highlight?.data || [])}</p>
                                        <div className='text-end'>
                                            <button className='btn btn-sm btn-outline-primary' onClick={() => handleUpdateClick('AlertAssociation', 0)}>Update Route Monitor Association</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Route Plan Information */}
            <div className="mb-3 p-3" style={{ backgroundColor: '#F8F8F8' }}>
                <div className="mt-3 mb-3 card p-3">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                    Route Plan Information
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.routePlan?.map((plan, index) => (
                                <tr key={index}>
                                    <th className="text-center" style={{ width: '25%' }}>Priority, {plan._id}</th>
                                    <td>
                                        <ul>
                                            {index}
                                            {plan.priority.map((priority, pIndex) => (
                                                <li key={pIndex}>
                                                    <strong>Priority:</strong> {priority.priority}, <strong>Default:</strong> {priority.default ? 'Yes' : 'No'}, <strong>Optional:</strong> {priority.optional ? 'Yes' : 'No'}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className='text-end'>
                                            <button className='btn btn-sm btn-outline-primary' onClick={() => handleUpdateClick('RoutePlan', index)}>Update Route Plan</button>
                                        </div>
                                        <hr style={{ borderTop: '1px solid gray', width: '100%', margin: '20px 0' }} />
                                        {/* API 결과 출력 */}
                                        <p><strong>Message Association:</strong> {renderAssociationData(associations[plan._id]?.message?.data || [])}</p>
                                        <p><strong>Highlight Association:</strong> {renderAssociationData(associations[plan._id]?.highlight?.data || [])}</p>
                                        <div className='text-end'>
                                            <button className='btn btn-sm btn-outline-primary' onClick={() => handleUpdateClick('AlertAssociation', 0)}>Update Route Plan Association</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AlertDetails;
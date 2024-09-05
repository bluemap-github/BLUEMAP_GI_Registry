import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';
import TableContents from '../../Concept/Detail/components/tags/TableContens';

const FDetail = ({ item }) => {
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();

    const movetoPage = (value) => {
        setItemDetails({
            view_item_type: value.itemType,
            user_serial: USER_SERIAL,
            item_id: value.encrypted_data,
            item_iv: value.iv,
        });
        navigate(`/${Cookies.get('REGISTRY_URI')}/dataDictionary/detail`);
    };

    const movetoConcept = (value) => {
        setItemDetails({
            view_item_type: value.itemType,
            user_serial: USER_SERIAL,
            item_id: value._id.encrypted_data,
            item_iv: value._id.iv,
        });
        navigate(`/${Cookies.get('REGISTRY_URI')}/concept/detail`);
    };

    const fields = [
        { name: 'Name', key: 'name' },
        { name: 'Item Type', key: 'itemType' },
        { name: 'Concept ID', key: 'concept_id' },
        { name: 'Item Identifier', key: 'itemIdentifier' },
        { name: 'Definition', key: 'definition' },
        { name: 'Remarks', key: 'remarks' },
        { name: 'Status', key: 'itemStatus' },
        { name: 'Camel Case', key: 'camelCase' },
        { name: 'Definition Source', key: 'definitionSource' },
        { name: 'Reference', key: 'reference' },
        { name: 'Similarity to Source', key: 'similarityToSource' },
        { name: 'Justification', key: 'justification' },
        { name: 'Proposed Change', key: 'proposedChange' },
        { name: 'Feature Use Type', key: 'featureUseType' },
    ];

    return (
        <div className="d-flex justify-content-between p-3" style={{ backgroundColor: '#F8F8F8' }}>
            {/* Main Detail Table */}
            <div className='p-3' style={{ flex: 7, backgroundColor: '#FFFFFF' }}>
                <div className="card p-3">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className='text-center table-primary' scope="col">Feature Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map(({ name, key }) => (
                                <TableContents
                                    key={key}
                                    name={name}
                                    itemValue={item[key]}
                                />
                            ))}
                            <tr>
                                <th className='text-center' style={{ alignContent: 'center' }}>Move to Concept Page</th>
                                <td style={{ alignContent: "center" }}>
                                    <button onClick={() => movetoConcept(item)} className='btn btn-outline-primary'>Concept Detail</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Distinction Table */}
            <div className='p-3' style={{ flex: 3, backgroundColor: '#FFFFFF' }}>
                <div className="card p-3" style={{ height: "100%" }}>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className='text-center table-primary' scope="col">Distinctions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.distinction && item.distinction.length > 0 ? (
                                item.distinction.map((dist, idx) => (
                                    <tr key={idx} onClick={() => movetoPage(dist)} className="clickable-item">
                                        <td>{dist.name}</td>
                                        <td>{dist.itemType}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">No Distinctions Available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FDetail;

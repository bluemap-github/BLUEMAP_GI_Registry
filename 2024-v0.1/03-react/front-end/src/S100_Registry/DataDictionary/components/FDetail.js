import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ItemContext } from '../../../context/ItemContext';
import TableContents from '../../Concept/Detail/components/tags/TableContens';
import DDRUpdate from '../Update/DDRUpdate';
import AssoUpdate from '../Update/AssoUpdate';
import { getDecryptedItem, setEncryptedItem } from "../../../cryptoComponent/storageUtils";

const FDetail = ({ item }) => {
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();
    const role = getDecryptedItem('role');
    const movetoPage = (value) => {
        setItemDetails({
            view_item_type: value.itemType,
            item_id: value.encrypted_data,
            item_iv: value.iv,
        });
        navigate(`/${getDecryptedItem('REGISTRY_URI')}/dataDictionary/detail`);
    };

    const movetoConcept = (value) => {
        setItemDetails({
            view_item_type: value.itemType,
            item_id: value._id.encrypted_data,
            item_iv: value._id.iv,
        });
        navigate(`/${getDecryptedItem('REGISTRY_URI')}/concept/detail`);
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

    const [IsOpened, setIsOpened] = useState(false);
    const handleUpdateClick = () => {
        setIsOpened(true);
    };
    const onClose = () => {
        setIsOpened(false);
    };

    const [IsAssoOpened, setIsAssoOpened] = useState(false);
    const handleAssoUpdateClick = () => {
        setIsAssoOpened(true);
    };
    const onAssoClose = () => {
        setIsAssoOpened(false);
    };
    return (
        <div>
            <DDRUpdate IsOpened={IsOpened} onClose={onClose} data={item} />
            {item ? (
                <h3 style={{display: 'flex', alignItems: 'center'}}>
                <span className="badge text-bg-success">Data Dictionary</span>
                <span style={{marginLeft : "15px"}} className="badge text-bg-info">Feature Type</span>
                <div style={{marginLeft : "15px"}}>{item.name}</div>
                </h3>
            ) : (
                <p style={{ fontWeight: "bold", color: "gray" }}>
                Loading portrayal information...
                </p>
            )}
            <div style={{ height: '5px', borderBottom: '1px solid #d1d1d1', marginBottom: '15px' }}></div>
            <div style={{ backgroundColor: '#F8F8F8' }}>
                <div className='p-3' style={{ flex: 7}}>
                    <div className="card p-3">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th colSpan="2" className='text-center table-primary' scope="col">
                                        Feature Detail
                                    </th>
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
                                    <th className='text-center' style={{alignContent: 'center'}}>Move to Concept Page</th>
                                    <td style={{alignContent: "center"}} >
                                        <button onClick={() => movetoConcept(item)} className='btn btn-outline-primary'>Concept Detail</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {role === 'owner' && (  
                        <div className="text-end">
                            <button onClick={handleUpdateClick} className='btn btn-sm btn-secondary'>
                                Update
                            </button>
                        </div>)}
                    </div>
                </div>

                {/* Distinction Table */}
                <AssoUpdate IsOpened={IsAssoOpened} onClose={onAssoClose} data={item} />
                <div className='p-3' style={{ flex: 3}}>
                    <div className="card p-3" style={{height: "100%"}}>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th colSpan="2" className='text-center table-primary' scope="col">
                                        Distinctions
                                    </th>
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
                                        <td colSpan="2">No Distinctions Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {role === 'owner' && (  
                        <div className="text-end">
                            <button onClick={handleAssoUpdateClick} className='btn btn-sm btn-secondary'>
                                Update
                            </button>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default FDetail;

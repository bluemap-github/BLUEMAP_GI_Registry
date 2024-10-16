import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';
import Cookies from 'js-cookie';
import TableContents from '../../Concept/Detail/components/tags/TableContens';
import DDRUpdate from '../Update/DDRUpdate';

// Listed Value와 Associated Attribute의 필드 정의
const listedValueFields = [
    { name: 'Name', key: 'name' },
    { name: 'Numeric Code', key: 'numericCode' },
    // { name: 'Item Type', key: 'itemType' },
    { name: 'Definition', key: 'definition' },
    { name: 'Item Identifier', key: 'itemIdentifier' },
    { name: 'Camel Case', key: 'camelCase' },
    { name: 'Listed Value Type', key: 'enumType' },
];

const associatedAttributeFields = [
    { name: 'Associated Attribute', key: 'attributeId', isAttribute: true }
];

const EVDetail = ({ item }) => {

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

    const [IsOpened, setIsOpened] = useState(false);
    const handleUpdateClick = () => {
        setIsOpened(true);
    };
    const onClose = () => {
        setIsOpened(false);
    };

    return (
        <div>
            <DDRUpdate IsOpened={IsOpened} onClose={onClose} data={item} />
            <h3 style={{fontWeight: "bold"}}>Enumerated Value</h3>
            <div style={{ height: '5px', borderBottom: '1px solid #d1d1d1', marginBottom: '15px' }}></div>
            <div className='p-3' style={{ flex: 6, backgroundColor: '#F8F8F8'}}>
                <div className=" card p-3">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className='text-center table-primary' scope="col">
                                    Listed Value Information
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listedValueFields.map(({ name, key }) => (
                                <TableContents
                                    key={key}
                                    name={name}
                                    itemValue={item[key]}
                                />
                            ))}
                            <tr>
                                <th className='text-center' style={{alignContent: 'center'}}>Move to Concept Page</th>
                                <td style={{alignContent: "center"}} >
                                    <button onClick={() => movetoConcept(item)} className='btn btn-sm btn-outline-primary'>Concept Detail</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="text-end">
                        <button onClick={handleUpdateClick} className='btn btn-sm btn-secondary'>
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-4 p-3' style={{ flex: 4, backgroundColor: '#F8F8F8'}}>
                <div className=" card p-3">
                    <table className="table table-sm" style={{ width: '100%'}}>
                        <thead>
                            <tr>
                                <th colSpan="2" className='text-center table-primary' scope="col" style={{ width: '25%' }}>
                                    Associated Attribute
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {associatedAttributeFields.map(({ name, key, isAttribute }) => (
                                isAttribute && item[key] && item[key].length > 0 ? (
                                    item[key].map((value, idx) => (
                                        <>
                                            <tr key={idx}>
                                                <th className='text-center' style={{alignContent: 'center', width: '25%'}}>Attribute Name</th>
                                                <td>{value.name}</td>
                                            </tr>
                                            <tr>
                                                <th className='text-center' scope="row" style={{ width: '25%' }}>Attribute Type</th>
                                                <td>{value.itemType}</td>
                                            </tr>
                                            <tr>
                                                <th className='text-center' style={{alignContent: 'center'}}>Move to Attribute Info Page</th>
                                                <td style={{alignContent: "center"}}>
                                                    <button onClick={() => movetoPage(value)} className='btn btn-sm btn-outline-primary'>Attribute Detail</button>
                                                </td>
                                            </tr>
                                        </>
                                    ))
                                ) : (
                                    <tr key={key}>
                                        <td colSpan="2">No Associated Attribute</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <button className='btn btn-sm btn-secondary'>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EVDetail;

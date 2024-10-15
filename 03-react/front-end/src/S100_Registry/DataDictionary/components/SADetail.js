import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';
import { getAttributeConstraints } from '../../components/requestAPI.js';
import Cookies from 'js-cookie';
import TableContents from '../../Concept/Detail/components/tags/TableContens';

// Constraints fields definition
const constraintFields = [
    { name: 'String Length', key: 'stringLength' },
    { name: 'Text Pattern', key: 'textPattern' },
    { name: 'AC Range', key: 'ACRange' },
    { name: 'Precision', key: 'precision' },
];

const SADetail = ({ item }) => {

    const { setItemDetails } = useContext(ItemContext);
    const [constraints, setConstraints] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAttributeConstraints(item._id.encrypted_data, item._id.iv);
            setConstraints(result);
        };
        fetchData();
    }, [item]);

    return (
        <div className="d-flex justify-content-between">
            {/* Simple Attribute Table */}
            <div className='p-3' style={{ flex: 7, backgroundColor: '#F8F8F8' }}>
                <div className="card p-3">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th colSpan="2" className='text-center table-primary' scope="col" style={{ width: '25%' }}>
                                    Simple Attribute
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableContents name="Name" itemValue={item.name} />
                            <TableContents name="Camel Case" itemValue={item.camelCase} />
                            <TableContents name="Value Type" itemValue={item.valueType} />
                            <TableContents name="Definition" itemValue={item.definition} />
                            <TableContents name="Item Identifier" itemValue={item.itemIdentifier} />
                            <TableContents name="Quantity Specification" itemValue={item.quantitySpecification} />
                            {/* <tr></tr> */}
                            <tr>
                                <th className='text-center' style={{alignContent: 'center'}}>Move to Concept Page</th>
                                <td style={{alignContent: "center"}} >
                                    <button onClick={() => movetoConcept(item)} className='btn btn-outline-primary'>Concept Detail</button>
                                </td>
                            </tr>
                            <tr>
                                <td style={{height: '20px'}}></td>
                            </tr>
                            
                        </tbody>
                        <thead>
                            <tr>
                                <th colSpan="2" className='text-center table-primary' scope="col" style={{ width: '25%' }}>
                                    Constraints
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {constraints.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className='text-center'>No Constraints</td>
                                </tr>
                            ) : (
                                constraints.map((constraint, idx) => (
                                    constraintFields.map(({ name, key }) => (
                                        <TableContents
                                            key={`${key}-${idx}`}
                                            name={name}
                                            itemValue={constraint[key]}
                                        />
                                    ))
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Listed Value Table */}
            {item.valueType === 'enumeration' || item.valueType === 'S100_CodeList' ? (
                <div className='p-3' style={{ flex: 3, backgroundColor: '#F8F8F8', height: 'auto' }}>
                    <div className="card p-3" style={{ height: "100%" }}>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th colSpan="2" className='text-center table-primary' scope="col" style={{ width: '25%' }}>
                                        Listed Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.listedValue.length === 0 ? (
                                    <tr>
                                        <td colSpan="2">No Listed Value</td>
                                    </tr>
                                ) : (
                                    item.listedValue.map((value, idx) => (
                                        <tr key={idx}>
                                            <td colSpan="2" onClick={() => movetoPage(value)} className="clickable-item text-center">
                                                {value.name}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default SADetail;

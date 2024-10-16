import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';
import { DDR_DETAIL } from '../../../Common/PageLinks';
import DDRUpdate from '../Update/DDRUpdate';
import Cookies from 'js-cookie'; 

const CADetail = ({item}) => {
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
    }
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
            <h3 style={{ fontWeight: "bold" }}>Complex Attribute</h3>
            <div style={{ height: '5px', borderBottom: '1px solid #d1d1d1', marginBottom: '15px' }}></div>
            
            {/* Complex Attribute Table */}
            <div style={{ backgroundColor: '#F8F8F8' }}>
                <div className='p-3' >
                    <div className="card p-3">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th colSpan="2" className='text-center table-primary' scope="col">
                                        Complex Attribute Detail
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td  className='text-center' scope="row" style={{ fontWeight: 'bold', width: "25%"}}>Name</td>
                                    <td>{item.name}</td>
                                </tr>
                                <tr>
                                    <td className='text-center' scope="row" style={{ fontWeight: 'bold' }}>Camel Case</td>
                                    <td>{item.camelCase}</td>
                                </tr>
                                <tr>
                                    <td className='text-center' scope="row" style={{ fontWeight: 'bold' }}>Value Type</td>
                                    <td>{item.valueType}</td>
                                </tr>
                                <tr>
                                    <td className='text-center' scope="row" style={{ fontWeight: 'bold' }}>Definition</td>
                                    <td>{item.definition}</td>
                                </tr>
                                <tr>
                                    <td className='text-center' scope="row" style={{ fontWeight: 'bold' }}>Item Identifier</td>
                                    <td>{item.itemIdentifier}</td>
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

                {/* Sub Attributes Table */}
                <div className='p-3' style={{ flex: 3 }}>
                    <div className="card p-3" style={{ height: "100%" }}>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th colSpan="2" className='text-center table-primary' scope="col">
                                        Sub Attributes
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.subAttribute && item.subAttribute.length > 0 ? (
                                    item.subAttribute.map((value, idx) => (
                                        <tr key={idx} onClick={() => movetoPage(value)} className="clickable-item">
                                            <td colSpan="2">{value.name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2">No Sub Attributes Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CADetail;
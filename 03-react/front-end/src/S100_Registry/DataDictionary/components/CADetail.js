import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemContext } from '../../../context/ItemContext';
import AssoUpdate from '../Update/AssoUpdate';
import DDRUpdate from '../Update/DDRUpdate';
import Cookies from 'js-cookie'; 

const CADetail = ({item}) => {
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();
    const movetoPage = (value) => {
        setItemDetails({ 
            view_item_type: value.itemType, 
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
                <h2 style={{display: 'flex', alignItems: 'center'}}>
                <span className="badge text-bg-success">Data Dictionary</span>
                <span style={{marginLeft : "15px"}} className="badge text-bg-info">Complex Attribute</span>
                <div style={{marginLeft : "15px"}}>{item.name}</div>
                </h2>
            ) : (
                <p style={{ fontWeight: "bold", color: "gray" }}>
                Loading portrayal information...
                </p>
            )}
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
                <AssoUpdate IsOpened={IsAssoOpened} onClose={onAssoClose} data={item} />
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
                        <div className="text-end">
                            <button onClick={handleAssoUpdateClick} className='btn btn-sm btn-secondary'>
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CADetail;
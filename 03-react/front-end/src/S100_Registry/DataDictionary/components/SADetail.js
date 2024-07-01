import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';

const SADetail = ({ item }) => {
    const { setItemDetails } = useContext(ItemContext);
    const navigate = useNavigate();

    const movetoPage = (value) => {
        setItemDetails({ 
            view_item_type: "EnumeratedValue", 
            user_serial: USER_SERIAL, 
            item_id: value.encrypted_data,
            item_iv: value.iv,
        });
        navigate('/dataDictionary');
    }

    return (
        <div>
            <div className='m-3'>
                <ul>
                    <h3 style={{ fontWeight: 'bold' }}>Simple Attribute</h3>
                    <li>- Name: {item.name}</li>
                    <li>- Camel Case: {item.camelCase}</li>
                    <li>- Value Type: {item.valueType}</li>
                    <li>- Definition: {item.definition}</li>
                    <li>- Item Identifier: {item.itemIdentifier}</li>
                </ul>
            </div>
            {item.valueType === 'enumeration' || item.valueType === 'S100_CodeList' ? (
                <>
                    <hr />
                    <div className='m-3'>
                        <ul>
                            <h6 style={{ fontWeight: 'bold' }}>Listed Value</h6>
                            {item.listedValue.length === 0 ? (
                                <li>No Listed Value</li>
                            ) : (
                                item.listedValue.map((value, idx) => (
                                    <li key={idx} onClick={() => movetoPage(value)}>- Value {idx + 1} : {value.encrypted_data}</li>
                                ))
                            )}
                        </ul>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default SADetail;

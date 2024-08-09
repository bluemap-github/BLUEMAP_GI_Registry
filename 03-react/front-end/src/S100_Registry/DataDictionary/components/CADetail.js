import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';
import { DDR_DETAIL } from '../../../Common/PageLinks';

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
        navigate(DDR_DETAIL);
    }
    return (
        <div>
            <div className='m-3'>
                <ul>
                    <h3 style={{ fontWeight: 'bold' }}>Complex Attribute</h3>
                    <li>- Name: {item.name}</li>
                    <li>- Camel Case: {item.camelCase}</li>
                    <li>- Value Type: {item.valueType}</li>
                    <li>- Definition: {item.definition}</li>
                    <li>- Item Identifier: {item.itemIdentifier}</li>
                </ul>
            </div>
            <hr />
            <div className='m-3'>
                <ul>
                    <h6 style={{ fontWeight: 'bold' }}>Sub Attributes</h6>
                    {item.subAttribute.length === 0 ? (
                        <li>No Sub Attribute</li>
                    ) : (
                        item.subAttribute.map((value, idx) => (
                            <li key={idx} onClick={() => movetoPage(value)}>- {value.name}</li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CADetail;
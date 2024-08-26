import React, {useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';
import { DDR_DETAIL } from '../../../Common/PageLinks';
import Cookies from 'js-cookie'; 
const EVDetail = ({item}) => {
    const { itemDetails, setItemDetails } = useContext(ItemContext);
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

    return (
        <div>
            <div className='m-3'>
                <ul>
                    <h3 style={{fontWeight: "bold"}}>Listed Value</h3>
                    <li>- Numeric Code : {item.numericCode}</li>
                    <li>- Name : {item.name}</li>
                    <li>- Item Type : {item.enumType}</li>
                    <li>- Definition : {item.definition}</li>
                    <li>- Item Identifier : {item.itemIdentifier}</li>
                    <li>- Camel Case : {item.camelCase}</li>
                    <li>- Listed Value Type : {item.enumType}</li>
                </ul>
            </div>
            <hr></hr>
            <div className='m-3'>
                <ul>
                    <h6 style={{fontWeight: "bold"}}>Associated Attribute</h6>
                    {
                        item.attributeId === undefined || item.attributeId.length === 0 ? (
                            <li>No Associated Attribute</li>
                        ) : (
                            item.attributeId.map((value, idx) => (
                                <li key={idx} onClick={() => movetoPage(value)}>- {value.name}</li>
                            ))
                        )
                    }
                </ul>
            </div>
        </div>
    );
};

export default EVDetail;
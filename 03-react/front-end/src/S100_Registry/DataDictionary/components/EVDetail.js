import React, {useEffect, useContext} from 'react';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';

const EVDetail = ({item}) => {
    const { itemDetails, setItemDetails } = useContext(ItemContext);
    useEffect(() => {
        setItemDetails({ 
            view_item_type: "SimpleAttribute", 
            user_serial: USER_SERIAL, 
            item_id: item.attributeId.encrypted_data,
            item_iv: item.attributeId.iv,
        });
    }, [item]);

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
                        item.attributeId === "" ? (
                            <li>No Associated Attribute</li>
                        ) : (
                            <li>- Attribute Name : 
                                <span onClick={() => window.location=`/dataDictionary`}>
                                    {item.attributeId.encrypted_data}
                                </span>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    );
};

export default EVDetail;
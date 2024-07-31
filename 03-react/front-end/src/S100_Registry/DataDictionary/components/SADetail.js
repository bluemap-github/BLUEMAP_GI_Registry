import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_SERIAL } from '../../../userSerial';
import { ItemContext } from '../../../context/ItemContext';
import {getAttributeConstraints} from '../../components/requestAPI.js'


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
        navigate('/dataDictionary');
    }
    useEffect(() => {
        const fetchData = async () => {
            const result = await getAttributeConstraints(item._id.encrypted_data, item._id.iv);
            setConstraints(result);
        };
        fetchData();
    }
    , []);

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
            <hr />
            <div className='m-3'>
                <ul>
                <h6 style={{ fontWeight: 'bold' }}>Constraints</h6>
                {
                    constraints.length === 0 ? (
                        <div>No constraints</div>
                    ):(
                    <>
                        {constraints.map((constraint, idx) => (
                            <div>
                                <li key={idx}>- stringLength : {constraint.stringLength}</li>
                                <li key={idx}>- textPattern : {constraint.textPattern}</li>
                                <li key={idx}>- ACRange : {constraint.ACRange}</li>
                                <li key={idx}>- precision : {constraint.precision}</li>
                            </div>  
                        ))}
                    </>
                    )
                }
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
                                    <li key={idx} onClick={() => movetoPage(value)}>- {value.name}</li>
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

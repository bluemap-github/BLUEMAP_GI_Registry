import React, {useState, useEffect, useContext} from 'react';
import Toast from '../../../Toast';
import { ItemContext } from '../../../../context/ItemContext';
import { USER_SERIAL } from '../../../../userSerial';   
function ItemDetail({itemList, handleUpdateButtonClick, handleKeyIdx}) {
    const viewItemType = itemList.item.itemType;
    
    const handleClick = () => {
        // handleUpdateButtonClick 함수를 호출할 때 변수를 함께 전달
        handleUpdateButtonClick(1);
    };
    const { itemDetails, setItemDetails } = useContext(ItemContext);
    const { view_item_type, item_id, item_iv } = itemDetails;

    useEffect(() => {
        setItemDetails({ 
            view_item_type: view_item_type, 
            user_serial: USER_SERIAL, 
            item_id: item_id,
            item_iv: item_iv,
            view_item_type: itemList.item.itemType
        });
    }, [itemList]);

    const handleDelete = (idx) => {
        handleUpdateButtonClick(8);
        handleKeyIdx(idx);
    }
    return (
        <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#F8F8F8'}}>
            <div className="mt-3 mb-3 card p-3">
                <table className="table table-sm">
                    <thead>
                        <tr>
                        <th 
                            colSpan="2" 
                            className='text-center table-dark' 
                            scope="col" style={{width: '25%'}}
                        >
                            Register Data Detail
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className='text-center' scope="row" style={{width: '25%'}}>Go to Detail Page</th>
                            <button onClick={() => window.location=`/dataDictionary`}>Detail</button>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row" style={{width: '25%'}}>Item Type</th>
                        <td>{itemList.item.itemType}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Name</th>
                        <td>{itemList.item.name}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Definition</th>
                        <td>{itemList.item.definition}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Remarks</th>
                        <td>{itemList.item.remarks}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Item Status</th>
                        <td>{itemList.item.itemStatus}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Alias</th>
                        <td>
                            {Object.values(itemList.item.alias).map((item, index) => (<span key={index}>{item}; </span>))}
                        </td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Camel Case</th>
                        <td>{itemList.item.camelCase}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Definition Source</th>
                        <td>{itemList.item.definitionSource}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Reference</th>
                        <td>{itemList.item.reference}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Similarity to Source</th>
                        <td>{itemList.item.similarityToSource}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Justification</th>
                        <td>{itemList.item.justification}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">Proposed Change</th>
                        <td>{itemList.item.proposedChange}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='text-end'>
                <button className='btn btn-secondary btn-sm' onClick={handleClick}>Update</button>
                <button className='btn btn-sm btn-danger m-1' onClick={() => handleDelete(itemList.item._id)}>Delete</button>
            </div>
            
        </div>
    )
}

export default ItemDetail;
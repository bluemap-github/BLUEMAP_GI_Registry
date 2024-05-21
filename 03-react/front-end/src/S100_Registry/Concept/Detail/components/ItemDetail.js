import React from 'react';
import Toast from '../../../Toast';
function ItemDetail({itemList, handleUpdateButtonClick, handleKeyIdx}) {
    
    const handleClick = () => {
        // handleUpdateButtonClick 함수를 호출할 때 변수를 함께 전달
        handleUpdateButtonClick(1);
    };
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
                        <th className='text-center' scope="row" style={{width: '25%'}}>itemIdentifier</th>
                        <td>{itemList.item.itemIdentifier}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">name</th>
                        <td>{itemList.item.name}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">definition</th>
                        <td>{itemList.item.definition}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">remarks</th>
                        <td>{itemList.item.remarks}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">itemStatus</th>
                        <td>{itemList.item.itemStatus}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">alias</th>
                        <td>
                            {Object.values(itemList.item.alias).map((item, index) => (<span key={index}>{item}; </span>))}
                        </td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">camelCase</th>
                        <td>{itemList.item.camelCase}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">definitionSource</th>
                        <td>{itemList.item.definitionSource}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">reference</th>
                        <td>{itemList.item.reference}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">similarityToSource</th>
                        <td>{itemList.item.similarityToSource}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">justification</th>
                        <td>{itemList.item.justification}</td>
                        </tr>
                        <tr>
                        <th className='text-center' scope="row">proposedChange</th>
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
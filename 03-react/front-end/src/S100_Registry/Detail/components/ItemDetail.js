import React from 'react';
function ItemDetail({itemList, handleUpdateButtonClick}) {

    const handleClick = () => {
        // handleUpdateButtonClick 함수를 호출할 때 변수를 함께 전달
        handleUpdateButtonClick(1);
    };
    return (
        <div className='mt-1 mb-3 p-3' style={{backgroundColor : '#f5f4f2'}}>
            <h4>Concept Details</h4>
            <div>Name : {itemList.item.name}</div>
            <div>Alias : {JSON.stringify(itemList.item.alias)}</div>
            <div>CamelCase : {itemList.item.camelCase}</div>
            <div>Definition : {itemList.item.definition}</div>
            <button onClick={handleClick}>Update</button>
            
        </div>
    )
}

export default ItemDetail;
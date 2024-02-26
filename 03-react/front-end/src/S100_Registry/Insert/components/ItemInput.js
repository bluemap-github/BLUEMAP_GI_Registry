import React from 'react';

function ItemInput({item, ItemChange}) {
    return (
        <div>
            <h3>Items</h3>
            <textarea 
                className='mt-3'
                style={{ 
                    width: "100%",
                    height: "18rem",
                    }}
                value={item}
                onChange={ItemChange}
                placeholder='Item 쓰는 곳'
            ></textarea>
        </div>
        
    )
}

export default ItemInput;
import React, { useState } from 'react';
import axios from 'axios';

const putItemUrl = (itemId) => {
    return `http://127.0.0.1:8000/api/v1/registerItem/${itemId}/put/`;
};

function ItemUpdate({items, onClose}){

    const str = JSON.stringify(items)
    const [item, setItem] = useState(str);


    const ItemChange = (event) => {
        setItem(event.target.value);
    };

    const handleSubmitItem = async () => {
        try {
            const itemId = items.id;
            const UpdatedItemData = JSON.parse(item);
            const itemResponse = await axios.put(putItemUrl(itemId), UpdatedItemData);
            console.log('Item data successfully put:', itemResponse.data);
            onClose()
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    return(
        <div>
            <div>
                <textarea 
                    className='mt-3'
                    style={{ 
                        width: "100%",
                        height: "18rem",
                        }}
                    value={item}
                    onChange={ItemChange}
                    placeholder={item}
                ></textarea>
                <button onClick={handleSubmitItem}>update</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
export default ItemUpdate;
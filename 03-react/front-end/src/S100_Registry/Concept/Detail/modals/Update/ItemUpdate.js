import React, { useEffect, useState, useContext } from 'react';
import { ItemContext } from '../../../../../context/ItemContext';
import axios from 'axios';
import { PUT_ITEM_URL } from '../../../api';
import UpdateInput from '../tags/UpdateInput';

function ItemUpdate({ items, onClose }) {
    const [item, setItem] = useState(items);
    const { itemDetails } = useContext(ItemContext); 
    const { item_id, item_iv } = itemDetails;

    useEffect(() => {
        // setItem(items); // props로 받은 items를 초기 상태로 설정
    }, [items]);

    const ItemChange = (event) => {
        const updatedItem = { ...item, [event.target.name]: event.target.value };
        setItem(updatedItem);
    };

    const handleSubmitItem = async () => {
        const confirmSubmit = window.confirm("Are you sure you want to update this item?");
        if (!confirmSubmit) return; // Exit if the user cancels
    
        try {
            await axios.put(PUT_ITEM_URL, item, {
                params: {
                    "item_id": item_id,
                    "item_iv": item_iv,
                    "item_type": items.itemType,
                }
            });
            alert('Item updated successfully!');
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
    

    const fields = [
        { type: "text", name: 'name', spanName: '*Name' },
        { type: "text", name: 'definition', spanName: 'Definition' },
        { type: "text", name: 'remarks', spanName: 'Remarks' },
        { type: "text", name: 'itemStatus', spanName: '*Item Status', inputType: 'select', options: ['processing', 'valid', 'superseded', 'notValid', 'retired', 'clarified'] },
        { type: "text", name: 'alias', spanName: 'Alias', readOnly: true },
        { type: "text", name: 'camelCase', spanName: 'Camel Case' },
        { type: "text", name: 'definitionSource', spanName: 'Definition Source' },
        { type: "text", name: 'reference', spanName: 'Reference' },
        { type: "text", name: 'similarityToSource', spanName: 'Similarity to Source' },
        { type: "text", name: 'justification', spanName: 'Justification' },
        { type: "text", name: 'proposedChange', spanName: 'Proposed Change' },
    ];

    return (
        <div>
            <div className='text-end'>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
            </div>
            <div>
                <h3 className='mb-2'>Update Item</h3>
                {fields.map((field, index) => (
                    <UpdateInput
                        key={index}
                        type={field.type}
                        ItemChange={ItemChange}
                        itemValue={item[field.name]}
                        name={field.name}
                        spanName={field.spanName}
                        readOnly={field.readOnly || false}
                        inputType={field.inputType} // Pass inputType
                        options={field.options} // Pass options for select fields
                    />
                ))}
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>Update</button>
                </div>
            </div>
        </div>
    );
}

export default ItemUpdate;

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemContext } from '../../../../context/ItemContext';
import TableContents from './tags/TableContens';
import Cookies from 'js-cookie'; 
import { getDecryptedItem } from "../../../../cryptoComponent/storageUtils";

const tableFields = [
    { name: 'Name', key: 'name' },
    { name: 'Item Type', key: 'itemType' },
    { name: 'Definition', key: 'definition' },
    { name: 'Remarks', key: 'remarks' },
    { name: 'Item Status', key: 'itemStatus' },
    { name: 'Alias', key: 'alias', isAlias: true },
    { name: 'Camel Case', key: 'camelCase' },
    { name: 'Definition Source', key: 'definitionSource' },
    { name: 'Reference', key: 'reference' },
    { name: 'Similarity to Source', key: 'similarityToSource' },
    { name: 'Justification', key: 'justification' },
    { name: 'Proposed Change', key: 'proposedChange' },
];

function ItemDetail({ itemList, handleUpdateButtonClick, handleKeyIdx }) {
    const navigate = useNavigate();
    const { itemDetails, setItemDetails } = useContext(ItemContext);

    const gotoDDR = () => {
        setItemDetails({
            ...itemDetails,
            view_item_type: itemList.item.itemType,
            item_id: itemList.item._id.encrypted_data,
            item_iv: itemList.item._id.iv,
        });
        setTimeout(() => {
            navigate(`/${getDecryptedItem('REGISTRY_URI')}/iho-dataDictionary/detail`);
        }, 0);
    };

    const handleClick = () => handleUpdateButtonClick(1);
    const handleDelete = (idx) => {
        handleUpdateButtonClick(8);
        handleKeyIdx(idx);
    };

    const role = getDecryptedItem('role'); // 쿠키에서 role 정보를 가져옴
    if (!itemList || !itemList.item) {
        return <div>No item data available</div>;
    }
    return (
        <div className='mb-3 p-3' style={{ backgroundColor: '#F8F8F8' }}>
            <div className="mt-3 mb-3 card p-3">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th colSpan="2" className='text-center table-primary' scope="col" style={{ width: '25%' }}>
                                Concept Data Detail
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableFields.map(({ name, key, isAlias }) => (
                            <TableContents
                                key={key}
                                name={name}
                                itemValue={isAlias
                                    ? Object.values(itemList.item[key]).map((item, index) => (<span key={index}>{item}; </span>))
                                    : itemList.item[key]
                                }
                            />
                        ))}
                        {itemList.item.itemType === 'ConceptItem' ? null : (
                            <tr>
                                <th className='text-center' scope="row" style={{ width: '25%', alignContent: 'center' }}>Move to Detail Page</th>
                                <td>
                                    <button className='btn btn-outline-primary' onClick={gotoDDR}>Data Dictonary Detail</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {role === 'owner' && ( // role이 'owner'일 때만 버튼을 렌더링
                    <div className='text-end'>
                        <button className='btn btn-secondary btn-sm' onClick={handleClick}>Update</button>
                        <button className='btn btn-sm btn-danger m-1' onClick={() => handleDelete(itemList.item._id)}>Delete</button>
                    </div>
                )}
            </div>
            
        </div>
    );
}

export default ItemDetail;

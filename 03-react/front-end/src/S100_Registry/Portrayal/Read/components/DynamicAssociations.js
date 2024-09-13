import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ItemContext } from '../../../../context/ItemContext';

const DynamicAssociations = ({ associationItems }) => {
    const navigate = useNavigate();
    const { setItemDetails } = useContext(ItemContext);
    const moveToAssociatedItem = (value) => {
        setItemDetails({
            item_type: value.itemType,
            item_id: value.child_id,
            item_iv: value.child_iv,
        });
        navigate(`/${Cookies.get('REGISTRY_URI')}/portrayal/detail`);
    };
    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className="p-3 mb-3">
            <div className="mt-3 mb-3 card p-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                associated items
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {associationItems.map((item, index) => (
                            <tr key={index}>
                                <th className="text-center" style={{ width: '25%' }}>{item.associationName}</th>
                                <td onClick={() => {moveToAssociatedItem(item)}} >{item.xml_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DynamicAssociations;

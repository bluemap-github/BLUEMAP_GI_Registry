import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ItemContext } from '../../../../context/ItemContext';
import PRAssoUpdateModal from '../../Update/PRAssoUpdateModal';

const DynamicAssociations = ({ associationItems }) => {
    
    const role = Cookies.get('role');  // role 가져오기
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
    const [IsOpened, setIsOpened] = useState(false);
    const handleUpdateClick = () => {
        setIsOpened(true);
    };
    const handleDeleteClick = () => {
        console.log("Delete clicked");
    };
    const onClose = () => {
        setIsOpened(false);
    };
    return (
        <div style={{ backgroundColor: '#F8F8F8' }} className="p-3 mb-3">
            <PRAssoUpdateModal IsOpened={IsOpened} onClose={onClose}/>
            <div className="mt-3 mb-3 card p-3" >
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th colSpan="2" className="text-center table-primary" scope="col" style={{ width: '25%' }}>
                                associated items
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {associationItems && associationItems.length > 0 ? (
                        associationItems.map((item, index) => (
                            <tr key={index}>
                                <th className="text-center" style={{ width: '25%' }}>{item.associationName}</th>
                                <td onClick={() => { moveToAssociatedItem(item) }}>{item.xml_id}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center">No Association Here</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                {role === 'owner' && (
                    <div className="text-end">
                        <button className="btn btn-secondary btn-sm" onClick={handleUpdateClick}>Update</button>
                        <button className="btn btn-sm btn-danger m-1" onClick={handleDeleteClick}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DynamicAssociations;

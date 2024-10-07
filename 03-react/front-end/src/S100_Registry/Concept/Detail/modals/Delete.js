import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RERI_HOME } from "../../../../Common/PageLinks";
import Cookies from 'js-cookie'; 
import {DEPLOY_URL} from "../../../index";

function Delete({onClose, DEL_API, itemSerial}){
    console.log('DEL_API:', itemSerial);
    const navigate = useNavigate();
    const handleDelete = async () => {
        try {
            const response = await axios.delete(DEL_API, {
                data: {
                    "item_id": itemSerial.encrypted_data,
                    "item_iv": itemSerial.iv
                }
            });
            console.log('Item data successfully deleted:', response.data);
            onClose()
            if (DEL_API === `${DEPLOY_URL}/api/v1/concept_item/delete/`) {
                navigate(`/${Cookies.get('REGISTRY_URI')}/concept/list`);
            } else {
                window.location.reload();
            }
            
            
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }
    return (
        <div style={{height: "200px"}} className="p-2">
            <div className='text-end' style={{height: "10%"}}>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
            </div>
            <h3>Delete</h3>
            <div style={{height: "50%", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>Are you sure you want to delete?</div>
            </div>
            <div className='text-end' style={{height: "10%"}}>
                <button className="btn btn-sm btn-danger" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}
export default Delete;
import React from "react";
import axios from "axios";


function Delete({onClose, selectedForm, keyIdx}){
    console.log(selectedForm)

    const handleDelete = async () => {
        try {
            const response = await axios.delete(selectedForm);
            console.log('Item data successfully deleted:', response.data);
            onClose()
            if (keyIdx == 8) {
                window.location.href = "/";
            }
            else {
                window.location.reload();
            }
            
            
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    
    return (
        <div>
            <div>
                <div>Delete</div>
                <div>selectedForm : {selectedForm}</div>
                <div>keyIdx : {keyIdx}</div>
                <button className='btn btn-danger' onClick={handleDelete}>Delete</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default Delete;
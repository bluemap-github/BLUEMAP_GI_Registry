import React, { useState } from 'react';
import AlertPriorityTags from './AlertPriorityTags';


const AlertInfoInput = () => {
    const [alertInfo, setAlertInfo] = useState([]);

    const handleSubmitAlertInfo = () => {
        console.log('Submit Alert Info', alertInfo  );
    };

    const onFormSubmit = (data) => {
        setAlertInfo(data);
    }

    return (
    <div className="item-input-form-bg p-3 pb-1 mt-4">
        Alert Info
        <AlertPriorityTags onFormSubmit={onFormSubmit}/>
        <div className='text-end'>
            <button className='mt-3 btn btn-sm btn-primary' onClick={handleSubmitAlertInfo}>Submit</button>
        </div>
    </div>
    );
};

export default AlertInfoInput;
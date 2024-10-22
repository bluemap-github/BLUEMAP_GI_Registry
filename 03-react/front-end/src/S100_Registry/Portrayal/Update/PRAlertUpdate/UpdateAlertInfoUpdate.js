import React, { useState } from 'react'; 
import {PUT_ALERT, PUT_ALERT_INFO, PUT_HIGHLIGHT_ASSOCIATION, PUT_MESSAGE_ASSOCIATION} from '../../api/api';
import axios from 'axios';

const UpdateAlertInfoUpdate = ({ data, page }) => {
    return (
        <pre>{JSON.stringify(data[page], null, 2)}</pre>
    );
};

export default UpdateAlertInfoUpdate;
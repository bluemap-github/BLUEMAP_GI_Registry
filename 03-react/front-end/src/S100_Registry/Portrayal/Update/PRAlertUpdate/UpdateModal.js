import React, { useState } from 'react'; 
import {PUT_ALERT, PUT_ALERT_INFO, PUT_HIGHLIGHT_ASSOCIATION, PUT_MESSAGE_ASSOCIATION} from '../../api/api';
import axios from 'axios';
import UpdateAlertInfoUpdate from './UpdateAlertInfoUpdate';
import UpdateAlertAssociation from './UpdateAlertAssociation';
import UpdatePRAlertItem from './UpdatePRAlertItem'; 


const PRItemUpdateModal = ({ IsOpened, onClose, data, UpdateType, page}) => {
    const routeMonitor = data.routeMonitor;
    const routePlan = data.routePlan;

    const itemSpecificFields = {
        'AlertItem': <UpdatePRAlertItem data={data} />,
        'RouteMonitor': <UpdateAlertInfoUpdate data={routeMonitor} page={page}/>,
        'RoutePlan': <UpdateAlertInfoUpdate data={routePlan} page={page}/>,
        'AlertAssociation': <UpdateAlertAssociation data={data} />,
    }
    if (!IsOpened) {
        return null;
    }

    return (
        <div className="modal-style">
            <div className="modal-content-style" style={{ width: '1000px' }}>
                <div className='text-end'>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                {/* 전처리된 데이터를 표시 */}
                {itemSpecificFields[UpdateType]}
            </div>
        </div>
    );
};

export default PRItemUpdateModal;

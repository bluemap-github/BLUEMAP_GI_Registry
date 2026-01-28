import React, { useState } from 'react'; 
import {PUT_ALERT, PUT_ALERT_INFO, PUT_HIGHLIGHT_ASSOCIATION, PUT_MESSAGE_ASSOCIATION} from '../../api/api';
import axios from 'axios';
import UpdateAlertInfoUpdate from './UpdateAlertInfoUpdate';
import UpdateAlertAssociation from './UpdateAlertAssociation';
import UpdatePRAlertItem from './UpdatePRAlertItem'; 


const PRItemUpdateModal = ({ IsOpened, onClose, data, UpdateType, page, priorityID}) => {
    const routeMonitor = data.routeMonitor;
    const routePlan = data.routePlan;

    const itemSpecificFields = {
        'AlertItem': <UpdatePRAlertItem data={data} onClose={onClose}/>,
        'RouteMonitor': <UpdateAlertInfoUpdate data={routeMonitor} page={page} onClose={onClose}/>,
        'RoutePlan': <UpdateAlertInfoUpdate data={routePlan} page={page} onClose={onClose}/>,
        'AlertAssociation': <UpdateAlertAssociation style={{width: "700px"}} data={data} priorityID={priorityID} onClose={onClose}/>,
    }
    if (!IsOpened) {
        return null;
    }

    return (
        <div className="modal-style">
            <div className="modal-content-style" style={(UpdateType === 'AlertAssociation' ? {width: '700px', maxHeight: '700px', overflowY: 'auto'} : {
                width: '700px',
                maxHeight: '800px',
                overflowY: 'auto'
            })}>
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

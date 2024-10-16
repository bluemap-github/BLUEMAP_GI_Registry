import React, { useState } from 'react';
import EnumUpdate from './component/EnumUpdate';
import SimpUpdate from './component/SimpUpdate';
import CompUpdate from './component/CompUpdate';
import FeatUpdate from './component/FeatUpdate';
import InfoUpdate from './component/InfoUpdate';

const PRItemUpdateModal = ({IsOpened, onClose, data}) => {

    const itemSpecificFields = {
        'EnumeratedValue': <EnumUpdate TagItemType='EnumeratedValue' data={data} onClose={onClose}/>, 
        'SimpleAttribute': <SimpUpdate TagItemType='SimpleAttribute' data={data} onClose={onClose}/>,
        'ComplexAttribute': <CompUpdate TagItemType='ComplexAttribute' data={data} onClose={onClose}/>,
        'FeatureType': <FeatUpdate TagItemType='FeatureType' data={data} onClose={onClose}/>,
        'InformationType': <InfoUpdate TagItemType='InformationType' data={data} onClose={onClose}/>
    };


    if (!IsOpened) {
        return null;
    }
    return (
        <div className="modal-style">
            <div className="modal-content-style" style={{width: '1000px'}}>
                <div className='text-end'>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                {itemSpecificFields[data.itemType]}
            </div>
        </div>
    );
};

export default PRItemUpdateModal;
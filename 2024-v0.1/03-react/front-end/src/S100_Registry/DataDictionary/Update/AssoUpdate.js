import React, { useState, useEffect } from 'react';
import EnumAssoUpdate from './component/EnumAssoUpdate';
import SubDistinctUpdate from './component/SubDistinctUpdate';


const AssoUpdate = ({IsOpened, onClose, data}) => {

    const assoSpecificFields = {
        'EnumeratedValue': <EnumAssoUpdate TagItemType='EnumeratedValue' formData={data} onClose={onClose}/>, 
        'ComplexAttribute': <SubDistinctUpdate TagItemType='ComplexAttribute' formData={data} onClose={onClose}/>,
        'FeatureType': <SubDistinctUpdate TagItemType='FeatureType' formData={data} onClose={onClose}/>,
        'InformationType': <SubDistinctUpdate TagItemType='InformationType' formData={data} onClose={onClose}/>
    };
    if (!IsOpened) {
        return null;
    }
    return (
        <div className="modal-style">
            <div className="modal-content-style" style={{width: '700px'}}>
                <div className='text-end'>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                {assoSpecificFields[data.itemType]}
            </div>
        </div>
    );
};

export default AssoUpdate;
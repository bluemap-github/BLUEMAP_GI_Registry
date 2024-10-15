import React, { useState } from 'react';
import ColourToken from './PRItem/ColourToken';
import PaletteItem from './PRItem/PaletteItem';
import ColourPalette from './PRItem/ColourPalette';
import DisplayMode from './PRItem/DisplayMode';
import DisplayPlane from './PRItem/DisplayPlane';
import DrawingPriority from './PRItem/DrawingPriority';
import Alert from './PRItem/Alert';
import AlertHighlight from './PRItem/AlertHighlight';
import AlertMessage from './PRItem/AlertMessage';
import ContextParameter from './PRItem/ContextParameter';
import Font from './PRItem/Font';
import ViewingGroup from './PRItem/ViewingGroup';
import ViewingGroupLayer from './PRItem/ViewingGroupLayer';
import Schema from './PRItem/Schema';
import VisualItem from './PRItem/VisualItem';

const PRItemUpdateModal = ({IsOpened, onClose, data}) => {

    const itemSpecificFields = {
        'Symbol': <VisualItem TagItemType='Symbol' data={data} onClose={onClose}/>, 
        'LineStyle': <VisualItem TagItemType='LineStyle' data={data} onClose={onClose}/>, 
        'AreaFill': <VisualItem TagItemType='AreaFill' data={data} onClose={onClose}/>, 
        'Pixmap': <VisualItem TagItemType='Pixmap' data={data} onClose={onClose}/>, 
        'SymbolSchema': <Schema TagItemType='SymbolSchema' data={data} onClose={onClose}/>, 
        'LineStyleSchema': <Schema TagItemType='LineStyleSchema' data={data} onClose={onClose}/>,  
        'AreaFillSchema': <Schema TagItemType='AreaFillSchema' data={data} onClose={onClose}/>, 
        'PixmapSchema': <Schema TagItemType='PixmapSchema' data={data} onClose={onClose}/>, 
        'ColourProfileSchema': <Schema TagItemType='ColourProfileSchema' data={data} onClose={onClose}/>, 
        'ColourToken': <ColourToken data={data} onClose={onClose}/>, 
        'PaletteItem': <PaletteItem data={data} onClose={onClose}/>, 
        'ColourPalette': <ColourPalette data={data} onClose={onClose}/>, 
        'DisplayMode': <DisplayMode data={data} onClose={onClose}/>, 
        'DisplayPlane': <DisplayPlane data={data} onClose={onClose}/>, 
        'ViewingGroupLayer': <ViewingGroupLayer data={data} onClose={onClose}/>, 
        'ViewingGroup': <ViewingGroup data={data} onClose={onClose}/>, 
        'Font': <Font data={data} onClose={onClose}/>, 
        'ContextParameter': <ContextParameter data={data} onClose={onClose}/>, 
        'DrawingPriority': <DrawingPriority data={data} onClose={onClose}/>, 
        'Alert': <Alert data={data} onClose={onClose}/>, 
        'AlertHighlight': <AlertHighlight data={data} onClose={onClose}/>, 
        'AlertMessage': <AlertMessage data={data} onClose={onClose}/>, 
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
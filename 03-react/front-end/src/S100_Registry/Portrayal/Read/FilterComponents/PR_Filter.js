import React, { useEffect, useState, useContext } from 'react';

const buttonTypes = [
    { type: 'Symbol', label: 'Symbol' },
    { type: 'LineStyle', label: 'Line Style' },
    { type: 'AreaFill', label: 'Area Fill' },
    { type: 'Pixmap', label: 'Pixmap' },
    { type: 'SymbolSchema', label: 'Symbol Schema' },
    { type: 'LineStyleSchema', label: 'Line Style Schema' },
    { type: 'AreaFillSchema', label: 'Area Fill Schema' },
    { type: 'PixmapSchema', label: 'Pixmap Schema' },
    { type: 'ColourProfileSchema', label: 'Colour Profile Schema' },
    { type: 'ColourToken', label: 'Colour Token' },
    { type: 'PaletteItem', label: 'Palette Item' },
    { type: 'ColourPalette', label: 'Colour Palette' },
    { type: 'DisplayMode', label: 'Display Mode' },
    { type: 'DisplayPlane', label: 'Display Plane' },
    { type: 'ViewingGroupLayer', label: 'Viewing Group Layer' },
    { type: 'ViewingGroup', label: 'Viewing Group' },
    { type: 'Font', label: 'Font' },
    { type: 'ContextParameter', label: 'Context Parameter' },
    { type: 'DrawingPriority', label: 'Drawing Priority' },
    { type: 'Alert', label: 'Alert' },
    { type: 'AlertHighlight', label: 'Alert Highlight' },
    { type: 'AlertMessage', label: 'Alert Message' },


];

function PR_Filter({ clickHandler, viewType }) {
        return (
            <div>
                {buttonTypes.map((btn) => (
                    <button
                        key={btn.type}
                        className={`btn btn-outline-primary ${viewType === btn.type ? 'active' : ''}`}
                        onClick={() => clickHandler(btn.type)} 
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        );
}

export default PR_Filter;

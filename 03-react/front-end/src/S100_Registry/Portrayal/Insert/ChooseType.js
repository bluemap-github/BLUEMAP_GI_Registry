import React from 'react';

const ChooseType = ({ initial,  getSelestedApi }) => {
    
    const handleChange = (event) => {
        getSelestedApi(event.target.value);
    };

    return (
        <div className='input-group' style={{width: "40%"}}>
            <select className='form-select' id="typeSelect" onChange={handleChange} value={initial}  >
                <option value="Symbol">Symbol</option>
                <option value="LineStyle">Line Style</option>
                <option value="AreaFill">Area Fill</option>
                <option value="Pixmap">Pixmap</option>
                <option value="SymbolSchema">Symbol Schema</option>
                <option value="LineStyleSchema">LineStyle Schema</option>
                <option value="AreaFillSchema">AreaFill Schema</option>
                <option value="PixmapSchema">Pixmap Schema</option>
                <option value="ColourProfileSchema">Colour Profile Schema</option>
                <option value="ColourToken">Colour Token</option>
                <option value="PaletteItem">Palette Item</option>
                <option value="ColourPalette">Colour Palette</option>
                <option value="DisplayPlane">Display Plane</option>
                <option value="DisplayMode">Display Mode</option>
                <option value="ViewingGroupLayer">Viewing Group Layer</option>
                <option value="ViewingGroup">Viewing Group</option>
                <option value="Font">Font</option>
                <option value="ContextParameter">Context Parameter</option>
                <option value="DrawingPriority">Drawing Priority</option>
                <option value="Alert">Alert</option>
                <option value="AlertHighlight">Alert Highlight</option>
                <option value="AlertMessage">Alert Message</option>
            </select>
        </div>
    );
};

export default ChooseType;

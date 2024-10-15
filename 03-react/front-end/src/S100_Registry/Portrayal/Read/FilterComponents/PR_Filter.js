import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const handleCreateClick = () => {
        if (viewType) {
            Cookies.set('createViewType', viewType);
            navigate(`/${Cookies.get('REGISTRY_URI')}/create-portrayal`);
        }
    };
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{width: '40%'}}>
                <select
                    className="form-select"
                    value={viewType}
                    onChange={(e) => clickHandler(e.target.value)}
                >
                    <option value="">Select an option</option> {/* 기본 선택 옵션 */}
                    {buttonTypes.map((btn) => (
                        <option key={btn.type} value={btn.type}>
                            {btn.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button type="button" className="btn btn-outline-primary" onClick={handleCreateClick}>
                    + Create {viewType}
                </button>
            </div>
        </div>
    );
}

export default PR_Filter;

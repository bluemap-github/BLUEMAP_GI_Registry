const commonFields = {
    'xmlID' : '',
    'description' : [{ text: '', language: '' }],
};

const visualItemFields = {
    'itemDetail' : '',
    'previewImage' : '',
    'engineeringImage' : '',
    'previewType' : '',
    'engineeringImageType' : '',
};

const schemaFields = {
    'xmlSchema' : '',
};
const alertInfoTemplate = {
    priority: [
        {
            priority: '',
            default: false,
            optional: false,
        }
    ]
};


const symbol = { ...commonFields, ...visualItemFields, };
const lineStyle = { ...commonFields, ...visualItemFields, };
const areaFill = { ...commonFields, ...visualItemFields, };
const pixmap = { ...commonFields, ...visualItemFields, };

const symbolSchema = { ...commonFields, ...schemaFields };
const lineStyleSchema = { ...commonFields, ...schemaFields };
const areaFillSchema = { ...commonFields, ...schemaFields };
const pixmapSchema = { ...commonFields, ...schemaFields };
const colourProfileSchema = { ...commonFields, ...schemaFields };

const colourToken = { ...commonFields, 'token' : ''};
const paletteItem = { ...commonFields, 'transparency' : '', 'colourValue' : ''};
const colourPalette = { ...commonFields};
const displayPlane = { ...commonFields, 'order' : ''};
const displaymode = { ...commonFields};
const viewingGroupLayer = { ...commonFields};
const viewingGroup = { ...commonFields, 'foundationMode' : ''};
const font = { ...commonFields, 'fontFile' : '', fontType: 'ttf'};
const ContextParameter = { ...commonFields, 'parameterType' : '', 'defaultValue' : ''};
const drawingPriority = { ...commonFields, 'priority' : ''};
const alert = { ...commonFields, 'routeMonitor': [{}], 'routePlan': [{}]};
const alertHighlight = { ...commonFields, 'optional': '', 'style' : ''};
const alertMessage = { ...commonFields, 'text': []};

export const basicJSONs = {
    "Symbol": symbol,
    "LineStyle": lineStyle,
    "AreaFill": areaFill,
    "Pixmap": pixmap,
    "SymbolSchema": symbolSchema,
    "LineStyleSchema": lineStyleSchema,
    "AreaFillSchema": areaFillSchema,
    "PixmapSchema": pixmapSchema,
    "ColourProfileSchema": colourProfileSchema,
    "ColourToken": colourToken,
    "PaletteItem": paletteItem,
    "ColourPalette": colourPalette,
    "DisplayPlane": displayPlane,
    "DisplayMode": displaymode,
    "ViewingGroupLayer": viewingGroupLayer,
    "ViewingGroup": viewingGroup,
    "Font": font,
    "ContextParameter": ContextParameter,
    "DrawingPriority": drawingPriority,
    "Alert": alert,
    "AlertHighlight": alertHighlight,
    "AlertMessage": alertMessage,
};

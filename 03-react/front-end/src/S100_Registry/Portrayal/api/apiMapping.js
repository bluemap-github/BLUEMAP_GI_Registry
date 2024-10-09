import {
  POST_SYMBOL,
  POST_LINE_STYLE,
  POST_AREA_FILL,
  POST_PIXMAP,
  POST_SYMBOL_SCHEMA,
  POST_LINE_STYLE_SCHEMA,
  POST_AREA_FILL_SCHEMA,
  POST_PIXMAP_SCHEMA,
  POST_COLOUR_PROFILE_SCHEMA,
  POST_COLOUR_TOKEN,
  POST_PALETTE_ITEM,
  POST_COLOUR_PALETTE,
  POST_DISPLAY_PLANE,
  POST_DISPLAY_MODE,
  POST_VIEWING_GROUP_LAYER,
  POST_VIEWING_GROUP,
  POST_FONT,
  POST_CONTEXT_PARAMETER,
  POST_DRAWING_PRIORITY,
  POST_ALERT,
  POST_ALERT_HIGHLIGHT,
  POST_ALERT_MESSAGE
} from './api';


export const apiMapping = {
  Symbol: { url: POST_SYMBOL, type: 'Symbol', postType: 'formData'},
  LineStyle: { url: POST_LINE_STYLE, type: 'LineStyle', postType: 'formData' },
  AreaFill: { url: POST_AREA_FILL, type: 'AreaFill', postType: 'formData' },
  Pixmap: { url: POST_PIXMAP, type: 'Pixmap', postType: 'formData' },
  SymbolSchema: { url: POST_SYMBOL_SCHEMA, type: 'SymbolSchema', postType: 'formData' },
  LineStyleSchema: { url: POST_LINE_STYLE_SCHEMA, type: 'LineStyleSchema', postType: 'formData' },
  AreaFillSchema: { url: POST_AREA_FILL_SCHEMA, type: 'AreaFillSchema', postType: 'formData' },
  PixmapSchema: { url: POST_PIXMAP_SCHEMA, type: 'PixmapSchema', postType: 'formData' },
  ColourProfileSchema: { url: POST_COLOUR_PROFILE_SCHEMA, type: 'ColourProfileSchema', postType: 'formData' },
  ColourToken: { url: POST_COLOUR_TOKEN, type: 'ColourToken', postType: 'json' },
  PaletteItem: { url: POST_PALETTE_ITEM, type: 'PaletteItem', postType: 'json' },
  ColourPalette: { url: POST_COLOUR_PALETTE, type: 'ColourPalette', postType: 'json' },
  DisplayPlane: { url: POST_DISPLAY_PLANE, type: 'DisplayPlane', postType: 'json' },
  DisplayMode: { url: POST_DISPLAY_MODE, type: 'DisplayMode', postType: 'json' },
  ViewingGroupLayer: { url: POST_VIEWING_GROUP_LAYER, type: 'ViewingGroupLayer', postType: 'json' },
  ViewingGroup: { url: POST_VIEWING_GROUP, type: 'ViewingGroup', postType: 'json' },
  Font: { url: POST_FONT, type: 'Font', postType: 'formData' },
  ContextParameter: { url: POST_CONTEXT_PARAMETER, type: 'ContextParameter', postType: 'json' },
  DrawingPriority: { url: POST_DRAWING_PRIORITY, type: 'DrawingPriority', postType: 'json' },
  Alert: { url: POST_ALERT, type: 'Alert', postType: 'json' },
  AlertHighlight: { url: POST_ALERT_HIGHLIGHT, type: 'AlertHighlight', postType: 'json' },
  AlertMessage: { url: POST_ALERT_MESSAGE, type: 'AlertMessage', postType: 'json' },
};

export const getSelestedApi = (type, setSelectedApiUrl, setApiType, setPostType) => {
  const apiInfo = apiMapping[type];

  if (apiInfo) {
      setSelectedApiUrl(apiInfo.url);
      setApiType(apiInfo.type);
      setPostType(apiInfo.postType);

  }
};

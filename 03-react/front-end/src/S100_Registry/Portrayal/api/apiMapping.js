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
  POST_COLOUR_PALETTE
} from './api';


export const apiMapping = {
  Symbol: { url: POST_SYMBOL, type: 'Symbol' },
  LineStyle: { url: POST_LINE_STYLE, type: 'LineStyle' },
  AreaFill: { url: POST_AREA_FILL, type: 'AreaFill' },
  Pixmap: { url: POST_PIXMAP, type: 'Pixmap' },
  SymbolSchema: { url: POST_SYMBOL_SCHEMA, type: 'SymbolSchema' },
  LineStyleSchema: { url: POST_LINE_STYLE_SCHEMA, type: 'LineStyleSchema' },
  AreaFillSchema: { url: POST_AREA_FILL_SCHEMA, type: 'AreaFillSchema' },
  PixmapSchema: { url: POST_PIXMAP_SCHEMA, type: 'PixmapSchema' },
  ColourProfileSchema: { url: POST_COLOUR_PROFILE_SCHEMA, type: 'ColourProfileSchema' },
  ColourToken: { url: POST_COLOUR_TOKEN, type: 'ColourToken' },
  PaletteItem: { url: POST_PALETTE_ITEM, type: 'PaletteItem' },
  ColourPalette: { url: POST_COLOUR_PALETTE, type: 'ColourPalette' },
  // DisplayPlane: { url: POST_DISPLAY_PLANE, type: 'DisplayPlane' },
  // DisplayMode: { url: POST_DISPLAY_MODE, type: 'DisplayMode' },
  // ViewingGroupLayer: { url: POST_VIEWING_GROUP_LAYER, type: 'ViewingGroupLayer' },
  // ViewingGroup: { url: POST_VIEWING_GROUP, type: 'ViewingGroup' },
  // Font: { url: POST_FONT, type: 'Font' },
  // ContextParameter: { url: POST_CONTEXT_PARAMETER, type: 'ContextParameter' },
  // DrawingPriority: { url: POST_DRAWING_PRIORITY, type: 'DrawingPriority' },
  // Alert: { url: POST_ALERT, type: 'Alert' },
  // AlertHighlight: { url: POST_ALERT_HIGHLIGHT, type: 'AlertHighlight' },
  // AlertMessage: { url: POST_ALERT_MESSAGE, type: 'AlertMessage' },
};

export const getSelestedApi = (type, setSelectedApiUrl, setApiType) => {
  const apiInfo = apiMapping[type];

  if (apiInfo) {
      setSelectedApiUrl(apiInfo.url);
      setApiType(apiInfo.type);
  }
};

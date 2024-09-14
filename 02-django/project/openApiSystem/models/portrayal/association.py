from bson.objectid import ObjectId
from openApiSystem.models.dbs import (
    S100_PR_ColourToken_Association,
    S100_PR_Symbol_Association,
    S100_PR_Icon_Association,
    S100_PR_ItemSchema_Association,
    S100_PR_Value_Association,
    S100_PR_Palette_Association,
    S100_PR_DisplayMode_Association,
    S100_PR_ViewingGroup_Association,
    S100_PR_Highlight_Association,
    S100_PR_Message_Association,
)

class Association:
    pass

class SymbolAssociation(Association):
    collection = S100_PR_Symbol_Association

class IconAssociation(Association):
    collection = S100_PR_Icon_Association

class ItemSchemaAssociation(Association):
    collection = S100_PR_ItemSchema_Association

class ColourTokenAssociation(Association):
    collection = S100_PR_ColourToken_Association

class ValueAssociation(Association):
    collection = S100_PR_Value_Association

class PaletteAssociation(Association):
    collection = S100_PR_Palette_Association

class DisplayModeAssociation(Association):
    collection = S100_PR_DisplayMode_Association

class ViewingGroupAssociation(Association):
    collection = S100_PR_ViewingGroup_Association

class HighlightAssociation(Association):
    collection = S100_PR_Highlight_Association

class MessageAssociation(Association):
    collection = S100_PR_Message_Association


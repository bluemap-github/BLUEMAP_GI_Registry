from mongo_driver import db
from bson.objectid import ObjectId

S100_PR_Symbol_Association = db["S100_PR_Symbol_Association"]
S100_PR_Icon_Association = db["S100_PR_Icon_Association"]
S100_PR_ItemSchema_Association = db["S100_PR_ItemSchema_Association"]
S100_PR_ColourToken_Association = db["S100_PR_ColourToken_Association"]
S100_PR_Value_Association = db["S100_PR_Value_Association"]
S100_PR_Palette_Association = db["S100_PR_Palette_Association"]
S100_PR_DisplayMode_Association = db["S100_PR_DisplayMode_Association"]
S100_PR_ViewingGroup_Association = db["S100_PR_ViewingGroup_Association"]
S100_PR_Highlight_Association = db["S100_PR_Highlight_Association"]
S100_PR_Message_Association = db["S100_PR_Message_Association"]


class PR_Association:
    collection = None

    @classmethod
    def insert(cls, I_id, A_id):
        if I_id is None or A_id is None:
            return {"status": "failed", "message": "I_id or A_id is None"}
        result = cls.collection.insert_one({"parent_id": I_id, "child_id": A_id})
        return {"status": "success", "inserted_id": str(result.inserted_id)}
    
    # @classmethod
    # def find(cls, I_id):
    #     return cls.collection.find({"parent_id": I_id})

class SymbolAssociation(PR_Association):
    collection = S100_PR_Symbol_Association

class IconAssociation(PR_Association):
    collection = S100_PR_Icon_Association

class ItemSchemaAssociation(PR_Association):
    collection = S100_PR_ItemSchema_Association

class ColourTokenAssociation(PR_Association):
    collection = S100_PR_ColourToken_Association

class ValueAssociation(PR_Association):
    collection = S100_PR_Value_Association

class PaletteAssociation(PR_Association):
    collection = S100_PR_Palette_Association

class DisplayModeAssociation(PR_Association):
    collection = S100_PR_DisplayMode_Association

class ViewingGroupAssociation(PR_Association):
    collection = S100_PR_ViewingGroup_Association

class HighlightAssociation(PR_Association):
    collection = S100_PR_Highlight_Association

class MessageAssociation(PR_Association):
    collection = S100_PR_Message_Association



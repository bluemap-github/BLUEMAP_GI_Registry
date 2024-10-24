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
    def delete(cls, Item_id, attribute):
        if Item_id is None or attribute is None:
            return {"status": "failed", "message": "Item_id or attribute is None"}
        result = cls.collection.delete_many({attribute: ObjectId(Item_id)})

        return {"status": "success", "deleted_count": result.deleted_count}

    @classmethod
    def insert(cls, I_id, A_id):
        if I_id is None or A_id is None:
            return {"status": "failed", "message": "I_id or A_id is None"}
        result = cls.collection.insert_one({"parent_id": ObjectId(I_id), "child_id": ObjectId(A_id)})
        return {"status": "success", "inserted_id": str(result.inserted_id)}
    
    @classmethod
    def get_list(cls, I_id):
        if I_id is None:
            return {"status": "failed", "message": "I_id is None"}
        result = []
        for item in list(cls.collection.find({"parent_id": ObjectId(I_id)})):
            child_id = item["child_id"]
            for coll in cls.target_collection:
                res_docs = coll.collection.find_one({"_id": ObjectId(child_id)})
                if res_docs:
                    result.append({"child_id": child_id, "item_type": res_docs["itemType"], "xmlID" : res_docs["xmlID"]})
        return result

    @classmethod
    def get_association(cls, parent_id):
        result = []
        for item in list(cls.collection.find({"parent_id": ObjectId(parent_id)})):
            child_id = item["child_id"]
            for coll in cls.target_collection:
                res_docs = coll.collection.find_one({"_id": ObjectId(child_id)})
                if res_docs:
                    result.append({
                        "child_id": str(child_id),  # ObjectId를 문자열로 변환
                        "name": res_docs["name"],
                        "item_type": res_docs["itemType"],
                        "xmlID": res_docs["xmlID"]
                    })
        return result

    
    @classmethod
    def update(cls, association_id, new_child_id):
        if association_id is None or new_child_id is None:
            print(association_id, new_child_id)
            return {"status": "error", "message": "association_id or new_child_id is None"}
        cls.collection.update_one({"_id": ObjectId(association_id)}, {"$set": {"child_id": ObjectId(new_child_id)}})
        return {"status": "success", "updated_id": str(association_id)}

    
from regiSystem.models.PR_Class import (
    SymbolModel,
    SymbolSchemaModel, LineStyleSchemaModel, AreaFillSchemaModel, PixmapSchemaModel, ColourProfileSchemaModel,
    ColourTokenModel,
    ColourPaletteModel,
    PaletteItemModel,
    DisplayModeModel,
    ViewingGroupModel, ViewingGroupLayerModel,
    AlertHighlightModel,
    AlertMessageModel
)
    
class SymbolAssociation(PR_Association):
    collection = S100_PR_Symbol_Association
    target_collection = [SymbolModel]

class IconAssociation(PR_Association):
    collection = S100_PR_Icon_Association
    target_collection = [SymbolModel]

class ItemSchemaAssociation(PR_Association):
    collection = S100_PR_ItemSchema_Association
    target_collection = [SymbolSchemaModel, LineStyleSchemaModel, AreaFillSchemaModel, PixmapSchemaModel, ColourProfileSchemaModel]

class ColourTokenAssociation(PR_Association):
    collection = S100_PR_ColourToken_Association
    target_collection = [ColourTokenModel]

class ValueAssociation(PR_Association):
    collection = S100_PR_Value_Association
    target_collection = [PaletteItemModel]

class PaletteAssociation(PR_Association):
    collection = S100_PR_Palette_Association
    target_collection = [ColourPaletteModel]

class DisplayModeAssociation(PR_Association):
    collection = S100_PR_DisplayMode_Association
    target_collection = [DisplayModeModel]

class ViewingGroupAssociation(PR_Association):
    collection = S100_PR_ViewingGroup_Association
    target_collection = [ViewingGroupModel, ViewingGroupLayerModel]

class HighlightAssociation(PR_Association):
    collection = S100_PR_Highlight_Association
    target_collection = [AlertHighlightModel]

class MessageAssociation(PR_Association):
    collection = S100_PR_Message_Association
    target_collection = [AlertMessageModel]



from bson.objectid import ObjectId
from openApiSystem.models.registry.item import (
    RE_Item,
    RE_ManagementInfo,
    RE_Reference,
    RE_ReferenceSource,
)
class Concept(RE_Item):
    @classmethod
    def get_item_list(cls, C_id):
        res = cls.collection.find({'concept_id': ObjectId(C_id)})
        if res is None:
            return None
        return res  
    
    @classmethod
    def get_item_detail(cls, I_id):
        res = cls.collection.find_one({'_id': ObjectId(I_id)})
        if res is None:
            return None
        return res    
    
    @classmethod
    def insert(cls, C_id, data):
        data['concept_id'] = ObjectId(C_id)
        result = cls.collection.insert_one(data)
        return {"status": "success", "inserted_id": str(result.inserted_id)}

    @classmethod
    def update(cls, I_id, data):
        object_id = ObjectId(I_id)
        result = cls.collection.update_one(
            {'_id': object_id},  
            {'$set': data}       
        )
        if result.matched_count == 0:
            return {"status": "error", "message": "Item not found or no changes made"}
        return {"status": "success", "updated_id": I_id, "modified_count": result.modified_count}


class ManagementInfo(RE_ManagementInfo):
    @classmethod
    def get_management_info_list_related_item(cls, I_id):
        res = cls.collection.find({'concept_item_id': ObjectId(I_id)})
        if res is None:
            return None
        return res
    
    @classmethod
    def insert(cls, I_id, data):
        data['concept_item_id'] = ObjectId(I_id) 
        result = cls.collection.insert_one(data)
        return {"status": "success", "inserted_id": str(result.inserted_id)}

    @classmethod
    def update(cls, I_id, data):
        object_id = ObjectId(I_id)
        result = cls.collection.update_one(
            {'_id': object_id},  
            {'$set': data}       
        )
        if result.matched_count == 0:
            return {"status": "error", "message": "Item not found or no changes made"}
        return {"status": "success", "updated_id": I_id, "modified_count": result.modified_count}


class Reference(RE_Reference):
    @classmethod
    def get_reference_list_related_item(cls, I_id):
        res = cls.collection.find({'concept_item_id': ObjectId(I_id)})
        if res is None:
            return None
        return res
    
    @classmethod
    def insert(cls, I_id, data):
        data['concept_item_id'] = ObjectId(I_id) 
        result = cls.collection.insert_one(data)
        return {"status": "success", "inserted_id": str(result.inserted_id)}

    @classmethod
    def update(cls, I_id, data):
        object_id = ObjectId(I_id)
        result = cls.collection.update_one(
            {'_id': object_id},  
            {'$set': data}       
        )
        if result.matched_count == 0:
            return {"status": "error", "message": "Item not found or no changes made"}
        return {"status": "success", "updated_id": I_id, "modified_count": result.modified_count}


class ReferenceSource(RE_ReferenceSource):
    @classmethod
    def get_reference_source_list_related_item(cls, I_id):
        res = cls.collection.find({'concept_item_id': ObjectId(I_id)})
        if res is None:
            return None
        return res
    
    @classmethod
    def insert(cls, I_id, data):
        data['concept_item_id'] = ObjectId(I_id) 
        result = cls.collection.insert_one(data)
        return {"status": "success", "inserted_id": str(result.inserted_id)}

    @classmethod
    def update(cls, I_id, data):
        object_id = ObjectId(I_id)
        result = cls.collection.update_one(
            {'_id': object_id},  
            {'$set': data}       
        )
        if result.matched_count == 0:
            return {"status": "error", "message": "Item not found or no changes made"}
        return {"status": "success", "updated_id": I_id, "modified_count": result.modified_count}

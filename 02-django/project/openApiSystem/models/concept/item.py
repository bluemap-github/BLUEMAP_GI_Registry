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


class ManagementInfo(RE_ManagementInfo):
    @classmethod
    def get_management_info_list_related_item(cls, I_id):
        res = cls.collection.find({'concept_item_id': ObjectId(I_id)})
        if res is None:
            return None
        return res



class Reference(RE_Reference):
    @classmethod
    def get_reference_list_related_item(cls, I_id):
        res = cls.collection.find({'concept_item_id': ObjectId(I_id)})
        if res is None:
            return None
        return res
    

class ReferenceSource(RE_ReferenceSource):
    @classmethod
    def get_reference_source_list_related_item(cls, I_id):
        res = cls.collection.find({'concept_item_id': ObjectId(I_id)})
        if res is None:
            return None
        return res
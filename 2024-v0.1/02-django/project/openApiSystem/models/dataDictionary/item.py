from bson.objectid import ObjectId
from openApiSystem.models.registry.item import (
    RE_Item,
)
from openApiSystem.models.concept.item import (
    Concept,
)  

class CD_EnumeratedValue(Concept):
    @classmethod
    def get_item_list(cls, C_id):
        res = cls.collection.find({'concept_id': ObjectId(C_id), 'itemType': 'EnumeratedValue'})
        if res is None:
            return None
        return res
    @classmethod
    def get_item_detail(cls, I_id):
        res = cls.collection.find_one({'_id': ObjectId(I_id), 'itemType': 'EnumeratedValue'})
        if res is None:
            return None
        return res

class CD_Attribute(Concept):
    @classmethod
    def get_item_list(cls, C_id):
        res = cls.collection.find({
            'concept_id': ObjectId(C_id), 
            'itemType': {'$in': ['SimpleAttribute', 'ComplexAttribute']}
        })
        if res is None:
            return None
        return res

class CD_SimpleAttribute(CD_Attribute):
    @classmethod
    def get_item_list(cls, C_id):
        res = cls.collection.find({'concept_id': ObjectId(C_id), 'itemType': 'SimpleAttribute'})
        if res is None:
            return None
        return res
    @classmethod
    def get_item_detail(cls, I_id):
        res = cls.collection.find_one({'_id': ObjectId(I_id), 'itemType': 'SimpleAttribute'})
        if res is None:
            return None
        return res

class CD_ComplexAttribute(CD_Attribute):
    @classmethod
    def get_item_list(cls, C_id):
        res = cls.collection.find({'concept_id': ObjectId(C_id), 'itemType': 'ComplexAttribute'})
        if res is None:
            return None
        return res
    @classmethod
    def get_item_detail(cls, I_id):
        res = cls.collection.find_one({'_id': ObjectId(I_id), 'itemType': 'ComplexAttribute'})
        if res is None:
            return None
        return res

class CD_Feature(CD_Attribute):
    @classmethod
    def get_item_list(cls, C_id):
        res = cls.collection.find({'concept_id': ObjectId(C_id), 'itemType': 'FeatureType'})
        if res is None:
            return None
        return res
    @classmethod
    def get_item_detail(cls, I_id):
        res = cls.collection.find_one({'_id': ObjectId(I_id), 'itemType': 'FeatureType'})
        if res is None:
            return None
        return res

class CD_Information(CD_Attribute):
    @classmethod
    def get_item_list(cls, C_id):
        res = cls.collection.find({'concept_id': ObjectId(C_id), 'itemType': 'InformationType'})
        if res is None:
            return None
        return res
    @classmethod
    def get_item_detail(cls, I_id):
        res = cls.collection.find_one({'_id': ObjectId(I_id), 'itemType': 'InformationType'})
        if res is None:
            return None
        return res


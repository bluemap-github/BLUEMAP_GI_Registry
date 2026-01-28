from mongo_driver import db
from bson.objectid import ObjectId

from regiSystem.serializers.CD import (
        AttributeUsageSerializer
)

S100_Concept_Register = db['S100_Concept_Register']

S100_Concept_ManagementInfo = db['S100_Concept_ManagementInfo']
S100_Concept_ReferenceSource = db['S100_Concept_ReferenceSource']
S100_Concept_Reference = db['S100_Concept_Reference']
S100_Concept_Item = db['S100_Concept_Item']
S100_CD_AttributeConstraints = db['S100_CD_AttributeConstraints']


S100_Portrayal_Item = db['S100_Portrayal_Item']

S100_DD_associatedAttribute = db['S100_DD_associatedAttribute']
S100_CD_AttributeUsage = db['S100_CD_AttributeUsage']
S100_DD_distinction = db['S100_DD_distinction']


import datetime
class RegiModel:
    @staticmethod
    def update_date(registry_id):
        date = datetime.datetime.now().strftime("%Y-%m-%d")
        S100_Concept_Register.update_one({"_id": registry_id}, {"$set": {"dateOfLastChange": date}})

    @classmethod
    def get_registry(cls, registry_uri):
        return S100_Concept_Register.find_one({"uniformResourceIdentifier": registry_uri})
    

class ListedValue:
    collection = S100_DD_associatedAttribute  # 하위 클래스에서 오버라이드

    @classmethod
    def get_listed_value(cls, parent_id):
        return cls.collection.find({"parent_id": ObjectId(parent_id)})

    @classmethod
    def get_parent_id(cls, child_id):
        c_item = cls.collection.find_one({"child_id": ObjectId(child_id)})
        return c_item['parent_id'] if c_item else None

    @classmethod
    def insert_listed_value(cls, parent_id, child_id):
        cls.collection.insert_one({
            "parent_id": ObjectId(parent_id),
            "child_id": ObjectId(child_id)
        })

    @classmethod
    def delete(cls, child_id):
        result = cls.collection.delete_many({"child_id": ObjectId(child_id)})
        return {"status": "success", "deleted_count": result.deleted_count}



class AttributeUsage:
    collection = S100_CD_AttributeUsage

    @classmethod
    def get_parent_id(cls, child_id):
        c_item = cls.collection.find_one({"child_id": ObjectId(child_id)})
        return c_item['parent_id'] if c_item else None

    @classmethod
    def get_sub_attributes(cls, parent_id):
        return cls.collection.find({"parent_id": ObjectId(parent_id)})

    @classmethod
    def make_attribute_usage(cls, source, target):
        usageData = {
            "lower": 0,
            "upper": 0,
            "sequential": False
        }
        serializer = AttributeUsageSerializer(data=usageData)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            validated_data['parent_id'] = ObjectId(source)
            validated_data['child_id'] = ObjectId(target)
            cls.collection.insert_one(validated_data)

    @classmethod
    def delete(cls, parent_id):
        cls.collection.delete_many({"parent_id": ObjectId(parent_id)})

    @classmethod
    def update_child_id(cls, parent_id, origin_child_id, new_child_id):
        cls.collection.update_one(
            {"parent_id": ObjectId(parent_id), "child_id": ObjectId(origin_child_id)},
            {"$set": {"child_id": ObjectId(new_child_id)}}
        )

class Distinction:
    collection = S100_DD_distinction

    @classmethod
    def get_distincted_item(cls, parent_id):
        return cls.collection.find({"parent_id": ObjectId(parent_id)})

    @classmethod
    def get_parent_id(cls, child_id):
        c_item = cls.collection.find_one({"child_id": ObjectId(child_id)})
        return c_item['parent_id'] if c_item else None

    @classmethod
    def insert_distinction(cls, parent_id, child_id):
        cls.collection.insert_one({"parent_id": ObjectId(parent_id), "child_id": ObjectId(child_id)})

    @classmethod
    def delete(cls, parent_id):
        result = cls.collection.delete_many({"parent_id": ObjectId(parent_id)})
        return {"status": "success", "deleted_count": result.deleted_count}

class ManagementInfoModel:
    collection = S100_Concept_ManagementInfo

    @classmethod
    def delete(cls, Item_id):
        if Item_id is None:
            return {"status": "failed", "message": "Item_id is None"}
        result = cls.collection.delete_many({"concept_item_id": ObjectId(Item_id)})
        
        return {"status": "success", "deleted_count": result.deleted_count}


class ConstraintsModel:
    collection = S100_CD_AttributeConstraints

    @classmethod
    def update(cls, Item_id, simple_id, data):
        print(data)
        if Item_id is None:
            return {"status": "failed", "message": "Item_id is None"}
        data["simpleAttribute"] = ObjectId(simple_id)
        result = cls.collection.update_one({"_id": ObjectId(Item_id)}, {"$set": data})
        
        return {"status": "success", "updated_id": result.upserted_id}

    @classmethod
    def delete(cls, Item_id):
        if Item_id is None:
            return {"status": "failed", "message": "Item_id is None"}
        result = cls.collection.delete_one({"_id": ObjectId(Item_id)})
        
        return {"status": "success", "deleted_count": result.deleted_count}
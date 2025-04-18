from mongo_driver import db

IHO_Item = db['IHO_Item']
IHO_ManagementInfo = db['IHO_ManagementInfo']
IHO_Reference = db['IHO_Reference']
IHO_ReferenceSource = db['IHO_ReferenceSource']
IHO_DD_associatedAttribute = db['IHO_DD_associatedAttribute']
IHO_CD_AttributeUsage = db['IHO_CD_AttributeUsage']
IHO_DD_distinction = db['IHO_DD_distinction']

class IHO_Classes:
    collection = IHO_Item
    # @classmethod
    # def check_existing_data(cls):
    #     return cls.collection.count_documents({}) > 0
    
    @classmethod
    def clear_collection(cls):
        cls.collection.delete_many({})
        return {"status": "success", "message": f"{cls.collection.name} Collection cleared."}

    @classmethod
    def sync_from_iho(cls, data_list):
        cls.clear_collection()
        if data_list:
            cls.collection.insert_many(data_list)
            return {"status": "success", "message": f"{len(data_list)} items synced."}
        else:
            return {"status": "warning", "message": "No data to sync."}

    @classmethod
    def insert_one(cls, data):
        result = cls.collection.insert_one(data)
        return {
            "status": "success",
            "message": "Data inserted successfully.",
            "inserted_id": str(result.inserted_id)  # ObjectId → 문자열 변환
        }

class IHO_Item(IHO_Classes):
    collection = IHO_Item

class IHO_ManagementInfo(IHO_Classes):
    collection = IHO_ManagementInfo

class IHO_Reference(IHO_Classes):
    collection = IHO_Reference

class IHO_ReferenceSource(IHO_Classes):
    collection = IHO_ReferenceSource

from regiSystem.models.Concept import ListedValue, AttributeUsage, Distinction
class IHO_ListedValue(ListedValue):
    collection = IHO_DD_associatedAttribute

# in ihoDataIntegrationSystem/db_classes.py
class IHO_AttributeUsage(AttributeUsage):
    collection = IHO_CD_AttributeUsage

class IHO_Distinction(Distinction):
    collection = IHO_DD_distinction

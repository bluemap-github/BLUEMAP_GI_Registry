from bson.objectid import ObjectId
from openApiSystem.models.dbs import (
    RegistryAccess,
    S100_Concept_Register,
    S100_Concept_Item,
    S100_Concept_ManagementInfo,
    S100_Concept_Reference,
    S100_Concept_ReferenceSource,
)

class RE_Register:
    collection = S100_Concept_Register

    @classmethod
    def get_register_by_url(cls, uri):
        res = cls.collection.find_one({'uniformResourceIdentifier': uri})
        if not res:
            return None
        return res["_id"]

class RE_Item:
    collection = S100_Concept_Item

class RE_ManagementInfo:
    collection = S100_Concept_ManagementInfo

class RE_Reference:
    collection = S100_Concept_Reference

class RE_ReferenceSource:
    collection = S100_Concept_ReferenceSource

class RE_Access:
    collection = RegistryAccess

    @classmethod
    def get_access(cls, regi_id):
        res = cls.collection.find({'registry_id': ObjectId(regi_id)})
        return res
        

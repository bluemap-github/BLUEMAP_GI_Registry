from bson.objectid import ObjectId
from openApiSystem.models.dbs import (
    S100_CD_AttributeUsage,
    S100_DD_associatedAttribute,
    S100_DD_distinction,
    S100_Concept_Item
)
class Association:
    @classmethod
    def insert_association(cls, parent_id, child_id):
        if parent_id is None or child_id is None:
            return {"status": "failed", "message": "parent_id or child_id is None"}
        result = cls.collection.insert_one({"parent_id": ObjectId(parent_id), "child_id": ObjectId(child_id)})
        return {"status": "success", "inserted_id": str(result.inserted_id)}
    
    @classmethod
    def update_association(cls, association_id, new_child_id):
        if association_id is None or new_child_id is None:
            return {"status": "error", "message": "association_id or new_child_id is None"}
        cls.collection.update_one({"_id": ObjectId(association_id)}, {"$set": {"child_id": ObjectId(new_child_id)}})
        return {"status": "success", "updated_id": str(association_id)}
    
    @classmethod
    def delete_association(cls, association_id):
        if association_id is None:
            return {"status": "failed", "message": "association_id is None"}
        result = cls.collection.delete_one({"_id": ObjectId(association_id)})
        return {"status": "success", "deleted_count": result.deleted_count}

    @classmethod
    def get_association(cls, parent_id):
        result = []
        for item in list(cls.collection.find({"parent_id": ObjectId(parent_id)})):
            child_id = item['child_id']
            res_docs = S100_Concept_Item.find_one({"_id": ObjectId(child_id)})
            if res_docs:
                result.append({
                    "child_id": str(child_id),  # ObjectId를 문자열로 변환
                    "name": res_docs["name"],
                    "item_type": res_docs["itemType"],
                })
        return result




from regiSystem.serializers.CD import (
        AttributeUsageSerializer
)

class CD_AttributeUsage(Association):
    collection = S100_CD_AttributeUsage

    @staticmethod
    def insert_association(parent_id, child_id):
        usageData = {
            "lower": 0,
            "upper": 0,
            "sequential": False
        }
        serializer = AttributeUsageSerializer(data=usageData)
        
        # 유효성 검사를 통과했을 때
        if serializer.is_valid():
            validated_data = serializer.validated_data
            validated_data['parent_id'] = ObjectId(parent_id)
            validated_data['child_id'] = ObjectId(child_id)
            inserted_id = S100_CD_AttributeUsage.insert_one(validated_data)
            return {"status": "success", "inserted_id": str(inserted_id.inserted_id)}
        
        # 유효성 검사 실패 시
        return {"status": "error", "message": serializer.errors}
    
    @staticmethod
    def update_association(association_id, new_child_id):
        S100_CD_AttributeUsage.update_one(
            {"_id": ObjectId(association_id)},
            {"$set": {"child_id": ObjectId(new_child_id)}}
        )
        return {"status": "success", "updated_id": str(association_id)}
    
    

class DD_associatedAttribute(Association):
    collection = S100_DD_associatedAttribute

    @classmethod
    def update_association(cls, association_id, new_parent_id):
        if association_id is None or new_parent_id is None:
            return {"status": "error", "message": "association_id or new_parent_id is None"}
        cls.collection.update_one({"_id": ObjectId(association_id)}, {"$set": {"parent_id": ObjectId(new_parent_id)}})
        return {"status": "success", "updated_id": str(association_id)}
    

class DD_distinction(Association):
    collection = S100_DD_distinction
from mongo_driver import db
from bson.objectid import ObjectId
from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)
from regiSystem.models.PR_Visual import RegisterItemModel

from regiSystem.serializers.PR import S100_PR_DisplayModeSerializer
class DisplayModeModel:
    collection = db['S100_PR_DisplayMode']
    
    @classmethod
    def insert(cls, data, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # 시리얼라이저를 사용하여 데이터 검증
        serializer = S100_PR_DisplayModeSerializer(data=data)
        
        if serializer.is_valid():
            validated_data = serializer.validated_data
            
            # 1. description 처리 (RegisterItemModel에서 처리)
            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # description 처리 중 에러 발생 시 반환
            validated_data['description_ids'] = description_ids
            del validated_data['description']
            # 4. concept_id 추가
            validated_data['concept_id'] = C_id

            # 2. 최종적으로 ColourPaletteModel에 삽입
            result = cls.collection.insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def get_list(cls, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        result = cls.collection.find({"concept_id": ObjectId(C_id)})
        data = []
        for item in result:
            item['_id'] = get_encrypted_id([item['_id']])
            if 'description_ids' in item:
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
                del item['description_ids'] # description_ids 필드는 삭제
            data.append(item)
        return {"status": "success", "data": data}

    @classmethod
    def get_one(cls, I_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # MongoDB에서 _id로 해당 데이터를 찾음
        result = cls.collection.find_one({"_id": ObjectId(I_id)})

        if not result:
            return {"status": "error", "message": "Item not found"}

        description_ids = result.get('description_ids', [])
        if description_ids:
            descriptions = []
            for desc_id in description_ids:
                nls_data = RegisterItemModel.get_national_language_string(desc_id)
                if nls_data:
                    if '_id' in nls_data:
                        nls_data.pop('_id')
                    descriptions.append(nls_data)
                else:
                    return {"status": "error", "message": f"NationalLanguageString with id {desc_id} not found"}

            # description 필드로 복원
            result['description'] = descriptions
            del result['description_ids']  # description_ids 필드는 삭제
        # 모든 ObjectId를 문자열로 변환
        result['_id'] = str(result['_id'])

        # 다른 ObjectId 필드가 있다면 문자열로 변환
        if 'concept_id' in result:
            result['concept_id'] = str(result['concept_id'])
        
        return {"status": "success", "data": result}

from regiSystem.serializers.PR import S100_PR_DisplayPlaneSerializer
class DisplayPlaneModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_ViewingGroupLayerSerializer
class ViewingGroupLayerModel:
    collection = db['S100_PR_ViewingGroupLayer']
    
    @classmethod
    def insert(cls, data, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # 시리얼라이저를 사용하여 데이터 검증
        serializer = S100_PR_ViewingGroupLayerSerializer(data=data)
        
        if serializer.is_valid():
            validated_data = serializer.validated_data
            
            # 1. description 처리 (RegisterItemModel에서 처리)
            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # description 처리 중 에러 발생 시 반환
            validated_data['description_ids'] = description_ids
            del validated_data['description']
            # 4. concept_id 추가
            validated_data['concept_id'] = C_id

            # 2. 최종적으로 ColourPaletteModel에 삽입
            result = cls.collection.insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def get_list(cls, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        result = cls.collection.find({"concept_id": ObjectId(C_id)})
        data = []
        for item in result:
            item['_id'] = get_encrypted_id([item['_id']])
            if 'description_ids' in item:
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
                del item['description_ids'] # description_ids 필드는 삭제
            data.append(item)
        return {"status": "success", "data": data}

    @classmethod
    def get_one(cls, I_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # MongoDB에서 _id로 해당 데이터를 찾음
        result = cls.collection.find_one({"_id": ObjectId(I_id)})

        if not result:
            return {"status": "error", "message": "Item not found"}

        description_ids = result.get('description_ids', [])
        if description_ids:
            descriptions = []
            for desc_id in description_ids:
                nls_data = RegisterItemModel.get_national_language_string(desc_id)
                if nls_data:
                    if '_id' in nls_data:
                        nls_data.pop('_id')
                    descriptions.append(nls_data)
                else:
                    return {"status": "error", "message": f"NationalLanguageString with id {desc_id} not found"}

            # description 필드로 복원
            result['description'] = descriptions
            del result['description_ids']  # description_ids 필드는 삭제
        # 모든 ObjectId를 문자열로 변환
        result['_id'] = str(result['_id'])

        # 다른 ObjectId 필드가 있다면 문자열로 변환
        if 'concept_id' in result:
            result['concept_id'] = str(result['concept_id'])
        
        return {"status": "success", "data": result}

from regiSystem.serializers.PR import S100_PR_ViewingGroupSerializer
class ViewingGroupModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_FontSerializer   
class FontModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_ContextParameterSerializer
class ContextParameterModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_DrawingPrioritySerializer
class DrawingPriorityModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_AlertHighlightSerializer
class AlertHighlightModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass


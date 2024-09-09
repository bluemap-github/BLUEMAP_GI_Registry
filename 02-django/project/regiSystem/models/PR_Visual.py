from mongo_driver import db
from bson.objectid import ObjectId
from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)

S100_Portrayal_PaletteItem = db['S100_Portrayal_PaletteItem']
S100_Portrayal_ColourPalette = db['S100_Portrayal_ColourPalette']
S100_Portrayal_ColourValue = db['S100_Portrayal_ColourValue']
S100_Portrayal_CIEValue = db['S100_Portrayal_CIEValue']
S100_Portrayal_SRGBValue = db['S100_Portrayal_SRGBValue']
S100_Portrayal_NationalLanguageString = db['S100_Portrayal_NationalLanguageString']

from regiSystem.serializers.PR import (
    S100_PR_NationalLanguageStringSerializer
)


class RegisterItemModel:
    @staticmethod
    def process_description(description_data):
        description_ids = []
        
        for desc in description_data:
            desc_serializer = S100_PR_NationalLanguageStringSerializer(data=desc)
            if desc_serializer.is_valid():
                result = db['S100_Portrayal_NationalLanguageString'].insert_one(desc_serializer.validated_data)
                description_ids.append(str(result.inserted_id))
            else:
                return {"status": "error", "errors": desc_serializer.errors}
        return description_ids

    @staticmethod
    def get_national_language_string(nls_id):
        return S100_Portrayal_NationalLanguageString.find_one({"_id": ObjectId(nls_id)})

## Visual Item Model
from regiSystem.serializers.PR import S100_PR_VisualItemSerializer
class VisualItemModel:
    collection = None  # 하위 클래스에서 MongoDB 컬렉션을 설정

    @classmethod
    def insert(cls, data, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # 시리얼라이저를 사용한 데이터 검증
        serializer = S100_PR_VisualItemSerializer(data=data)
        
        if serializer.is_valid():
            validated_data = serializer.validated_data
            description_data = validated_data.get('description', [])
            
            # 공통된 description 처리 로직 호출
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # 에러 반환
            
            # description을 ID로 대체
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            # concept_id 추가
            validated_data['concept_id'] = C_id

            # 최종 데이터 삽입
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
            item['_id'] = get_encrypted_id([item['_id']])  # ObjectId 암호화
            if 'description_ids' in item:  # description_ids가 있을 경우 처리
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
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
            del result['description_ids']
        # 모든 ObjectId를 문자열로 변환
        result['_id'] = str(result['_id'])

        # 다른 ObjectId 필드가 있다면 문자열로 변환
        if 'concept_id' in result:
            result['concept_id'] = str(result['concept_id'])

        return {"status": "success", "data": result}


class SymbolModel(VisualItemModel):
    collection = db['S100_Portrayal_Symbol']
class LineStyleModel(VisualItemModel):
    collection = db['S100_Portrayal_LineStyle']
class AreaFillModel(VisualItemModel):
    collection = db['S100_Portrayal_AreaFill']
class PixmapModel(VisualItemModel):
    collection = db['S100_Portrayal_Pixmap']


## Item Schema Model
from regiSystem.serializers.PR import S100_PR_ItemSchemaSerializer

class ItemSchemaModel:
    collection = None  # 하위 클래스에서 MongoDB 컬렉션을 설정

    @classmethod
    def insert(cls, data, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # 시리얼라이저를 사용한 데이터 검증
        serializer = S100_PR_ItemSchemaSerializer(data=data)
        
        if serializer.is_valid():
            validated_data = serializer.validated_data
            description_data = validated_data.get('description', [])
            
            # 공통된 description 처리 로직 호출
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # 에러 반환
            
            # description을 ID로 대체
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            # concept_id 추가
            validated_data['concept_id'] = C_id
            # 최종 데이터 삽입
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
            item['_id'] = get_encrypted_id([item['_id']])  # ObjectId 암호화
            if 'description_ids' in item:  # description_ids가 있을 경우 처리
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
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




class SymbolSchemaModel(ItemSchemaModel):
    collection = db['S100_Portrayal_SymbolSchema']

class LineStyleSchemaModel(ItemSchemaModel):
    collection = db['S100_Portrayal_LineStyleSchema']

class AreaFillSchemaModel(ItemSchemaModel):
    collection = db['S100_Portrayal_AreaFillSchema']

class PixmapSchemaModel(ItemSchemaModel):
    collection = db['S100_Portrayal_PixmapSchema']

class ColourProfileSchemaModel(ItemSchemaModel):
    collection = db['S100_Portrayal_ColourProfileSchema']


from regiSystem.serializers.PR import S100_PR_ColourTokenSerializer
## Colour Token Model
class ColourTokenModel:
    collection = db['S100_Portrayal_ColourToken']
    
    @classmethod
    def insert(cls, data, C_id):
        # 데이터가 저장될 컬렉션이 설정되어 있는지 확인
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # 시리얼라이저를 사용하여 데이터 검증
        serializer = S100_PR_ColourTokenSerializer(data=data)
        
        if serializer.is_valid():
            # 검증된 데이터를 가져옴
            validated_data = serializer.validated_data
            
            # description 필드 처리
            description_data = validated_data.get('description', [])
            if description_data:
                description_ids = RegisterItemModel.process_description(description_data)
                if isinstance(description_ids, dict) and "errors" in description_ids:
                    return description_ids  # description 처리 중 에러 발생 시 반환
                validated_data['description_ids'] = description_ids
                del validated_data['description']  # 원래 description 필드를 삭제
            # concept_id 추가
            validated_data['concept_id'] = C_id
            
            # 검증된 데이터를 컬렉션에 삽입
            result = cls.collection.insert_one(validated_data)
            
            # 삽입 결과 반환
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        
        else:
            # 시리얼라이저 검증 실패 시 에러 반환
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def get_list(cls, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        result = cls.collection.find({"concept_id": ObjectId(C_id)})
        data = []
        for item in result:
            item['_id'] = get_encrypted_id([item['_id']])  # ObjectId 암호화
            if 'description_ids' in item:  # description_ids가 있을 경우 처리
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
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



## Palette Item Model
from regiSystem.serializers.PR import S100_PR_PaletteItemSerializer, S100_PR_CIEValueSerializer, S100_PR_SRGBValueSerializer

class CIEModel:
    @staticmethod
    def process_cie(cie_data):
        cie_serializer = S100_PR_CIEValueSerializer(data=cie_data)
        if cie_serializer.is_valid():
            result = db['S100_Portrayal_CIEValue'].insert_one(cie_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": cie_serializer.errors}

class SRGBModel:
    @staticmethod
    def process_srgb(srgb_data):
        srgb_serializer = S100_PR_SRGBValueSerializer(data=srgb_data)
        if srgb_serializer.is_valid():
            result = db['S100_Portrayal_SRGBValue'].insert_one(srgb_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": srgb_serializer.errors}

class PaletteItemModel:
    collection = db['S100_Portrayal_PaletteItem']
    
    @classmethod
    def insert(cls, data, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # 시리얼라이저를 사용하여 데이터 검증
        serializer = S100_PR_PaletteItemSerializer(data=data)
        
        if serializer.is_valid():
            validated_data = serializer.validated_data
            
            # 1. description 처리 (RegisterItemModel에서 처리)
            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # description 처리 중 에러 발생 시 반환
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            # 2. sRGB 처리 (SRGBModel에서 처리)
            if 'colourValue' in validated_data and validated_data['colourValue'].get('sRGB'):
                srgb_result = SRGBModel.process_srgb(validated_data['colourValue']['sRGB'])
                if isinstance(srgb_result, dict) and "errors" in srgb_result:
                    return srgb_result
                validated_data['colourValue']['sRGB_id'] = srgb_result
                del validated_data['colourValue']['sRGB']

            # 3. cie 처리 (CIEModel에서 처리)
            if 'colourValue' in validated_data and validated_data['colourValue'].get('cie'):
                cie_result = CIEModel.process_cie(validated_data['colourValue']['cie'])
                if isinstance(cie_result, dict) and "errors" in cie_result:
                    return cie_result
                validated_data['colourValue']['cie_id'] = cie_result
                del validated_data['colourValue']['cie']

            # 4. concept_id 추가
            validated_data['concept_id'] = C_id
            # 4. 최종적으로 PaletteItemModel에 삽입
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
            if 'colourValue' in item:
                if 'sRGB_id' in item['colourValue']:
                    item['colourValue']['sRGB'] = S100_Portrayal_SRGBValue.find_one({"_id": ObjectId(item['colourValue']['sRGB_id'])})
                    del item['colourValue']['sRGB_id']
                if 'cie_id' in item['colourValue']:
                    item['colourValue']['cie'] = S100_Portrayal_CIEValue.find_one({"_id": ObjectId(item['colourValue']['cie_id'])})
                    del item['colourValue']['cie_id']
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

        # Convert the ObjectId fields to strings
        result['_id'] = str(result['_id'])
        
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
        if 'colourValue' in result:
            if 'sRGB_id' in result['colourValue']:
                result['colourValue']['sRGB'] = S100_Portrayal_SRGBValue.find_one({"_id": ObjectId(result['colourValue']['sRGB_id'])})
                if "_id" in result['colourValue']['sRGB']:
                    result['colourValue']['sRGB'].pop("_id")
                del result['colourValue']['sRGB_id']
            if 'cie_id' in result['colourValue']:
                result['colourValue']['cie'] = S100_Portrayal_CIEValue.find_one({"_id": ObjectId(result['colourValue']['cie_id'])})
                if "_id" in result['colourValue']['cie']:
                    result['colourValue']['cie'].pop("_id")
                del result['colourValue']['cie_id']
        # 모든 ObjectId를 문자열로 변환
        result['_id'] = str(result['_id'])

        # 다른 ObjectId 필드가 있다면 문자열로 변환
        if 'concept_id' in result:
            result['concept_id'] = str(result['concept_id'])
        
        return {"status": "success", "data": result}

## Colour Palette Model
from regiSystem.serializers.PR import S100_PR_ColourPalletteSerializer
class ColourPaletteModel:
    collection = db['S100_Portrayal_ColourPalette']
    
    @classmethod
    def insert(cls, data, C_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        
        # 시리얼라이저를 사용하여 데이터 검증
        serializer = S100_PR_ColourPalletteSerializer(data=data)
        
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

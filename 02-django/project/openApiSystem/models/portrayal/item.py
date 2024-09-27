
from bson.objectid import ObjectId
from openApiSystem.models.dbs import (
    S100_Portrayal_Alert,
    S100_Portrayal_AlertHighlight,
    S100_Portrayal_AlertInfo,
    S100_Portrayal_AlertMessage,
    S100_Portrayal_AlertPriority,
    S100_Portrayal_AreaFill,
    S100_Portrayal_AreaFillSchema,
    S100_Portrayal_CIEValue,
    S100_Portrayal_ColourPalette,
    S100_Portrayal_ColourProfileSchema,
    S100_Portrayal_ColourToken,
    S100_Portrayal_ContextParameter,
    S100_Portrayal_DisplayMode,
    S100_Portrayal_DisplayPlane,
    S100_Portrayal_DrawingPriority,
    S100_Portrayal_Font,
    S100_Portrayal_LineStyle,
    S100_Portrayal_LineStyleSchema,
    S100_Portrayal_NationalLanguageString,
    S100_Portrayal_PaletteItem,
    S100_Portrayal_Pixmap,
    S100_Portrayal_PixmapSchema,
    S100_Portrayal_SRGBValue,
    S100_Portrayal_Symbol,
    S100_Portrayal_SymbolSchema,
    S100_Portrayal_ViewingGroup,
    S100_Portrayal_ViewingGroupLayer,

)
from openApiSystem.serializers.portrayal.item import (
    S100_PR_NationalLanguageStringSerializer, S100_PR_RegisterItemSerializer,
    S100_PR_VisualItemSerializer, S100_PR_ItemSchemaSerializer,
    S100_PR_ColourTokenSerializer, S100_PR_ColourPalletteSerializer,
    S100_PR_DisplayPlaneSerializer, S100_PR_DisplayModeSerializer,
    S100_PR_ViewingGroupLayerSerializer, S100_PR_ViewingGroupSerializer,
    S100_PR_FontSerializer, S100_PR_ContextParameterSerializer,
    S100_PR_DrawingPrioritySerializer, S100_PR_AlertHighlightSerializer,
    S100_PR_AlertSerializer, S100_PR_AlertInfoSerializer
)

class RegisterItemModel:
    @staticmethod
    def process_description(description_data):
        description_ids = []
        for desc in description_data:
            desc_serializer = S100_PR_NationalLanguageStringSerializer(data=desc)
            if desc_serializer.is_valid():
                result = S100_Portrayal_NationalLanguageString.insert_one(desc_serializer.validated_data)
                description_ids.append(str(result.inserted_id))
            else:
                return {"status": "error", "errors": desc_serializer.errors}
        return description_ids

    @staticmethod
    def get_national_language_string(nls_id):
        return S100_Portrayal_NationalLanguageString.find_one({"_id": ObjectId(nls_id)})



class PR_RegisterItem:
    collection = None

    @staticmethod
    def get_national_language_string(nls_id):
        return S100_Portrayal_NationalLanguageString.find_one({"_id": ObjectId(nls_id)})
    
    @classmethod
    def get_list_by_id(cls, C_id):
        """
        각 컬렉션에서 동일한 concept_id에 해당하는 데이터를 조회한 후 병합하여 반환합니다.
        """
        data = []
        result = cls.collection[0].find({"concept_id": ObjectId(C_id)})
        for item in result:
            # description 처리
            if 'description_ids' in item:
                item['description'] = [
                    PR_RegisterItem.get_national_language_string(str(nls_id)) 
                    for nls_id in item['description_ids']
                ]
                del item['description_ids']
            
            # 결과를 리스트에 추가
            data.append(item)
        
        return data
    
    @classmethod
    def get_item_detail(cls, I_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")

        # MongoDB에서 _id로 해당 데이터를 찾음
        result = cls.collection[0].find_one({"_id": ObjectId(I_id)})

        if not result:
            return {"status": "error", "message": "Item not found"}

        # _id를 문자열로 변환
        result['_id'] = str(result['_id'])

        # description_ids 처리 로직
        if 'description_ids' in result:
            descriptions = []
            for desc_id in result['description_ids']:
                nls_data = PR_RegisterItem.get_national_language_string(desc_id)
                if nls_data:
                    # _id 필드를 제거
                    if '_id' in nls_data:
                        nls_data.pop('_id')
                    descriptions.append(nls_data)
                else:
                    return {"status": "error", "message": f"NationalLanguageString with id {desc_id} not found"}
            
            # description 필드로 복원
            result['description'] = descriptions
            del result['description_ids']  # description_ids 필드는 삭제

        # concept_id 처리 로직
        if 'concept_id' in result:
            result['concept_id'] = str(result['concept_id'])

        return result

    @classmethod
    def insert(cls, data, C_id, serializer_class):
        if cls.collection[0] is None:
            raise NotImplementedError("This model does not have a collection assigned.")

        # 시리얼라이저로 데이터 검증
        serializer = serializer_class(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            description_data = validated_data.get('description', [])

            # description 처리
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # 에러 반환

            validated_data['description_ids'] = description_ids
            del validated_data['description']
            validated_data['concept_id'] = C_id

            result = cls.collection[0].insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def update(cls, data, C_id, serializer_class, item_id):
        if cls.collection[0] is None:
            raise NotImplementedError("This model does not have a collection assigned.")

        # 기존 데이터 조회
        existing_item = cls.collection[0].find_one({"_id": ObjectId(item_id)})
        if not existing_item:
            return {"status": "error", "message": "Item not found."}

        # 시리얼라이저로 데이터 검증
        serializer = serializer_class(data=data, partial=True)  # 부분 업데이트를 허용하려면 partial=True
        if serializer.is_valid():
            validated_data = serializer.validated_data
            description_data = validated_data.get('description', [])

            # description 처리
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # 에러 반환

            validated_data['description_ids'] = description_ids
            if 'description' in validated_data:
                del validated_data['description']
            validated_data['concept_id'] = C_id

            # 업데이트 실행
            cls.collection[0].update_one({"_id": ObjectId(item_id)}, {"$set": validated_data})
            return {"status": "success", "updated_id": str(item_id)}
        else:
            return {"status": "error", "errors": serializer.errors}



class PR_VisualItem(PR_RegisterItem):
    collection = [
        S100_Portrayal_Symbol,
        S100_Portrayal_LineStyle,
        S100_Portrayal_AreaFill,
        S100_Portrayal_Pixmap
    ]

    @classmethod
    def get_list_by_id(cls, C_id):
        """
        각 컬렉션에서 동일한 concept_id에 해당하는 데이터를 조회한 후 병합하여 반환합니다.
        """
        data = []
        for collection in cls.collection:
            # 각 컬렉션에서 concept_id에 맞는 항목을 조회
            result = collection.find({"concept_id": ObjectId(C_id)})
            
            for item in result:
                # description 처리
                if 'description_ids' in item:
                    item['description'] = [
                        PR_RegisterItem.get_national_language_string(str(nls_id)) 
                        for nls_id in item['description_ids']
                    ]
                    del item['description_ids']
                
                # 결과를 리스트에 추가
                data.append(item)
        
        return data



# 각 컬렉션을 다루는 클래스는 그대로 유지
class PR_Symbol(PR_VisualItem):
    collection = [S100_Portrayal_Symbol]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)

class PR_LineStyle(PR_VisualItem):
    collection = [S100_Portrayal_LineStyle]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)

class PR_AreaFill(PR_VisualItem):
    collection = [S100_Portrayal_AreaFill]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)

class PR_Pixmap(PR_VisualItem):
    collection = [S100_Portrayal_Pixmap]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)

class PR_ItemSchema(PR_RegisterItem):
    collection = [
        S100_Portrayal_SymbolSchema,
        S100_Portrayal_LineStyleSchema,
        S100_Portrayal_AreaFillSchema,
        S100_Portrayal_PixmapSchema,
        S100_Portrayal_ColourProfileSchema
    ]

    @classmethod
    def get_list_by_id(cls, C_id):
        """
        각 컬렉션에서 동일한 concept_id에 해당하는 데이터를 조회한 후 병합하여 반환합니다.
        """
        data = []
        for collection in cls.collection:
            # 각 컬렉션에서 concept_id에 맞는 항목을 조회
            result = collection.find({"concept_id": ObjectId(C_id)})
            
            for item in result:
                # description 처리
                if 'description_ids' in item:
                    item['description'] = [
                        PR_RegisterItem.get_national_language_string(str(nls_id)) 
                        for nls_id in item['description_ids']
                    ]
                    del item['description_ids']
                
                # 결과를 리스트에 추가
                data.append(item)
        
        return data

class PR_SymbolSchema(PR_ItemSchema):
    collection = [S100_Portrayal_SymbolSchema]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ItemSchemaSerializer)

class PR_LineStyleSchema(PR_ItemSchema):
    collection = [S100_Portrayal_LineStyleSchema]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ItemSchemaSerializer)

class PR_AreaFillSchema(PR_ItemSchema):
    collection = [S100_Portrayal_AreaFillSchema]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ItemSchemaSerializer)

class PR_PixmapSchema(PR_ItemSchema):
    collection = [S100_Portrayal_PixmapSchema]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ItemSchemaSerializer)

class PR_ColourProfileSchema(PR_ItemSchema):
    collection = [S100_Portrayal_ColourProfileSchema]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ItemSchemaSerializer)



class PR_Alert(PR_RegisterItem):
    collection = [S100_Portrayal_Alert]

class PR_AlertInfo(PR_RegisterItem):
    collection = [S100_Portrayal_AlertInfo]

class PR_AlertMessage(PR_RegisterItem):
    collection = S100_Portrayal_AlertMessage

class PR_AlertPriority(PR_RegisterItem):
    collection = S100_Portrayal_AlertPriority

class PR_AlertHighlight(PR_RegisterItem):
    collection = [S100_Portrayal_AlertHighlight]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_AlertHighlightSerializer)

class PR_ContextParameter(PR_RegisterItem):
    collection = [S100_Portrayal_ContextParameter]
    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ContextParameterSerializer)

    

class PR_DisplayMode(PR_RegisterItem):
    collection = [S100_Portrayal_DisplayMode]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_DisplayModeSerializer)

class PR_DisplayPlane(PR_RegisterItem):
    collection = [S100_Portrayal_DisplayPlane]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_DisplayPlaneSerializer)

class PR_DrawingPriority(PR_RegisterItem):
    collection = [S100_Portrayal_DrawingPriority]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_DrawingPrioritySerializer)

class PR_Font(PR_RegisterItem):
    collection = [S100_Portrayal_Font]
    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_FontSerializer)
    

class PR_ColourPalette(PR_RegisterItem):
    collection = [S100_Portrayal_ColourPalette]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ColourPalletteSerializer)

class PR_ColourToken(PR_RegisterItem):
    collection = [S100_Portrayal_ColourToken]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ColourTokenSerializer)


class PR_CIEValue(PR_RegisterItem):
    collection = S100_Portrayal_CIEValue

class PR_SRGBValue(PR_RegisterItem):
    collection = S100_Portrayal_SRGBValue

class PR_NationalLanguageString(PR_RegisterItem):
    collection = S100_Portrayal_NationalLanguageString

class PR_PaletteItem(PR_RegisterItem):
    collection = S100_Portrayal_PaletteItem

class PR_ViewingGroup(PR_RegisterItem):
    collection = [S100_Portrayal_ViewingGroup]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ViewingGroupSerializer)

class PR_ViewingGroupLayer(PR_RegisterItem):
    collection = [S100_Portrayal_ViewingGroupLayer]

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ViewingGroupLayerSerializer)



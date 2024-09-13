from mongo_driver import db
from bson.objectid import ObjectId
from regiSystem.info_sec.encryption import get_encrypted_id
from regiSystem.serializers.PR import (
    S100_PR_NationalLanguageStringSerializer,
    S100_PR_VisualItemSerializer,
    S100_PR_ItemSchemaSerializer,
    S100_PR_PaletteItemSerializer,
    S100_PR_ColourPalletteSerializer,
    S100_PR_ColourTokenSerializer,
    S100_PR_CIEValueSerializer,
    S100_PR_SRGBValueSerializer,

)

S100_Portrayal_PaletteItem = db['S100_Portrayal_PaletteItem']
S100_Portrayal_ColourPalette = db['S100_Portrayal_ColourPalette']
S100_Portrayal_ColourValue = db['S100_Portrayal_ColourValue']
S100_Portrayal_CIEValue = db['S100_Portrayal_CIEValue']
S100_Portrayal_SRGBValue = db['S100_Portrayal_SRGBValue']
S100_Portrayal_NationalLanguageString = db['S100_Portrayal_NationalLanguageString']


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


class RE_RegisterItemModel:
    collection = None  # 하위 클래스에서 MongoDB 컬렉션 설정

    @classmethod
    def insert(cls, data, C_id, serializer_class):
        if cls.collection is None:
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
                del item['description_ids']
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

        # _id를 문자열로 변환
        result['_id'] = str(result['_id'])

        # description_ids 처리 로직
        if 'description_ids' in result:
            descriptions = []
            for desc_id in result['description_ids']:
                nls_data = RegisterItemModel.get_national_language_string(desc_id)
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
    def get_terget_itemType(cls, I_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        result = cls.collection.find_one({"_id": ObjectId(I_id)})
        if not result:
            return {"status": "error", "message": "Item not found"}
        return result['itemType']
    
# 각 모델들은 공통 기능을 RE_RegisterItemModel에서 상속받고 필요에 따라 고유한 메서드를 추가할 수 있음
class SymbolModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_Symbol']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)


class LineStyleModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_LineStyle']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)


class AreaFillModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_AreaFill']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)


class PixmapModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_Pixmap']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_VisualItemSerializer)


class ItemSchemaModel(RE_RegisterItemModel):
    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ItemSchemaSerializer)

    @classmethod
    def get_schema_list(cls, C_id):
        from bson.objectid import ObjectId  # ensure ObjectId is imported

        # 각 하위 클래스의 데이터를 수집
        schema_classes = [
            SymbolSchemaModel,
            LineStyleSchemaModel,
            AreaFillSchemaModel,
            PixmapSchemaModel,
            ColourProfileSchemaModel
        ]
        
        all_schemas = []

        for schema_class in schema_classes:
            if schema_class.collection is not None:  # 안전하게 None과 비교
                try:
                    result = schema_class.collection.find({"concept_id": ObjectId(C_id)})  # MongoDB에서 모든 항목 조회
                    for item in result:
                        # _id를 암호화하고 문자열로 변환
                        item['_id'] = get_encrypted_id([item['_id']])
                        
                        # concept_id가 있으면 문자열로 변환
                        if 'concept_id' in item:
                            item['concept_id'] = str(item['concept_id'])
                        
                        # 스키마 데이터 리스트에 추가
                        all_schemas.append(item)

                except Exception as e:
                    return {"status": "error", "message": str(e)}  # 쿼리 실패 시 에러 메시지 반환
        
        return {"status": "success", "data": all_schemas}





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


# Colour Token Model
class ColourTokenModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_ColourToken']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ColourTokenSerializer)


# Palette Item Model
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


class PaletteItemModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_PaletteItem']

    @classmethod
    def insert(cls, data, C_id):
        serializer = S100_PR_PaletteItemSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            if 'colourValue' in validated_data:
                if 'sRGB' in validated_data['colourValue']:
                    srgb_result = SRGBModel.process_srgb(validated_data['colourValue']['sRGB'])
                    if isinstance(srgb_result, dict) and "errors" in srgb_result:
                        return srgb_result
                    validated_data['colourValue']['sRGB_id'] = srgb_result
                    del validated_data['colourValue']['sRGB']

                if 'cie' in validated_data['colourValue']:
                    cie_result = CIEModel.process_cie(validated_data['colourValue']['cie'])
                    if isinstance(cie_result, dict) and "errors" in cie_result:
                        return cie_result
                    validated_data['colourValue']['cie_id'] = cie_result
                    del validated_data['colourValue']['cie']

            validated_data['concept_id'] = C_id
            result = cls.collection.insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
        
    @classmethod
    def get_one(cls, I_id):
        # RE_RegisterItemModel의 get_one 메서드를 먼저 호출하여 공통 작업 처리
        result = super().get_one(I_id)
        if not isinstance(result, dict) or 'status' in result:
            return result  # 에러가 발생하면 바로 반환

        # colourValue 처리 로직 추가
        if 'colourValue' in result:
            if 'sRGB_id' in result['colourValue']:
                result['colourValue']['sRGB'] = S100_Portrayal_SRGBValue.find_one({"_id": ObjectId(result['colourValue']['sRGB_id'])})
                if '_id' in result['colourValue']['sRGB']:
                    result['colourValue']['sRGB'].pop('_id')
                del result['colourValue']['sRGB_id']

            if 'cie_id' in result['colourValue']:
                result['colourValue']['cie'] = S100_Portrayal_CIEValue.find_one({"_id": ObjectId(result['colourValue']['cie_id'])})
                if '_id' in result['colourValue']['cie']:
                    result['colourValue']['cie'].pop('_id')
                del result['colourValue']['cie_id']

        return result



from regiSystem.serializers.PR import S100_PR_AlertPrioritySerializer, S100_PR_AlertSerializer, S100_PR_AlertInfoSerializer
class AlertPriorityModel(RE_RegisterItemModel):
    @staticmethod
    def process_priority(priority_data):
        priority_serializer = S100_PR_AlertPrioritySerializer(data=priority_data)
        if priority_serializer.is_valid():
            result = db['S100_Portrayal_AlertPriority'].insert_one(priority_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": priority_serializer.errors}

class AlertInfoModel(RE_RegisterItemModel):
    @staticmethod
    def process_info(info_data):
        info_serializer = S100_PR_AlertInfoSerializer(data=info_data)
        if info_serializer.is_valid():
            priority_data = info_serializer.validated_data.get('priority', [])
            priority_ids = []
            for priority in priority_data:
                priority_result = AlertPriorityModel.process_priority(priority)
                if isinstance(priority_result, dict) and "errors" in priority_result:
                    return priority_result
                priority_ids.append(priority_result)
            info_serializer.validated_data['priority_ids'] = priority_ids
            del info_serializer.validated_data['priority']
            result = db['S100_Portrayal_AlertInfo'].insert_one(info_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": info_serializer.errors}


class AlertModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_Alert']

    @classmethod
    def insert(cls, data, C_id):
        serializer = S100_PR_AlertSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            routeMonitor_data = validated_data.get('routeMonitor', [])
            routeMonitor_ids = []
            for info in routeMonitor_data:
                info_result = AlertInfoModel.process_info(info)
                if isinstance(info_result, dict) and "errors" in info_result:
                    return info_result
                routeMonitor_ids.append(info_result)
            validated_data['routeMonitor_ids'] = routeMonitor_ids
            del validated_data['routeMonitor']

            routePlan_data = validated_data.get('routePlan', [])
            routePlan_ids = []
            for info in routePlan_data:
                info_result = AlertInfoModel.process_info(info)
                if isinstance(info_result, dict) and "errors" in info_result:
                    return info_result
                routePlan_ids.append(info_result)
            validated_data['routePlan_ids'] = routePlan_ids
            del validated_data['routePlan']

            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            validated_data['concept_id'] = C_id
            result = cls.collection.insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def get_list(cls, C_id):
        # MongoDB에서 concept_id로 Alert 항목들 가져오기
        result = cls.collection.find({"concept_id": ObjectId(C_id)})

        if not result:
            return {"status": "error", "message": "No alerts found"}

        data = []
        for item in result:
            # _id를 문자열로 변환
            item['_id'] = get_encrypted_id([item['_id']])

            # description_ids 처리 로직
            if 'description_ids' in item:
                descriptions = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
                item['description'] = descriptions
                del item['description_ids']

            # routeMonitor 처리
            if 'routeMonitor_ids' in item:
                routeMonitor_data = []
                for monitor_id in item['routeMonitor_ids']:
                    monitor_data = cls.get_alert_info(monitor_id)
                    if isinstance(monitor_data, dict) and "errors" in monitor_data:
                        return monitor_data
                    routeMonitor_data.append(monitor_data)
                item['routeMonitor'] = routeMonitor_data
                del item['routeMonitor_ids']

            # routePlan 처리
            if 'routePlan_ids' in item:
                routePlan_data = []
                for plan_id in item['routePlan_ids']:
                    plan_data = cls.get_alert_info(plan_id)
                    if isinstance(plan_data, dict) and "errors" in plan_data:
                        return plan_data
                    routePlan_data.append(plan_data)
                item['routePlan'] = routePlan_data
                del item['routePlan_ids']

            # 리스트에 추가
            data.append(item)

        return {"status": "success", "data": data}

    @staticmethod
    def get_alert_info(info_id):
        # AlertInfo에서 priority_ids 조회
        info_data = db['S100_Portrayal_AlertInfo'].find_one({"_id": ObjectId(info_id)})

        if not info_data:
            return {"status": "error", "message": f"AlertInfo with id {info_id} not found"}

        info_data['_id'] = str(info_data['_id'])

        # priority_ids 처리
        priority_data = []
        for priority_id in info_data['priority_ids']:
            priority_item = AlertModel.get_alert_priority(priority_id)
            if isinstance(priority_item, dict) and "errors" in priority_item:
                return priority_item
            priority_data.append(priority_item)

        info_data['priority'] = priority_data
        del info_data['priority_ids']

        return info_data

    @staticmethod
    def get_alert_priority(priority_id):
        # AlertPriority에서 priority 조회
        priority_data = db['S100_Portrayal_AlertPriority'].find_one({"_id": ObjectId(priority_id)})

        if not priority_data:
            return {"status": "error", "message": f"AlertPriority with id {priority_id} not found"}

        priority_data['_id'] = str(priority_data['_id'])
        return priority_data
    @classmethod
    def get_one(cls, I_id):
        # MongoDB에서 _id로 해당 데이터를 찾음
        result = cls.collection.find_one({"_id": ObjectId(I_id)})

        if not result:
            return {"status": "error", "message": "Alert item not found"}

        # _id를 암호화된 문자열로 변환
        result['_id'] = get_encrypted_id([result['_id']])

        # description_ids 처리 로직
        if 'description_ids' in result:
            descriptions = [
                RegisterItemModel.get_national_language_string(desc_id)
                for desc_id in result['description_ids']
            ]
            # description에서 _id 제거
            for desc in descriptions:
                if '_id' in desc:
                    desc.pop('_id')
            result['description'] = descriptions
            del result['description_ids']

        # routeMonitor 처리
        if 'routeMonitor_ids' in result:
            routeMonitor_data = []
            for monitor_id in result['routeMonitor_ids']:
                monitor_data = cls.get_alert_info(monitor_id)
                if isinstance(monitor_data, dict) and "errors" in monitor_data:
                    return monitor_data
                # routeMonitor 내부의 priority에서 _id 제거
                for priority in monitor_data.get('priority', []):
                    if '_id' in priority:
                        priority.pop('_id')
                routeMonitor_data.append(monitor_data)
            result['routeMonitor'] = routeMonitor_data
            del result['routeMonitor_ids']

        # routePlan 처리
        if 'routePlan_ids' in result:
            routePlan_data = []
            for plan_id in result['routePlan_ids']:
                plan_data = cls.get_alert_info(plan_id)
                if isinstance(plan_data, dict) and "errors" in plan_data:
                    return plan_data
                # routePlan 내부의 priority에서 _id 제거
                for priority in plan_data.get('priority', []):
                    if '_id' in priority:
                        priority.pop('_id')
                routePlan_data.append(plan_data)
            result['routePlan'] = routePlan_data
            del result['routePlan_ids']
        if 'concept_id' in result:
            result['concept_id'] = str(result['concept_id'])
        
        return result
    
                
from regiSystem.serializers.PR import S100_PR_AlertMessageSerializer
class AlertMessageModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_AlertMessage']

    @classmethod
    def insert(cls, data, C_id):
        # 데이터 검증
        serializer = S100_PR_AlertMessageSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            # description 처리 (NationalLanguageString 데이터)
            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids  # 에러 반환
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            # text 처리 (NationalLanguageString 데이터)
            text_data = validated_data.get('text', [])
            text_ids = RegisterItemModel.process_description(text_data)  # 기존에 사용한 process_description을 재사용
            if isinstance(text_ids, dict) and "errors" in text_ids:
                return text_ids  # 에러 반환
            validated_data['text_ids'] = text_ids
            del validated_data['text']

            # concept_id 추가
            validated_data['concept_id'] = C_id

            # MongoDB에 데이터 삽입
            result = cls.collection.insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            # 데이터 검증 실패 시 에러 반환
            return {"status": "error", "errors": serializer.errors}

    @classmethod
    def get_list(cls, C_id):
        # MongoDB에서 해당 concept_id로 데이터를 조회
        result = cls.collection.find({"concept_id": ObjectId(C_id)})

        data = []
        for item in result:
            # _id를 암호화된 ID로 변환
            item['_id'] = get_encrypted_id([item['_id']])

            # description_ids를 description으로 복원
            if 'description_ids' in item:
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
                del item['description_ids']  # 복원 후 description_ids는 삭제

            # text_ids를 text로 복원
            if 'text_ids' in item:
                item['text'] = [
                    RegisterItemModel.get_national_language_string(text_id)
                    for text_id in item['text_ids']
                ]
                del item['text_ids']  # 복원 후 text_ids는 삭제

            data.append(item)

        return {"status": "success", "data": data}
    
    @classmethod
    def get_one(cls, I_id):
        # MongoDB에서 _id로 해당 데이터를 찾음
        result = cls.collection.find_one({"_id": ObjectId(I_id)})

        if not result:
            return {"status": "error", "message": "Item not found"}

        # _id 암호화 처리
        result['_id'] = get_encrypted_id([result['_id']])

        # description_ids를 description으로 복원하고 하위 _id 제거
        if 'description_ids' in result:
            result['description'] = [
                RegisterItemModel.get_national_language_string(desc_id)
                for desc_id in result['description_ids']
            ]
            del result['description_ids']
            # description 내부의 각 항목에서 '_id' 제거
            for desc in result['description']:
                desc.pop('_id', None)  # '_id' 키가 없을 경우를 대비하여 default 값을 None으로 설정

        # text_ids를 text로 복원하고 하위 _id 제거
        if 'text_ids' in result:
            result['text'] = [
                RegisterItemModel.get_national_language_string(text_id)
                for text_id in result['text_ids']
            ]
            del result['text_ids']
            # text 내부의 각 항목에서 '_id' 제거
            for text in result['text']:
                text.pop('_id', None)

        # concept_id를 문자열로 변환
        if 'concept_id' in result:
            result['concept_id'] = str(result['concept_id'])

        print(result)
        return result


class ColourPaletteModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_ColourPalette']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ColourPalletteSerializer)

    
from regiSystem.serializers.PR import S100_PR_DisplayModeSerializer
class DisplayModeModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_DisplayMode']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_DisplayModeSerializer)

from regiSystem.serializers.PR import S100_PR_ViewingGroupLayerSerializer
class ViewingGroupLayerModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_ViewingGroupLayer']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ViewingGroupLayerSerializer)

from regiSystem.serializers.PR import S100_PR_DisplayPlaneSerializer
class DisplayPlaneModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_DisplayPlane']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_DisplayPlaneSerializer)

from regiSystem.serializers.PR import S100_PR_ViewingGroupSerializer
class ViewingGroupModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_ViewingGroup']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ViewingGroupSerializer)

from regiSystem.serializers.PR import S100_PR_FontSerializer
class FontModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_Font']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_FontSerializer)

from regiSystem.serializers.PR import S100_PR_ContextParameterSerializer
class ContextParameterModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_ContextParameter']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_ContextParameterSerializer)

from regiSystem.serializers.PR import S100_PR_DrawingPrioritySerializer
class DrawingPriorityModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_DrawingPriority']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_DrawingPrioritySerializer)

from regiSystem.serializers.PR import S100_PR_AlertHighlightSerializer
class AlertHighlightModel(RE_RegisterItemModel):
    collection = db['S100_Portrayal_AlertHighlight']

    @classmethod
    def insert(cls, data, C_id):
        return super().insert(data, C_id, S100_PR_AlertHighlightSerializer)




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
    S100_PR_AlertSerializer, S100_OPEN_PR_AlertInfoSerializer,
    S100_PR_AlertMessageSerializer,
    S100_PR_CIEValueSerializer, S100_PR_SRGBValueSerializer,
    S100_PR_PaletteItemSerializer, 
    S100_OPEN_PR_AlertPrioritySerializer
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
            # validated_data['concept_id'] = C_id

            # 업데이트 실행
            cls.collection[0].update_one({"_id": ObjectId(item_id)}, {"$set": validated_data})
            return {"status": "success", "updated_id": str(item_id)}
        else:
            return {"status": "error", "errors": serializer.errors}

    @classmethod
    def get_exixting_by_id(cls, I_id):
        if cls.collection is None:
            raise NotImplementedError("This model does not have a collection assigned.")
        return cls.collection[0].find_one({"_id": ObjectId(I_id)})
    
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

class PR_AlertPriority(PR_RegisterItem):
    @staticmethod
    def process_priority(priority_data):
        priority_serializer = S100_OPEN_PR_AlertPrioritySerializer(data=priority_data)
        if priority_serializer.is_valid():
            result = S100_Portrayal_AlertPriority.insert_one(priority_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": priority_serializer.errors}

class PR_AlertInfo(PR_RegisterItem):
    @staticmethod
    def process_info(info_data):
        info_serializer = S100_OPEN_PR_AlertInfoSerializer(data=info_data)
        if info_serializer.is_valid():
            priority_data = info_serializer.validated_data.get('priority', [])
            priority_ids = []
            for priority in priority_data:
                priority_result = PR_AlertPriority.process_priority(priority)
                if isinstance(priority_result, dict) and "errors" in priority_result:
                    return priority_result
                priority_ids.append(priority_result)
            info_serializer.validated_data['priority_ids'] = priority_ids
            del info_serializer.validated_data['priority']
            result = S100_Portrayal_AlertInfo.insert_one(info_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": info_serializer.errors}

class PR_Alert(PR_RegisterItem):
    collection = [S100_Portrayal_Alert]

    @staticmethod
    def get_alert_priority(priority_id):
        # AlertPriority에서 priority 조회
        priority_data = S100_Portrayal_AlertPriority.find_one({"_id": ObjectId(priority_id)})

        if not priority_data:
            return {"status": "error", "message": f"AlertPriority with id {priority_id} not found"}

        priority_data['_id'] = str(priority_data['_id'])
        return priority_data
        
    @staticmethod
    def get_alert_info(info_id):
        # AlertInfo에서 priority_ids 조회
        info_data = S100_Portrayal_AlertInfo.find_one({"_id": ObjectId(info_id)})

        if not info_data:
            return {"status": "error", "message": f"AlertInfo with id {info_id} not found"}

        info_data['_id'] = str(info_data['_id'])

        # priority_ids 처리
        priority_data = []
        for priority_id in info_data['priority_ids']:
            priority_item = PR_Alert.get_alert_priority(priority_id)
            if isinstance(priority_item, dict) and "errors" in priority_item:
                return priority_item
            priority_data.append(priority_item)

        info_data['priority'] = priority_data
        del info_data['priority_ids']

        return info_data

    
    @classmethod
    def get_item_detail(cls, I_id):
        # MongoDB에서 _id로 해당 데이터를 찾음
        result = cls.collection[0].find_one({"_id": ObjectId(I_id)})
        print(result, "이거는 되니?")

        if not result:
            return {"status": "error", "message": "Alert item not found"}

        # _id를 암호화된 문자열로 변환
        result['_id'] = str(result['_id'])

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
    
    @classmethod
    def get_list_by_id(cls, C_id):
        """
        해당 concept_id에 해당하는 모든 Alert의 리스트를 반환합니다.
        """
        data = []
        result = cls.collection[0].find({"concept_id": ObjectId(C_id)})
        
        for item in result:
            # _id 문자열로 변환
            item['_id'] = str(item['_id'])

            # description_ids 처리 (description으로 변환 후 _id 제거)
            if 'description_ids' in item:
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
                del item['description_ids']
                for desc in item['description']:
                    desc.pop('_id', None)  # '_id' 키 제거

            # routeMonitor_ids 처리 
            if 'routeMonitor_ids' in item:
                item['routeMonitor'] = []
                for monitor_id in item['routeMonitor_ids']:
                    monitor_data = cls.get_alert_info(monitor_id)
                    if isinstance(monitor_data, dict) and "errors" in monitor_data:
                        return monitor_data
                    # routeMonitor 내부의 priority에서 _id 제거
                    for priority in monitor_data.get('priority', []):
                        if '_id' in priority:
                            priority.pop('_id')
                    item['routeMonitor'].append(monitor_data)
                del item['routeMonitor_ids']

            # routePlan_ids 처리
            if 'routePlan_ids' in item:
                item['routePlan'] = []
                for plan_id in item['routePlan_ids']:
                    plan_data = cls.get_alert_info(plan_id)
                    if isinstance(plan_data, dict) and "errors" in plan_data:
                        return plan_data
                    # routePlan 내부의 priority에서 _id 제거
                    for priority in plan_data.get('priority', []):
                        if '_id' in priority:
                            priority.pop('_id')
                    item['routePlan'].append(plan_data)
                del item['routePlan_ids']

            # concept_id 문자열로 변환
            if 'concept_id' in item:
                item['concept_id'] = str(item['concept_id'])

            # 처리된 항목을 리스트에 추가
            data.append(item)
        return data

    @classmethod
    def insert(cls, data, C_id):
        serializer = S100_PR_AlertSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            routeMonitor_data = validated_data.get('routeMonitor', [])
            routeMonitor_ids = []
            for monitor in routeMonitor_data:
                monitor_id = PR_AlertInfo.process_info(monitor)
                if isinstance(monitor_id, dict) and "errors" in monitor_id:
                    return monitor_id
                routeMonitor_ids.append(monitor_id)
            validated_data['routeMonitor_ids'] = routeMonitor_ids
            del validated_data['routeMonitor']

            routePlan_data = validated_data.get('routePlan', [])
            routePlan_ids = []
            for plan in routePlan_data:
                plan_id = PR_AlertInfo.process_info(plan)
                if isinstance(plan_id, dict) and "errors" in plan_id:
                    return plan_id
                routePlan_ids.append(plan_id)
            validated_data['routePlan_ids'] = routePlan_ids
            del validated_data['routePlan']

            validated_data['concept_id'] = C_id
            result = cls.collection[0].insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def update(cls, data, C_id, serializer_class, I_id):
        # 기존 데이터를 찾기
        existing_item = cls.collection[0].find_one({"_id": ObjectId(I_id)})
        if not existing_item:
            return {"status": "error", "message": "Item not found"}

        # 데이터 유효성 검사를 위한 serializer
        serializer = serializer_class(data=data, partial=True)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            # description 처리
            if 'description' in validated_data:
                description_data = validated_data.get('description', [])
                description_ids = RegisterItemModel.process_description(description_data)
                if isinstance(description_ids, dict) and "errors" in description_ids:
                    return description_ids
                validated_data['description_ids'] = description_ids
                del validated_data['description']

            # routeMonitor 처리
            if 'routeMonitor' in validated_data:
                routeMonitor_data = validated_data.get('routeMonitor', [])
                routeMonitor_ids = []
                for monitor in routeMonitor_data:
                    monitor_id = PR_AlertInfo.process_info(monitor)
                    if isinstance(monitor_id, dict) and "errors" in monitor_id:
                        return monitor_id
                    routeMonitor_ids.append(monitor_id)
                validated_data['routeMonitor_ids'] = routeMonitor_ids
                del validated_data['routeMonitor']

            # routePlan 처리
            if 'routePlan' in validated_data:
                routePlan_data = validated_data.get('routePlan', [])
                routePlan_ids = []
                for plan in routePlan_data:
                    plan_id = PR_AlertInfo.process_info(plan)
                    if isinstance(plan_id, dict) and "errors" in plan_id:
                        return plan_id
                    routePlan_ids.append(plan_id)
                validated_data['routePlan_ids'] = routePlan_ids
                del validated_data['routePlan']

            # concept_id는 그대로 유지
            if 'concept_id' not in validated_data:
                validated_data['concept_id'] = str(existing_item.get('concept_id'))

            # _id 필드는 변경되지 않음
            validated_data['_id'] = ObjectId(I_id)

            # 업데이트 실행
            cls.collection[0].update_one({"_id": ObjectId(I_id)}, {"$set": validated_data})
            
            # ObjectId를 문자열로 변환 후 반환
            return {"status": "success", "updated_id": str(I_id)}

class PR_AlertMessage(PR_RegisterItem):
    collection = [S100_Portrayal_AlertMessage]

    @classmethod
    def get_item_detail(cls, I_id):
        # MongoDB에서 _id로 해당 데이터를 찾음
        result = cls.collection[0].find_one({"_id": ObjectId(I_id)})

        if not result:
            return {"status": "error", "message": "Item not found"}

        # _id 암호화 처리
        result['_id'] = str(result['_id'])

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

        return result
    
    @classmethod
    def get_list_by_id(cls, C_id):
        """
        해당 concept_id에 해당하는 모든 AlertMessage의 리스트를 반환합니다.
        """
        data = []
        result = cls.collection[0].find({"concept_id": ObjectId(C_id)})
        
        for item in result:
            # _id 문자열로 변환
            item['_id'] = str(item['_id'])

            # description_ids 처리 (description으로 변환 후 _id 제거)
            if 'description_ids' in item:
                item['description'] = [
                    RegisterItemModel.get_national_language_string(desc_id)
                    for desc_id in item['description_ids']
                ]
                del item['description_ids']
                for desc in item['description']:
                    desc.pop('_id', None)  # '_id' 키 제거

            # text_ids 처리 (text로 변환 후 _id 제거)
            if 'text_ids' in item:
                item['text'] = [
                    RegisterItemModel.get_national_language_string(text_id)
                    for text_id in item['text_ids']
                ]
                del item['text_ids']
                for text in item['text']:
                    text.pop('_id', None)  # '_id' 키 제거

            # concept_id 문자열로 변환
            if 'concept_id' in item:
                item['concept_id'] = str(item['concept_id'])

            # 처리된 항목을 리스트에 추가
            data.append(item)

        return data

    @classmethod
    def insert(cls, data, C_id):
        serializer = S100_PR_AlertMessageSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            description_data = validated_data.get('description', [])
            description_ids = RegisterItemModel.process_description(description_data)
            if isinstance(description_ids, dict) and "errors" in description_ids:
                return description_ids
            validated_data['description_ids'] = description_ids
            del validated_data['description']

            text_data = validated_data.get('text', [])
            text_ids = RegisterItemModel.process_description(text_data)
            if isinstance(text_ids, dict) and "errors" in text_ids:
                return text_ids
            validated_data['text_ids'] = text_ids
            del validated_data['text']

            validated_data['concept_id'] = C_id
            result = cls.collection[0].insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def update(cls, data, C_id, serializer_class, I_id):
        # 기존 데이터를 찾기
        existing_item = cls.collection[0].find_one({"_id": ObjectId(I_id)})
        if not existing_item:
            return {"status": "error", "message": "Item not found"}

        # 데이터 유효성 검사를 위한 serializer
        serializer = serializer_class(data=data, partial=True)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            # description 처리
            if 'description' in validated_data:
                description_data = validated_data.get('description', [])
                description_ids = RegisterItemModel.process_description(description_data)
                if isinstance(description_ids, dict) and "errors" in description_ids:
                    return description_ids
                validated_data['description_ids'] = description_ids
                del validated_data['description']

            # text 처리
            if 'text' in validated_data:
                text_data = validated_data.get('text', [])
                text_ids = RegisterItemModel.process_description(text_data)
                if isinstance(text_ids, dict) and "errors" in text_ids:
                    return text_ids
                validated_data['text_ids'] = text_ids
                del validated_data['text']

            # concept_id는 그대로 유지
            if 'concept_id' not in validated_data:
                validated_data['concept_id'] = str(existing_item.get('concept_id'))

            # _id 필드는 변경되지 않음
            validated_data['_id'] = ObjectId(I_id)

            # 업데이트 실행
            cls.collection[0].update_one({"_id": ObjectId(I_id)}, {"$set": validated_data})
            
            # ObjectId를 문자열로 변환 후 반환
            return {"status": "success", "updated_id": str(I_id)}
        else:
            return {"status": "error", "errors": serializer.errors}

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
    collection = [S100_Portrayal_PaletteItem]

    @classmethod 
    def get_item_detail(cls, I_id):
        result = super().get_item_detail(I_id)
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
    
    @classmethod
    def get_list_by_id(cls, C_id):
        """
        해당 concept_id에 해당하는 모든 PaletteItems 리스트를 반환합니다.
        """
        data = []
        result = cls.collection[0].find({"concept_id": ObjectId(C_id)})
        
        for item in result:
            # 기본 description 처리 (상위 클래스의 처리 방식 재사용)
            if 'description_ids' in item:
                item['description'] = [
                    PR_RegisterItem.get_national_language_string(str(nls_id)) 
                    for nls_id in item['description_ids']
                ]
                del item['description_ids']
            
            # colourValue 처리 로직 추가
            if 'colourValue' in item:
                if 'sRGB_id' in item['colourValue']:
                    item['colourValue']['sRGB'] = S100_Portrayal_SRGBValue.find_one({"_id": ObjectId(item['colourValue']['sRGB_id'])})
                    if '_id' in item['colourValue']['sRGB']:
                        item['colourValue']['sRGB'].pop('_id')
                    del item['colourValue']['sRGB_id']

                if 'cie_id' in item['colourValue']:
                    item['colourValue']['cie'] = S100_Portrayal_CIEValue.find_one({"_id": ObjectId(item['colourValue']['cie_id'])})
                    if '_id' in item['colourValue']['cie']:
                        item['colourValue']['cie'].pop('_id')
                    del item['colourValue']['cie_id']
            
            # _id 및 concept_id 처리
            item['_id'] = str(item['_id'])
            if 'concept_id' in item:
                item['concept_id'] = str(item['concept_id'])
            
            # 결과를 리스트에 추가
            data.append(item)
        
        return data
    
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
            result = cls.collection[0].insert_one(validated_data)
            return {"status": "success", "inserted_id": str(result.inserted_id)}
        else:
            return {"status": "error", "errors": serializer.errors}
    
    @classmethod
    def update(cls, data, C_id, serializer_class, I_id):
        # 기존 데이터를 찾기
        existing_item = cls.collection[0].find_one({"_id": ObjectId(I_id)})
        if not existing_item:
            return {"status": "error", "message": "Item not found"}

        # 데이터 유효성 검사를 위한 serializer
        serializer = serializer_class(data=data, partial=True)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            # description 처리
            if 'description' in validated_data:
                description_data = validated_data.get('description', [])
                description_ids = RegisterItemModel.process_description(description_data)
                if isinstance(description_ids, dict) and "errors" in description_ids:
                    return description_ids
                validated_data['description_ids'] = description_ids
                del validated_data['description']

            # colourValue 처리
            if 'colourValue' in validated_data:
                if 'sRGB' in validated_data['colourValue']:
                    srgb_result = SRGBModel.process_srgb(validated_data['colourValue']['sRGB'])
                    if isinstance(srgb_result, dict) and "errors" in srgb_result:
                        return srgb_result
                    validated_data['colourValue']['sRGB_id'] = ObjectId(srgb_result)  # ObjectId를 문자열로 변환

                if 'cie' in validated_data['colourValue']:
                    cie_result = CIEModel.process_cie(validated_data['colourValue']['cie'])
                    if isinstance(cie_result, dict) and "errors" in cie_result:
                        return cie_result
                    validated_data['colourValue']['cie_id'] = ObjectId(cie_result)  # ObjectId를 문자열로 변환

            # concept_id는 그대로 유지
            if 'concept_id' not in validated_data:
                validated_data['concept_id'] = str(existing_item.get('concept_id'))

            # _id 필드는 변경되지 않음
            validated_data['_id'] = ObjectId(I_id)

            # 업데이트 실행
            cls.collection[0].update_one({"_id": ObjectId(I_id)}, {"$set": validated_data})
            
            # ObjectId를 문자열로 변환 후 반환
            return {"status": "success", "updated_id": str(I_id)}
        else:
            return {"status": "error", "errors": serializer.errors}

class CIEModel:
    @staticmethod
    def process_cie(cie_data):
        cie_serializer = S100_PR_CIEValueSerializer(data=cie_data)
        if cie_serializer.is_valid():
            result = S100_Portrayal_CIEValue.insert_one(cie_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": cie_serializer.errors}

class SRGBModel:
    @staticmethod
    def process_srgb(srgb_data):
        srgb_serializer = S100_PR_SRGBValueSerializer(data=srgb_data)
        if srgb_serializer.is_valid():
            result = S100_Portrayal_SRGBValue.insert_one(srgb_serializer.validated_data)
            return str(result.inserted_id)
        else:
            return {"status": "error", "errors": srgb_serializer.errors}

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



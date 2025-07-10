from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.utils import check_key_validation
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import requests

service_key = openapi.Parameter('service_key', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
item_id =openapi.Parameter('item_id', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)
item_type = openapi.Parameter('item_type', openapi.IN_QUERY, description='item type', required=True, type=openapi.TYPE_STRING)

from ihoDataIntegrationSystem.models import (
    IHO_Item, IHO_ManagementInfo, IHO_Reference, IHO_ReferenceSource,
)

from openApiSystem.models.concept import (Concept, ManagementInfo, Reference, ReferenceSource)
from regiSystem.models.Concept import ListedValue, AttributeUsage

def get_item(number):
    params = {
        "serviceKey": "bluemapServiceKey",
        "type": number,
        "numOfRows" :5000,
        "startNumOfRows": 0
    }
    try:
        response = requests.get(EXTERNAL_API_URL, params=params)
        response.raise_for_status()  # HTTP 에러 발생 시 예외 발생
        data = response.json()  # JSON 응답을 파싱

        # 받아온 데이터 print
        return data
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}
    
EXTERNAL_API_URL = "https://registry.iho.int/api/dataDictionary.json"
from pprint import pprint
from regiSystem.serializers.RE import (
    ConceptItemSerializer,
    ConceptManagementInfoSerializer,
    ConceptReferenceSerializer,
    ConceptReferenceSourceSerializer,
    ConceptSerializer,

    )

# class DeleteFromIhoCollection:
#     @classmethod
#     def clear_collection(cls, target_class, C_id):
#         result = target_class.collection.delete_many({"isIHO": "yes", "concept_id" : C_id})
#         return {"status": "success", "message": f"{result.deleted_count}개 삭제 완료 from {target_class.collection.name}"}


class DeleteFromIhoCollection:
    @classmethod
    def clear_collection(cls, target_class, C_id):
        if target_class.__name__ == "Concept":
            # Concept은 isIHO + concept_id 조건
            result = target_class.collection.delete_many({
                "isIHO": "yes",
                "concept_id": C_id
            })
            return {
                "status": "success",
                "message": f"{result.deleted_count}개 삭제 완료 from {target_class.collection.name}",
                "deleted_concept_ids": []  # Concept에서는 별로 쓸 일은 없음
            }

        else:
            raise NotImplementedError("Concept 외 모델은 별도 처리 필요")

    @classmethod
    def clear_with_concept_ids(cls, target_class, concept_ids):
        if target_class.__name__ in ["ManagementInfo", "Reference", "ReferenceSource"]:
            # concept_item_id가 concept_ids 중 하나인 것 삭제
            result = target_class.collection.delete_many({
                "concept_item_id": {"$in": concept_ids}
            })
            return {
                "status": "success",
                "message": f"{result.deleted_count}개 삭제 완료 from {target_class.collection.name}"
            }

        elif target_class.__name__ in ["ListedValue", "AttributeUsage"]:
            # parent_id 또는 child_id가 concept_ids 중 하나인 것 삭제
            result = target_class.collection.delete_many({
                "$or": [
                    {"parent_id": {"$in": concept_ids}},
                    {"child_id": {"$in": concept_ids}}
                ]
            })
            return {
                "status": "success",
                "message": f"{result.deleted_count}개 삭제 완료 from {target_class.collection.name}"
            }

        else:
            raise NotImplementedError(f"{target_class.__name__} 모델은 지원되지 않습니다.")

def delete_iho_by_concept_id(C_id):
    """
    C_id를 기준으로 IHO 데이터를 삭제하는 공용 유틸 함수
    """

    # Concept id 리스트 뽑기
    concept_docs = Concept.collection.find({
        "isIHO": "yes",
        "concept_id": C_id
    })
    concept_ids = [doc["_id"] for doc in concept_docs]

    print("Concept IDs:", concept_ids)

    # Concept 먼저 삭제
    concept_delete_result = DeleteFromIhoCollection.clear_collection(Concept, C_id)

    # 관련된 ManagementInfo, Reference, ReferenceSource 삭제
    management_info_result = DeleteFromIhoCollection.clear_with_concept_ids(ManagementInfo, concept_ids)
    reference_result = DeleteFromIhoCollection.clear_with_concept_ids(Reference, concept_ids)
    reference_source_result = DeleteFromIhoCollection.clear_with_concept_ids(ReferenceSource, concept_ids)

    # ListedValue 삭제
    listed_value_result = DeleteFromIhoCollection.clear_with_concept_ids(ListedValue, concept_ids)
    attribute_usage_result = DeleteFromIhoCollection.clear_with_concept_ids(AttributeUsage, concept_ids)

    return {
        "concept_delete_result": concept_delete_result,
        "management_info_result": management_info_result,
        "reference_result": reference_result,
        "reference_source_result": reference_source_result,
        "listed_value_result": listed_value_result,
        "attribute_usage_result": attribute_usage_result
    }

regi_uri = openapi.Parameter('regi_uri', openapi.IN_QUERY, description='iho 데이터를 삭제할 레지스트리의 URI 입력', required=True, type=openapi.TYPE_STRING, default='test')
from regiSystem.serializers.CD import (EnumeratedValueSerializer, SimpleAttributeSerializer, ComplexAttributeSerializer, FeatureSerializer, InformationSerializer)
from openApiSystem.models.registry.item import RE_Register
@swagger_auto_schema(method='delete', manual_parameters=[regi_uri, service_key])
@api_view(['DELETE'])
def delete_iho_data(request):
    """
    동기화했던 iho 데이터를 삭제합니다.
    """
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')

    # 서비스 키 검증
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response

    C_id = RE_Register.get_register_by_url(regi_uri)

    # ✅ 유틸 함수 호출
    delete_results = delete_iho_by_concept_id(C_id)

    return Response({
        "status": "success",
        "results": delete_results
    })

regi_uri = openapi.Parameter('regi_uri', openapi.IN_QUERY, description='iho 데이터를 넣을 레지스트리의 URI 입력', required=True, type=openapi.TYPE_STRING, default='test')
from regiSystem.serializers.CD import (EnumeratedValueSerializer, SimpleAttributeSerializer, ComplexAttributeSerializer, FeatureSerializer, InformationSerializer)
from openApiSystem.models.registry.item import RE_Register
@swagger_auto_schema(method='post', manual_parameters=[regi_uri, service_key])
@api_view(['POST'])
def sync_iho_data(request):
    """
    IHO Registry에서 필요한 항목만 동기화합니다.
    - 1, 2, 3, 5, 6번 항목 처리
    - 3번(type=3)은 4번 데이터를 포함함 (4번은 API 호출/저장 모두 생략)
    - 6번(type=6)은 API 호출은 하지만 별도 컬렉션 없이 5번 컬렉션에 함께 저장됨
    """
    write_listed_values = {}  # ✅ Step 1: 최상단에 초기화
    regi_uri = request.GET.get('regi_uri')
    C_id = RE_Register.get_register_by_url(regi_uri)
    service_key = request.GET.get('service_key')

    # 서비스 키 검증
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response

    # ✅ Step 2: 기존 IHO 데이터 삭제
    delete_result = delete_iho_by_concept_id(C_id)
    print("기존 IHO 데이터 삭제 결과:", delete_result)

    # 1, 2, 3, 5, 6번 항목 순회
    item_types = {
        1: "FeatureType",
        2: "InformationType",
        3: "SimpleAttribute",
        5: "EnumeratedValue",
        6: "EnumeratedValue",
    }
    serializer_map = {
        "FeatureType": FeatureSerializer,
        "InformationType": InformationSerializer,
        "SimpleAttribute": SimpleAttributeSerializer,
        "ComplexAttribute": ComplexAttributeSerializer,
        "EnumeratedValue": EnumeratedValueSerializer,
    }


    for item_type in item_types:
        # type_name = item_types[item_type][0]
        print()
        print("⭐⭐⭐⭐⭐")
        print(f"[INFO] Type {item_type} 데이터 동기화 시작")
        result = get_item(item_type)

        if result.get("status") == "error":
            print(f"[ERROR] Type {item_type} - {result['message']}")
            continue

        items = result.get("data", [])
        for idx, item in enumerate(items):
            # ✅ Step 2: SimpleAttribute 처리
            if item_type == 3:  # SimpleAttribute
                simple_idx = item.get("idx")
                if simple_idx is not None:
                    simple_idx = str(simple_idx)
                    if simple_idx not in write_listed_values:
                        write_listed_values[simple_idx] = []

            # ✅ Step 3: EnumeratedValue 처리
            if item_type in [5, 6]:
                combination_fk = item.get("combination_FK")
                enum_idx = item.get("idx")
                if combination_fk is not None and enum_idx is not None:
                    combination_fk = str(combination_fk)
                    if combination_fk not in write_listed_values:
                        write_listed_values[combination_fk] = []
                    write_listed_values[combination_fk].append(enum_idx)

            res_item = arrange_concept_common(item, {}, C_id)
            res_item = arrange_by_type(item_type, item, res_item)

            item_type_for_serializer = res_item.get("itemType")
            SpecificSerializer = serializer_map.get(item_type_for_serializer)

            if SpecificSerializer is None:
                print(f"[Type {item_type}] ❌ 해당 itemType에 대한 시리얼라이저가 없습니다: {item_type_for_serializer}")
                continue

            serializer = SpecificSerializer(data=res_item)
            if serializer.is_valid():
                # 유효성 검사는 serializer로만!
                # validated_data = serializer.validated_data  
                inserted_id = Concept.insert(C_id, res_item)["inserted_id"]  

                res_management = arrange_managementInfo(item, inserted_id)
                man_serializer = ConceptManagementInfoSerializer(data=res_management)
                if man_serializer.is_valid():
                    ManagementInfo.insert(inserted_id, res_management)
                else:
                    print(f"[Type {item_type}][Item {idx}] ❌ 관리 정보 유효하지 않음")

                res_refrence = arrange_reference(item, inserted_id)
                ref_serializer = ConceptReferenceSerializer(data=res_refrence)
                if ref_serializer.is_valid():
                    Reference.insert(inserted_id, res_refrence)
                else:
                    print(f"[Type {item_type}][Item {idx}] ❌ 참조 정보 유효하지 않음")

                res_refrenceSource = arrange_referenceSource(item, inserted_id)
                refS_serializer = ConceptReferenceSourceSerializer(data=res_refrenceSource)
                if refS_serializer.is_valid():
                    ReferenceSource.insert(inserted_id, res_refrenceSource)
                else:
                    print(f"[Type {item_type}][Item {idx}] ❌ 참조 소스 정보 유효하지 않음")
                
                print(f"[Type {item_type}][Item {idx}] ✅ 저장 완료")
            else:
                # pprint(res_item)
                print(f"[Type {item_type}][Item {idx}] ❌ 유효하지 않음")
                print("  - 오류 목록:", serializer.errors)

            print("----------------------------")

    # ✅ Step 4: 전체 루프 끝나고 딕셔너리 출력# ✅ 가장 긴 리스트 가진 항목 찾기
    max_key = None
    max_length = 0

    for key, value_list in write_listed_values.items():
        if len(value_list) > max_length:
            max_key = key
            max_length = len(value_list)

    print(f"📌 가장 많은 값이 연결된 키: {max_key}")
    print(f"👉 연결된 ID 개수: {max_length}")
    print(f"👉 연결된 ID 목록: {write_listed_values}")

    # ✅ Step 5: 연결 정보 저장 함수 호출
    insert_listed_values(write_listed_values, C_id)

    return Response({"status": "success", "message": "데이터 유효성 검증 완료"})

class ihoListedValue(ListedValue):
    @classmethod
    def insert_listed_value(cls, parent_id, child_id, C_id):
        cls.collection.insert_one({
            "parent_id": ObjectId(parent_id),
            "child_id": ObjectId(child_id),
            # "concept_id": C_id,
        })
    
def insert_listed_values(write_listed_values, C_id):
    for parent_identifier, child_identifiers in write_listed_values.items():
        if not child_identifiers:
            continue

        try:
            parent_doc = Concept.collection.find_one({
                "itemIdentifier": int(parent_identifier),
                "isIHO": "yes"
            })
        except ValueError:
            print(f"❌ invalid parent_identifier: {parent_identifier}")
            continue

        if not parent_doc:
            print(f"⚠️ parent item not found: {parent_identifier}")
            continue

        parent_id = parent_doc["_id"]

        for child_identifier in child_identifiers:
            try:
                child_doc = Concept.collection.find_one({
                    # "itemType" : "SimpleAttribute",
                    "itemIdentifier": int(child_identifier),
                    "isIHO": "yes"
                })
            except ValueError:
                print(f"❌ invalid child_identifier: {child_identifier}")
                continue

            if not child_doc:
                print(f"⚠️ child item not found: {child_identifier}")
                continue

            child_id = child_doc["_id"]
            ihoListedValue.insert_listed_value(parent_id, child_id, C_id)
            print(f"✅ 연결 완료: {parent_identifier} → {child_identifier}")

def arrange_by_type(item_type, input_data, base_form):
    """
    모든 데이터에 대해 IHO Registry로부터 데이터를 가져와
    해당 컬렉션을 초기화한 뒤 데이터를 저장하는 동기화 함수.
    """
    type_name_map = {
        1: "FeatureType",
        2: "InformationType",
        3: "SimpleAttribute",
        5: "EnumeratedValue",
        6: "EnumeratedValue",
    }

    arrange_form = {
        "itemType": type_name_map.get(item_type, ""),
    }

    # 분기 처리
    if item_type == 1:  # FeatureType
        arrange_form["featureUseType"] = input_data.get("useTypeName", "")

    elif item_type == 2:  # InformationType
        pass  # 현재는 추가 필드 없음

    elif item_type == 3:  # SimpleAttribute
        attr_type = input_data.get("attributeTypeName", "")
        if attr_type == "complex":
            arrange_form["itemType"] = "ComplexAttribute"
        else:
            arrange_form["valueType"] = attr_type
        arrange_form["quantitySpecification"] = input_data.get("quantity_SPEC", "otherQuantity")

    elif item_type == 5 or item_type == 6:  # EnumeratedValue
        value_type_map = {
            0: "enumeration",
            1: "S100_CodeList",
        }
        arrange_form["enumType"] = value_type_map.get(input_data.get("value_type"), "")
        arrange_form["numericCode"] = input_data.get("idx", "")

    base_form.update(arrange_form)
    return base_form

def arrange_managementInfo(input_data, inserted_id):
    arrange_form = {
        "concept_item_id":ObjectId(inserted_id),
        "proposalType":"",
        "submittingOrganisation":"",
        "proposedChange":"",
        "dateAccepted":"",
        "dateProposed":"",
        "dateAmended":"",
        "proposalStatus":"accepted",
        "controlBodyNotes":"",
        
    }
    ppType = {
        1: "addition",
        2: "clarification",
        3: "supersession",
        4: "retirement",
    }
    for att, data in input_data.items():
        if att == "dateAccepted":
            arrange_form["dateAccepted"] = data
        elif att == "dateProposed":
            arrange_form["dateProposed"] = data
            arrange_form["dateAmended"] = data
        elif att == "proposedChange":
            arrange_form["proposedChange"] = data
        elif att == "organization":
            arrange_form["submittingOrganisation"] = data
        elif att == "justification":
            arrange_form["justification"] = data
        elif att == "proposalType":
            arrange_form["proposalType"] = ppType[data]
        
    return arrange_form

def arrange_referenceSource(input_data, inserted_id):
    arrange_form = {
        "concept_item_id":ObjectId(inserted_id),
        "referenceIdentifier":"",
        "sourceDocument":"",
        "similarity":"",
    }
    for att, data in input_data.items():
        if att == "referenceItem_FK":
            arrange_form["referenceIdentifier"] = data
        elif att == "referenceSource":
            arrange_form["sourceDocument"] = data
        elif att == "similarityToSource":
            arrange_form["similarity"] = data

    return arrange_form

def arrange_reference(input_data, inserted_id):
    arrange_form = {
        "concept_item_id":ObjectId(inserted_id),
        "referenceIdentifier":"",
        "sourceDocument":"",
    }
    for att, data in input_data.items():
        if att == "referenceItem_FK":
            arrange_form["referenceIdentifier"] = data
        elif att == "referenceSource":
            arrange_form["sourceDocument"] = data

    return arrange_form

def arrange_concept_common(input_data, base_form, inserted_id): ## all
    arrange_form = {
        "itemIdentifier":"",
        "name":"",
        "definition":"",
        "remarks":"",
        "itemStatus":"valid",
        "alias":"",
        "camelCase":"",
        "definitionSource":"",
        "reference":"",
        "similarityToSource":"",
        "justification":"",
        "proposedChange":"",
        "concept_id": "---", ### Re 시리얼라이저랑 맞추기 위함
        "isIHO" : "yes"
    }
    for att, data in input_data.items():
        if att == "idx":
            arrange_form["itemIdentifier"] = data
        elif att == "name":
            arrange_form["name"] = data
        elif att == "definition":
            arrange_form["definition"] = data
        elif att == "camelCase":
            arrange_form["camelCase"] = data
        elif att == "referenceSource":
            arrange_form["reference"] = data
        elif att == "similarityToSource":
            arrange_form["similarityToSource"] = data
        elif att == "justification":
            arrange_form["justification"] = data
        elif att == "proposedChange":
            arrange_form["proposedChange"] = data     
    base_form.update(arrange_form)
    return base_form



### 아래로는 아직 안쓰는 메서드임임
@swagger_auto_schema(method='post', manual_parameters=[regi_uri, service_key, item_type])
@api_view(['POST'])
def sync_iho_data_one(request):
    """
    특정 item_type 하나에 대해 IHO Registry로부터 데이터를 가져온 뒤,
    데이터가 존재하는지 확인하고 개수만 반환하는 테스트용 함수.
    (※ 로컬 컬렉션에 저장하거나 초기화하는 동작은 포함되지 않음)
    - 1: FeatureType
    - 2: InformationType
    - 3: Attribute
    - 4: ComplexAttribute 
    - 5: EnumeratedValue
    - 6: CodeList
    """
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    item_type = request.GET.get('item_type')

    # 인증 키 검증
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    try:
        # Step 2: API 호출
        data = get_item(item_type)
        if data.get('data') is None:
            return Response({"status": "error", "message": "No data found"}, status=404)
        return Response(
            {"sync_result": {
                item_type: {
                    "count": len (data['data']),
                    "status": "success",
                    # "message": data['data']
                }
            }}, status=200)

    except requests.exceptions.RequestException as e:
        return Response({
            "sync_result": {
                item_type: {
                    "status": "error",
                    "message": str(e)
                }
            }
        }, status=500)

def serialize_mongo_document(doc):
    """
    지금은 안쓰임
    나중에 데이터를 컬렉션에서 가져올때 _id (ObjectId)를 문자열로 변환하기 위해 사용되는 함수
    """
    if isinstance(doc, ObjectId):
        return str(doc)  # ObjectId를 문자열로 변환
    elif isinstance(doc, list):
        return [serialize_mongo_document(d) for d in doc]  # 리스트일 경우 내부 요소 변환
    elif isinstance(doc, dict):
        return {key: serialize_mongo_document(value) for key, value in doc.items()}  # 딕셔너리 처리
    return doc


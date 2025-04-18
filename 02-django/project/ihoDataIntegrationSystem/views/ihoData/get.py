from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.utils import check_key_validation
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.status import (
        HTTP_400_BAD_REQUEST, 
        HTTP_404_NOT_FOUND,
        HTTP_405_METHOD_NOT_ALLOWED,
        HTTP_401_UNAUTHORIZED,
        HTTP_200_OK,
        HTTP_500_INTERNAL_SERVER_ERROR
    )

from regiSystem.serializers.RE import (
    ConceptSerializer,
    ConceptItemSerializer,
    ConceptReferenceSerializer,
    ConceptReferenceSourceSerializer,
    ConceptManagementInfoSerializer, 
)
from mongo_driver import db

IHO_ItemDB = db['IHO_Item']
IHO_ManagementInfo = db['IHO_ManagementInfo']
IHO_Reference = db['IHO_Reference']
IHO_ReferenceSource = db['IHO_ReferenceSource']

regi_uri = openapi.Parameter('regi_uri', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default="iho")
search_term = openapi.Parameter('search_term', openapi.IN_QUERY, description='검색어', required=False, type=openapi.TYPE_STRING)
status = openapi.Parameter('status', openapi.IN_QUERY, description='item 상태 (valid 등)', required=False, type=openapi.TYPE_STRING)
category = openapi.Parameter('category', openapi.IN_QUERY, description='검색 대상 필드 (name, camelCase, definition)', required=False, type=openapi.TYPE_STRING)
enum_type = openapi.Parameter('enum_type', openapi.IN_QUERY, description='열거형 필터', required=False, type=openapi.TYPE_STRING)
value_type = openapi.Parameter('value_type', openapi.IN_QUERY, description='속성 필터 (integer 등)', required=False, type=openapi.TYPE_STRING)
sort_key = openapi.Parameter('sort_key', openapi.IN_QUERY, description='정렬 기준 필드명', required=False, type=openapi.TYPE_STRING, default='_id')
sort_direction = openapi.Parameter('sort_direction', openapi.IN_QUERY, description='정렬 방향 (ascending / descending)', required=False, type=openapi.TYPE_STRING, default='ascending')
page = openapi.Parameter('page', openapi.IN_QUERY, description='페이지 번호', required=False, type=openapi.TYPE_INTEGER, default=1)
page_size = openapi.Parameter('page_size', openapi.IN_QUERY, description='페이지당 결과 수', required=False, type=openapi.TYPE_INTEGER, default=10)
item_type = openapi.Parameter(
    'item_type',
    openapi.IN_QUERY,
    description='item type',
    required=True,
    type=openapi.TYPE_STRING,
    enum=[
        'FeatureType',
        'InformationType',
        'SimpleAttribute',
        'ComplexAttribute',
        'EnumeratedValue'
    ]
)
item_id = openapi.Parameter('item_id', openapi.IN_QUERY, description='item의 ID', required=True, type=openapi.TYPE_STRING)
item_iv = openapi.Parameter('item_iv', openapi.IN_QUERY, description='item의 보안키', required=True, type=openapi.TYPE_STRING)


"""
    Concept
"""
### regiSystem의 query_item_list 오버로딩 (Concept_List 가져오는 함수)
from regiSystem.views.RE.get import query_concept_items, query_concept_item_one
@swagger_auto_schema(
    method='get',
    manual_parameters=[
        regi_uri, search_term, category, status,
        sort_key, sort_direction, page, page_size
    ]
)
@api_view(['GET'])
def iho_concept_item_list(request):
    """
    IHO api에서 제공하는 Concept Registry의 item list를 가져오는 API입니다.
    """
    if request.method != 'GET':
        return Response(status=400, data={"error": "Invalid request method"})

    try:
        search_term = request.GET.get('search_term', '')
        status = request.GET.get('status', '')
        category = request.GET.get('category', '')

        query = {"concept_id": "----"}  # IHO는 문자열
        if status:
            query["itemStatus"] = status
        if search_term:
            if category == "name":
                query["name"] = {"$regex": search_term, "$options": "i"}
            elif category == "camelCase":
                query["camelCase"] = {"$regex": search_term, "$options": "i"}
            elif category == "definition":
                query["definition"] = {"$regex": search_term, "$options": "i"}

        response_data = query_concept_items(request, db['IHO_Item'], ConceptItemSerializer, query)
        return Response(response_data)
    except Exception as e:
        return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

### regiSystem의 query_concept_item_one 오버로딩 (Concept_Item 개별으로 가져오는 함수)
@swagger_auto_schema(
    method='get',
    manual_parameters=[item_id, item_iv]
)
@api_view(['GET'])
def iho_concept_item_one(request):
    """
    IHO rgistry 에서 데이터를 개별으로 가져오는 API입니다.
    """
    collection = IHO_ItemDB
    return query_concept_item_one(request, collection)


from regiSystem.views.RE.get import query_concept_managemant_info, query_concept_reference, query_concept_reference_source
@swagger_auto_schema(
    method='get',
    manual_parameters=[item_id, item_iv]
)
@api_view(['GET'])
def iho_concept_management_info(request):
    """
    IHO registry의 개별 아이템에 연결된 관리 정보를 가져오는 API입니다.
    """
    collection = IHO_ManagementInfo
    return query_concept_managemant_info(request, collection)

@swagger_auto_schema(
    method='get',
    manual_parameters=[item_id, item_iv]
)
@api_view(['GET'])
def iho_concept_reference(request):
    """
    IHO registry의 개별 아이템에 연결된 참조 정보를 가져오는 API입니다.
    """
    collection = IHO_Reference
    return query_concept_reference(request, collection)

@swagger_auto_schema(
    method='get',
    manual_parameters=[item_id, item_iv]
)
@api_view(['GET'])
def iho_concept_reference_source(request):
    """
    IHO registry의 개별 아이템에 연결된 참조 소스를 가져오는 API입니다.
    """
    collection = IHO_ReferenceSource
    return query_concept_reference_source(request, collection)



"""
    Data Dictionary 
"""
### regiSystem의 query_item_list 오버로딩 (DDR_List 가져오는 함수)
from regiSystem.views.CD.get import query_ddr_item_list, query_ddr_item_one
@swagger_auto_schema(
    method='get',
    manual_parameters=[
        regi_uri, item_type, search_term, status, category,
        enum_type, value_type, sort_key, sort_direction, page, page_size
    ]
)
@api_view(['GET'])
def iho_DDR_item_list(request):
    """
    IHO api에서 제공하는 Data Dictionary Registry의 item list를 가져오는 API입니다.
    """
    if request.method != 'GET':
        return Response(status=400, data={"error": "Invalid request method"})

    item_type = request.GET.get('item_type')
    query = {"concept_id": "----", "itemType": item_type}

    response_data = query_ddr_item_list(request, IHO_ItemDB, query=query)
    return Response(response_data)

@swagger_auto_schema(
    method='get',
    manual_parameters=[item_type, item_id, item_iv]
)
@api_view(['GET'])
def iho_DDR_item_one(request):
    """
    IHO registry에서 Data Dictionary Registry의 item을 개별로 가져오는 API입니다.
    """

    from ihoDataIntegrationSystem.models import (
        IHO_ListedValue, IHO_AttributeUsage, IHO_Distinction)

    class_map = {
        "ListedValue": IHO_ListedValue,
        "AttributeUsage": IHO_AttributeUsage,
        "Distinction": IHO_Distinction,
    }

    result = query_ddr_item_one(request, IHO_ItemDB, class_map)

    if "error" in result:
        return Response({"error": result["error"]}, status=result["status"])
    return Response(result["data"], status=result["status"])
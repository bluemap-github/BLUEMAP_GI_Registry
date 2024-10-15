from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.utils import check_key_validation
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
item_id = openapi.Parameter('item_id', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

from openApiSystem.models.concept.item import (
    Concept,
    ManagementInfo,
    Reference,
    ReferenceSource,
)
from openApiSystem.models.registry.item import RE_Register
from openApiSystem.serializers.registry.item import (
    RE_ItemSerializer,  
    RE_ManagementInfoSerializer,
    RE_ReferenceSerializer,
    RE_ReferenceSourceSerializer,
)
### 공통함수
def get_params(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    item_id = request.GET.get('item_id')
    if not item_id:
        return regi_uri, service_key
    return regi_uri, service_key, item_id


@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, item_id],
    request_body=RE_ItemSerializer  # 요청 body 시리얼라이저 추가
)
@api_view(['PUT'])
def item(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    item_serializer = RE_ItemSerializer(data=request.data)
    if item_serializer.is_valid():
        validated_data = item_serializer.validated_data
        res = Concept.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": item_serializer.errors}, status=400)


@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, item_id],
    request_body=RE_ManagementInfoSerializer  # 요청 body 시리얼라이저 추가
)
@api_view(['PUT'])
def management_info(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    manage_info_serializer = RE_ManagementInfoSerializer(data=request.data)
    if manage_info_serializer.is_valid():
        validated_data = manage_info_serializer.validated_data
        res = ManagementInfo.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": manage_info_serializer.errors}, status=400)

@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, item_id],
    request_body=RE_ReferenceSerializer  # 요청 body 시리얼라이저 추가
)
@api_view(['PUT'])
def reference(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    ref_serializer = RE_ReferenceSerializer(data=request.data)
    if ref_serializer.is_valid():
        validated_data = ref_serializer.validated_data
        res = Reference.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": ref_serializer.errors}, status=400)

@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, item_id],
    request_body=RE_ReferenceSourceSerializer  # 요청 body 시리얼라이저 추가
)
@api_view(['PUT'])
def reference_source(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    ref_source_serializer = RE_ReferenceSourceSerializer(data=request.data)
    if ref_source_serializer.is_valid():
        validated_data = ref_source_serializer.validated_data
        res = ReferenceSource.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": ref_source_serializer.errors}, status=400)


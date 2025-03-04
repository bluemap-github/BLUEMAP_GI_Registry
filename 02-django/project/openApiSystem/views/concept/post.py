from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.utils import check_key_validation
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regi_uri = openapi.Parameter('regi_uri', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
service_key = openapi.Parameter('service_key', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
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
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    item_id = request.GET.get('item_id')
    if not item_id:
        return regi_uri, service_key
    return regi_uri, service_key, item_id

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=RE_ItemSerializer
)
@api_view(['POST'])
def item(request):
    regi_uri, service_key = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    C_id = RE_Register.get_register_by_url(regi_uri)
    item_serializer = RE_ItemSerializer(data=request.data)
    if item_serializer.is_valid():
        validated_data = item_serializer.validated_data
        res = Concept.insert(C_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": item_serializer.errors}, status=400)

    
@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key, item_id], 
    request_body=RE_ManagementInfoSerializer
)
@api_view(['POST'])
def management_info(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    manage_info_serializer = RE_ManagementInfoSerializer(data=request.data)
    if manage_info_serializer.is_valid():
        validated_data = manage_info_serializer.validated_data
        res = ManagementInfo.insert(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": manage_info_serializer.errors}, status=400)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key, item_id], 
    request_body=RE_ReferenceSerializer
)
@api_view(['POST'])
def reference(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    ref_serializer = RE_ReferenceSerializer(data=request.data)
    if ref_serializer.is_valid():
        validated_data = ref_serializer.validated_data
        res = Reference.insert(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": ref_serializer.errors}, status=400)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key, item_id], 
    request_body=RE_ReferenceSourceSerializer
)
@api_view(['POST'])
def reference_source(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    ref_source_serializer = RE_ReferenceSourceSerializer(data=request.data)
    if ref_source_serializer.is_valid():
        validated_data = ref_source_serializer.validated_data
        res = ReferenceSource.insert(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": ref_source_serializer.errors}, status=400)





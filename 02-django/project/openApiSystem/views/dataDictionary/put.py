from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.utils import check_key_validation
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
itemID = openapi.Parameter('itemID', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

from openApiSystem.models.registry.item import RE_Register
from openApiSystem.models.dataDictionary.item import (
    CD_EnumeratedValue,
    CD_SimpleAttribute,
    CD_ComplexAttribute,
    CD_Feature,
    CD_Information
)
from openApiSystem.serializers.dataDictionary.item import (
    CD_EnumeratedValueSerializer,
    CD_SimpleAttributeSerializer,
    CD_ComplexAttributeSerializer,
    CD_FeatureSerializer,
    CD_InformationSerializer
)
### 공통함수
def get_params(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    item_id = request.GET.get('itemID')
    if not item_id:
        return regi_uri, service_key
    return regi_uri, service_key, item_id

@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, itemID],
    request_body=CD_EnumeratedValueSerializer
)
@api_view(['PUT'])
def enumerated_value(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    enum_serializer = CD_EnumeratedValueSerializer(data=request.data)
    if enum_serializer.is_valid():
        validated_data = enum_serializer.validated_data
        res = CD_EnumeratedValue.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": enum_serializer.errors}, status=400)

@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, itemID],
    request_body=CD_SimpleAttributeSerializer
)
@api_view(['PUT'])
def simple_attribute(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    simple_serializer = CD_SimpleAttributeSerializer(data=request.data)
    if simple_serializer.is_valid():
        validated_data = simple_serializer.validated_data
        res = CD_SimpleAttribute.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": simple_serializer.errors}, status=400)

@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, itemID],
    request_body=CD_ComplexAttributeSerializer
)
@api_view(['PUT'])
def complex_attribute(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    complex_serializer = CD_ComplexAttributeSerializer(data=request.data)
    if complex_serializer.is_valid():
        validated_data = complex_serializer.validated_data
        res = CD_ComplexAttribute.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": complex_serializer.errors}, status=400)


@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, itemID],
    request_body=CD_FeatureSerializer
)
@api_view(['PUT'])
def feature(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    feature_serializer = CD_FeatureSerializer(data=request.data)
    if feature_serializer.is_valid():
        validated_data = feature_serializer.validated_data
        res = CD_Feature.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": feature_serializer.errors}, status=400)


@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, itemID],
    request_body=CD_InformationSerializer
)
@api_view(['PUT'])
def information(request):
    regi_uri, service_key, I_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    info_serializer = CD_InformationSerializer(data=request.data)
    if info_serializer.is_valid():
        validated_data = info_serializer.validated_data
        res = CD_Information.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": info_serializer.errors}, status=400)

from openApiSystem.models.dataDictionary.association import (
    CD_AttributeUsage,
    DD_associatedAttribute,
    DD_distinction
)
from openApiSystem.serializers.dataDictionary.association import (
    DDR_PUT_Associated_Attribute, DDR_PUT_Association
)

from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK


@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey],
    request_body=DDR_PUT_Associated_Attribute
)
@api_view(['PUT'])
def associated_attribute(request):
    association_id = request.data.get('association_id')
    new_parent_id = request.data.get('new_parent_id')
    print(association_id, new_parent_id, "들어는와?")

    result = DD_associatedAttribute.update_association(association_id, new_parent_id)
    if result.get("status") == "error":
        return Response(result["message"], status=HTTP_400_BAD_REQUEST)
    return Response("Association updated", status=HTTP_200_OK)




def common_update_association(model_class, request):
    association_id = request.data.get('association_id')
    new_child_id = request.data.get('new_child_id')
    result = model_class.update_association(association_id, new_child_id)
    if result.get("status") == "error":
        return Response(result["message"], status=HTTP_400_BAD_REQUEST)
    return Response("Association updated", status=HTTP_200_OK)



@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey],
    request_body=DDR_PUT_Association
)
@api_view(['PUT'])
def sub_attribute(request):
    return common_update_association(CD_AttributeUsage, request)


@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey],
    request_body=DDR_PUT_Association
)
@api_view(['PUT'])
def distinction(request):
    return common_update_association(DD_distinction, request)


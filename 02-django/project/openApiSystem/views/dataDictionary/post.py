from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.utils import check_key_validation
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regi_uri= openapi.Parameter('regi_uri', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
service_key = openapi.Parameter('service_key', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
item_id = openapi.Parameter('item_id', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

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
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    item_id = request.GET.get('item_id')
    if not item_id:
        return regi_uri, service_key
    return regi_uri, service_key, item_id

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=CD_EnumeratedValueSerializer
)
@api_view(['POST'])
def enumerated_value(request):
    regi_uri, service_key = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    C_id = RE_Register.get_register_by_url(regi_uri)
    enum_serializer = CD_EnumeratedValueSerializer(data=request.data)
    if enum_serializer.is_valid():
        validated_data = enum_serializer.validated_data
        res = CD_EnumeratedValue.insert(C_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": enum_serializer.errors}, status=400)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=CD_SimpleAttributeSerializer
)
@api_view(['POST'])
def simple_attribute(request):
    regi_uri, service_key = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    C_id = RE_Register.get_register_by_url(regi_uri)
    simple_serializer = CD_SimpleAttributeSerializer(data=request.data)
    if simple_serializer.is_valid():
        validated_data = simple_serializer.validated_data
        res = CD_SimpleAttribute.insert(C_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": simple_serializer.errors}, status=400)


from mongo_driver import db
S100_CD_AttributeConstraints = db['S100_CD_AttributeConstraints']
from regiSystem.serializers.CD import AttributeConstraintsSerializer

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key, item_id], 
    request_body=AttributeConstraintsSerializer
)
@api_view(['POST'])
def attribute_constraints(request):
    print(request.GET)
    regi_uri, service_key, item_id = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    if S100_CD_AttributeConstraints.find_one({"simpleAttribute": ObjectId(item_id)}):
        return Response({"status": "error", "message": "Attribute constraints already exist"}, status=404)
    serializer = AttributeConstraintsSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['simpleAttribute'] = ObjectId(item_id)
        
        res = S100_CD_AttributeConstraints.insert_one(validated_data)
        if res:
            return Response({"status": "success", "data": str(res.inserted_id)}, status=201)
        else:
            return Response({"status": "error", "message": "Insertion failed"}, status=404)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": serializer.errors}, status=400)
    

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=CD_ComplexAttributeSerializer
)
@api_view(['POST'])
def complex_attribute(request):
    regi_uri, service_key = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    C_id = RE_Register.get_register_by_url(regi_uri)
    comp_serializer = CD_ComplexAttributeSerializer(data=request.data)
    if comp_serializer.is_valid():
        validated_data = comp_serializer.validated_data
        res = CD_ComplexAttribute.insert(C_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": comp_serializer.errors}, status=400)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=CD_FeatureSerializer
)
@api_view(['POST'])
def feature(request):
    regi_uri, service_key = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    C_id = RE_Register.get_register_by_url(regi_uri)
    feature_serializer = CD_FeatureSerializer(data=request.data)
    if feature_serializer.is_valid():
        validated_data = feature_serializer.validated_data
        res = CD_Feature.insert(C_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": feature_serializer.errors}, status=400)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=CD_InformationSerializer
)
@api_view(['POST'])
def information(request):
    regi_uri, service_key = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    C_id = RE_Register.get_register_by_url(regi_uri)
    info_serializer = CD_InformationSerializer(data=request.data)
    if info_serializer.is_valid():
        validated_data = info_serializer.validated_data
        res = CD_Information.insert(C_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("inserted_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": info_serializer.errors}, status=400)


from openApiSystem.models.dataDictionary.association import (
    CD_AttributeUsage,
    DD_associatedAttribute,
    DD_distinction
)
from openApiSystem.serializers.dataDictionary.association import (
    DDR_Association
)

def common_association_insert(model, request):
    regi_uri, service_key = get_params(request)
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    parent_id = request.data.get("parent_id")
    child_id = request.data.get("child_id")
    res = model.insert_association(parent_id, child_id)
    if res.get("status") == "error":
        return Response({"status": "error", "message": res.get("message")}, status=404)
    else:
        return Response({"status": "success", "data": res.get("inserted_id")}, status=201)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=DDR_Association
)
@api_view(['POST'])
def associated_attribute(request):
    return common_association_insert(DD_associatedAttribute, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=DDR_Association
)
@api_view(['POST'])
def sub_attribute(request):
    return common_association_insert(CD_AttributeUsage, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regi_uri, service_key], 
    request_body=DDR_Association
)
@api_view(['POST'])
def distinction(request):
    return common_association_insert(DD_distinction, request)


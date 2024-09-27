from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING)
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING)
itemID = openapi.Parameter('itemID', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

from openApiSystem.models.registry.item import RE_Register
from openApiSystem.views.checkAccess import check_key_validation
from openApiSystem.models.dataDictionary.item import (
    CD_EnumeratedValue,
    CD_Attribute,
    CD_SimpleAttribute,
    CD_ComplexAttribute,
    CD_Feature,
    CD_Information,
)
from openApiSystem.serializers.dataDictionary.item import (
    CD_EnumeratedValueSerializer,
    CD_AttributeSerializer,
    CD_SimpleAttributeSerializer,
    CD_ComplexAttributeSerializer,
    CD_FeatureSerializer,
    CD_InformationSerializer,
)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey])
@api_view(['GET'])
def enumerated_value_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = CD_EnumeratedValue.get_item_list(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = CD_EnumeratedValueSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def enumerated_value_detail(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_item_detail = CD_EnumeratedValue.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = CD_EnumeratedValueSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey])
@api_view(['GET'])
def attribute_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = CD_Attribute.get_item_list(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = CD_AttributeSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey])
@api_view(['GET'])
def simple_attribute_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = CD_SimpleAttribute.get_item_list(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = CD_SimpleAttributeSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def simple_attribute_detail(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_item_detail = CD_SimpleAttribute.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = CD_SimpleAttributeSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey])
@api_view(['GET'])
def complex_attribute_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = CD_ComplexAttribute.get_item_list(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = CD_ComplexAttributeSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def complex_attribute_detail(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_item_detail = CD_ComplexAttribute.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = CD_ComplexAttributeSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey])
@api_view(['GET'])
def feature_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = CD_Feature.get_item_list(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = CD_FeatureSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def feature_detail(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_item_detail = CD_Feature.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = CD_FeatureSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey])
@api_view(['GET'])
def information_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = CD_Information.get_item_list(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = CD_InformationSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def information_detail(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_item_detail = CD_Information.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = CD_InformationSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
itemID = openapi.Parameter('itemID', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

from openApiSystem.models.registry.item import RE_Register
from openApiSystem.utils import check_key_validation
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



parent_id = openapi.Parameter('parent_id', openapi.IN_QUERY, description="Parent ID", type=openapi.TYPE_STRING)

from openApiSystem.models.dataDictionary.association import (
    CD_AttributeUsage,
    DD_associatedAttribute,
    DD_distinction
)
from openApiSystem.serializers.dataDictionary.association import (
    DDR_Association_List
)

def common_get_association(request, model, serializer):
    parent_id = request.GET.get('parent_id')
    
    # 모델에서 연관 항목 가져오기
    get_list = model.get_association(parent_id)
    
    # 연관 항목이 없거나 빈 리스트일 경우 404 반환
    if not get_list:
        return Response({"status": "error", "message": "No item found"}, status=404)

    # 인스턴스 기반으로 직렬화 진행
    serialized_items = serializer(instance=get_list, many=True)
    
    # 성공적인 응답 반환
    return Response({"status": "success", "data": serialized_items.data}, status=200)



@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, parent_id])
@api_view(['GET'])
def associated_attribute_list(request):
    return common_get_association(request, DD_associatedAttribute, DDR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, parent_id])
@api_view(['GET'])
def sub_attribute_list(request):
    return common_get_association(request, CD_AttributeUsage, DDR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, parent_id])
@api_view(['GET'])
def distinction_list(request):
    return common_get_association(request, DD_distinction, DDR_Association_List)


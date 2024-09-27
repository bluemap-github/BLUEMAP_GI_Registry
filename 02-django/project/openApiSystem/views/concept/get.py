from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.views.checkAccess import check_key_validation
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING)
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING)
itemID = openapi.Parameter('itemID', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

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

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey])
@api_view(['GET'])
def item_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response

    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = Concept.get_item_list(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = RE_ItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def item_detail(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_item_detail = Concept.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = RE_ItemSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def management_info_list_related_item(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_management_info_list = ManagementInfo.get_management_info_list_related_item(I_id)
    if get_management_info_list is None:
        return Response({"status": "error", "message": "No management info found"}, status=404)
    serialized_management_info = RE_ManagementInfoSerializer(get_management_info_list, many=True)
    return Response({"status": "success", "data": serialized_management_info.data}, status=200)


@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def reference_list_related_item(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_reference_list = Reference.get_reference_list_related_item(I_id)
    if get_reference_list is None:
        return Response({"status": "error", "message": "No reference found"}, status=404)
    serialized_reference = RE_ReferenceSerializer(get_reference_list, many=True)
    return Response({"status": "success", "data": serialized_reference.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regiURI, serviceKey, itemID])
@api_view(['GET'])
def reference_source_related_item(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('itemID')
    get_reference_source_list = ReferenceSource.get_reference_source_list_related_item(I_id)
    if get_reference_source_list is None:
        return Response({"status": "error", "message": "No reference source found"}, status=404)
    serialized_reference_source = RE_ReferenceSourceSerializer(get_reference_source_list, many=True)
    return Response({"status": "success", "data": serialized_reference_source.data}, status=200)


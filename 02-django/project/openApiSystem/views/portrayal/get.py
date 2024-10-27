from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regi_uri = openapi.Parameter('regi_uri', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
service_key = openapi.Parameter('service_key', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
item_id = openapi.Parameter('item_id', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

from openApiSystem.models.registry.item import RE_Register
from openApiSystem.utils import check_key_validation
from openApiSystem.serializers.portrayal.item import (
    S100_PR_OPEN_NationalLanguageStringSerializer, S100_PR_RegisterItemSerializer,
    S100_PR_VisualItemSerializer, S100_PR_ItemSchemaSerializer,
    S100_PR_ColourTokenSerializer, S100_PR_ColourPalletteSerializer,
    S100_PR_PaletteItemSerializer,
    S100_PR_DisplayPlaneSerializer, S100_PR_DisplayModeSerializer,
    S100_PR_ViewingGroupLayerSerializer, S100_PR_ViewingGroupSerializer,
    S100_PR_FontSerializer, S100_PR_ContextParameterSerializer,
    S100_PR_DrawingPrioritySerializer, S100_PR_AlertHighlightSerializer,
    S100_PR_AlertSerializer, S100_OPEN_PR_AlertInfoSerializer,
    S100_PR_AlertMessageSerializer
)
from openApiSystem.models.portrayal.item import (
    PR_VisualItem, PR_RegisterItem, PR_NationalLanguageString,
    PR_ItemSchema, PR_ColourToken,
    PR_Symbol, PR_LineStyle, PR_AreaFill, PR_Pixmap,
    PR_SymbolSchema, PR_LineStyleSchema, PR_AreaFillSchema, PR_PixmapSchema, PR_ColourProfileSchema,
    PR_ColourPalette, PR_PaletteItem,
    PR_DisplayPlane, PR_DisplayMode, PR_ViewingGroupLayer, PR_ViewingGroup,
    PR_Font, PR_ContextParameter, PR_DrawingPriority, PR_AlertHighlight, PR_Alert, PR_AlertInfo,
    PR_AlertMessage

)
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def visual_item_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_VisualItem.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def symbol_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_Symbol.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def line_style_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_LineStyle.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def area_fill_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AreaFill.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def pixmap_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_Pixmap.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def item_schema_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ItemSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def symbol_schema_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_SymbolSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def line_style_schema_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_LineStyleSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def area_fill_schema_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AreaFillSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def pixmap_schema_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_PixmapSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def colour_profile_schema_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ColourProfileSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def colour_token_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ColourToken.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ColourTokenSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def palette_item_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_PaletteItem.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_PaletteItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def colour_palette_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ColourPalette.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ColourPalletteSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def display_plane_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_DisplayPlane.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_DisplayPlaneSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def display_mode_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_DisplayMode.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_DisplayModeSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def viewing_group_layer_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ViewingGroupLayer.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ViewingGroupLayerSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def viewing_group_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ViewingGroup.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ViewingGroupSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def font_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_Font.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_FontSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def context_parameter_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ContextParameter.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ContextParameterSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def drawing_priority_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_DrawingPriority.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_DrawingPrioritySerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)



@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def alert_highlight_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AlertHighlight.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_AlertHighlightSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)




from regiSystem.serializers.PR import S100_PR_AlertInfoSerializer
from regiSystem.models.PR_Class import AlertInfoModel, AlertPriorityModel
from regiSystem.info_sec.getByURI import uri_to_serial

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def alert_info_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    items_cursor = AlertInfoModel.collection.find({"concept_id": ObjectId(C_id)})
    get_item_list = []
    for item in items_cursor:
        # _id를 문자열로 변환
        item['_id'] = str(item['_id'])
        # priority_ids가 있으면 우선순위 데이터를 처리
        if 'priority_ids' in item:
            item['priority'] = []
            for priority_id in item['priority_ids']:
                # 각 priority_id를 통해 우선순위 정보를 가져옴
                priority = AlertPriorityModel.get_priority_by_id(priority_id)
                if priority:
                    item['priority'].append(priority)
        get_item_list.append(item)
    
    if get_item_list is []:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_AlertInfoSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def symbol_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('item_id')
    get_item_detail = PR_Symbol.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_VisualItemSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def line_style_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('item_id')
    get_item_detail = PR_LineStyle.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_VisualItemSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def area_fill_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('item_id')
    get_item_detail = PR_AreaFill.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_VisualItemSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def pixmap_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('item_id')
    get_item_detail = PR_Pixmap.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_VisualItemSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def item_schema_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('item_id')
    get_item_detail = PR_ItemSchema.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_ItemSchemaSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def symbol_schema_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_SymbolSchema.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_ItemSchemaSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def line_style_schema_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response

    I_id = request.GET.get('item_id')
    get_item_detail = PR_LineStyleSchema.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_ItemSchemaSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def area_fill_schema_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    I_id = request.GET.get('item_id')
    get_item_detail = PR_AreaFillSchema.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_ItemSchemaSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def pixmap_schema_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_PixmapSchema.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_ItemSchemaSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def colour_profile_schema_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_ColourProfileSchema.get_item_detail(I_id)
    if get_item_detail is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_ItemSchemaSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def colour_token_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_ColourToken.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_ColourTokenSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def palette_item_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_PaletteItem.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_PaletteItemSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def colour_palette_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_ColourPalette.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_ColourPalletteSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def display_plane_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_DisplayPlane.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_DisplayPlaneSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def display_mode_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_DisplayMode.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_DisplayModeSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def viewing_group_layer_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_ViewingGroupLayer.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_ViewingGroupLayerSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def viewing_group_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_ViewingGroup.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_ViewingGroupSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def font_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_Font.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_FontSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def context_parameter_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_ContextParameter.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_ContextParameterSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def drawing_priority_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_DrawingPriority.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_DrawingPrioritySerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    

# @api_view(['GET'])
# def alert_detail(request):
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def alert_highlight_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_AlertHighlight.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    serialized_item = S100_PR_AlertHighlightSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def alert_info_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    # MongoDB에서 단일 문서 조회
    get_item_detail = AlertInfoModel.collection.find_one({"_id": ObjectId(I_id)})
    
    if not get_item_detail:
        return Response({"status": "error", "message": "Item not found"}, status=404)

    # priority_ids가 있을 경우 처리
    if 'priority_ids' in get_item_detail:
        get_item_detail['priority'] = []
        for priority_id in get_item_detail['priority_ids']:
            priority = AlertPriorityModel.get_priority_by_id(priority_id)
            if priority:
                get_item_detail['priority'].append(priority)

    # 데이터 직렬화
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)

    serialized_item = S100_PR_AlertInfoSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)
    

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def alert_message_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_AlertMessage.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    
    serialized_item = S100_PR_AlertMessageSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)


@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def alert_message_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AlertMessage.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_AlertMessageSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
@api_view(['GET'])
def alert_detail(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    I_id = request.GET.get('item_id')
    get_item_detail = PR_Alert.get_item_detail(I_id)
    if get_item_detail.get("status") == "error":
        return Response({"status": "error", "message": get_item_detail.get("message")}, status=404)
    
    serialized_item = S100_PR_AlertSerializer(get_item_detail)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

from regiSystem.serializers.PR import S100_PR_Alert_POST_Serializer
@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key])
@api_view(['GET'])
def alert_list(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_Alert.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_Alert_POST_Serializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

# from openApiSystem.serializers.portrayal.association import (

# )
# from openApiSystem.models.portrayal.association import (
    
# )

# #### 연관관계
# @swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, item_id])
# @api_view(['GET'])

from openApiSystem.models.portrayal.association import (
    SymbolAssociation,
    IconAssociation,
    ItemSchemaAssociation,
    ColourTokenAssociation,
    ValueAssociation,
    PaletteAssociation,
    DisplayModeAssociation,
    ViewingGroupAssociation,
    HighlightAssociation,
    MessageAssociation
)

from openApiSystem.serializers.portrayal.association import PR_Association_List

parent_id = openapi.Parameter('parent_id', openapi.IN_QUERY, description="Parent ID", type=openapi.TYPE_STRING)

def common_get_association(request, model, serializer):
    parent_id = request.GET.get('parent_id')
    
    # 모델에서 연관 항목 가져오기
    get_list = model.get_association(parent_id)
    
    # 연관 항목이 없거나 빈 리스트일 경우 404 반환
    if not get_list:
        return Response({"status": "error", "message": "No item found"}, status=404)

    # 인스턴스 기반으로 직렬화 진행
    print(get_list)
    serialized_items = serializer(instance=get_list, many=True)
    
    # 성공적인 응답 반환
    return Response({"status": "success", "data": serialized_items.data}, status=200)


    

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def symbol_association(request):
    return common_get_association(request, SymbolAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def item_schema_association(request):
    return common_get_association(request, ItemSchemaAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def colour_token_association(request):
    return common_get_association(request, ColourTokenAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def palette_association(request):
    return common_get_association(request, PaletteAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def display_mode_association(request):
    return common_get_association(request, DisplayModeAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def viewing_group_association(request):
    return common_get_association(request, ViewingGroupAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def highlight_association(request):
    return common_get_association(request, HighlightAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def icon_association(request):
    return common_get_association(request, IconAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def value_association(request):
    return common_get_association(request, ValueAssociation, PR_Association_List)

@swagger_auto_schema(method='get', manual_parameters=[regi_uri, service_key, parent_id])
@api_view(['GET'])
def msg_association(request):
    return common_get_association(request, MessageAssociation, PR_Association_List)





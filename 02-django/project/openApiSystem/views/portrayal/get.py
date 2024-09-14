from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openApiSystem.models.registry.item import RE_Register
from openApiSystem.views.checkAccess import check_key_validation
from openApiSystem.serializers.portrayal.item import (
    S100_PR_NationalLanguageStringSerializer, S100_PR_RegisterItemSerializer,
    S100_PR_VisualItemSerializer, S100_PR_ItemSchemaSerializer,
    S100_PR_ColourTokenSerializer, S100_PR_ColourPalletteSerializer,
    S100_PR_DisplayPlaneSerializer, S100_PR_DisplayModeSerializer,
    S100_PR_ViewingGroupLayerSerializer, S100_PR_ViewingGroupSerializer,
    S100_PR_FontSerializer, S100_PR_ContextParameterSerializer,
    S100_PR_DrawingPrioritySerializer, S100_PR_AlertHighlightSerializer,
    S100_PR_AlertSerializer, S100_PR_AlertInfoSerializer
)
from openApiSystem.models.portrayal.item import (
    PR_VisualItem, PR_RegisterItem, PR_NationalLanguageString,
    PR_ItemSchema, PR_ColourToken,
    PR_Symbol, PR_LineStyle, PR_AreaFill, PR_Pixmap,
    PR_SymbolSchema, PR_LineStyleSchema, PR_AreaFillSchema, PR_PixmapSchema, PR_ColourProfileSchema,
    PR_ColourPalette, PR_PaletteItem,
    PR_DisplayPlane, PR_DisplayMode, PR_ViewingGroupLayer, PR_ViewingGroup,
    PR_Font, PR_ContextParameter, PR_DrawingPriority, PR_AlertHighlight, PR_Alert, PR_AlertInfo
)

@api_view(['GET'])
def visual_item_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_VisualItem.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)
    

@api_view(['GET'])
def symbol_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_Symbol.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)


@api_view(['GET'])
def line_style_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_LineStyle.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def area_fill_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AreaFill.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def pixmap_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_Pixmap.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_VisualItemSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def item_schema_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ItemSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def symbol_schema_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_SymbolSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def line_style_schema_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_LineStyleSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def area_fill_schema_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AreaFillSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def pixmap_schema_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_PixmapSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def colour_profile_schema_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ColourProfileSchema.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ItemSchemaSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def colour_token_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ColourToken.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ColourTokenSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def palette_item_list(request):
    pass

@api_view(['GET'])
def colour_palette_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ColourPalette.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ColourPalletteSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def display_plane_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_DisplayPlane.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_DisplayPlaneSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def display_mode_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_DisplayMode.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_DisplayModeSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def viewing_group_layer_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ViewingGroupLayer.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ViewingGroupLayerSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def viewing_group_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ViewingGroup.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ViewingGroupSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def font_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_Font.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_FontSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def context_parameter_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_ContextParameter.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_ContextParameterSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def drawing_priority_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_DrawingPriority.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_DrawingPrioritySerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)


@api_view(['GET'])
def alert_list(request):
    pass
    

@api_view(['GET'])
def alert_highlight_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AlertHighlight.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_AlertHighlightSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def alert_info_list(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = RE_Register.get_register_by_url(regi_uri)
    get_item_list = PR_AlertInfo.get_list_by_id(C_id)
    if get_item_list is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_items = S100_PR_AlertInfoSerializer(get_item_list, many=True)
    return Response({"status": "success", "data": serialized_items.data}, status=200)

@api_view(['GET'])
def symbol_detail(request):
    regi_uri = request.GET.get('regiURI')
    service_key = request.GET.get('serviceKey')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    
    C_id = request.GET.get('C_id')
    get_item = PR_Symbol.get_item_by_id(C_id)
    if get_item is None:
        return Response({"status": "error", "message": "No item found"}, status=404)
    serialized_item = S100_PR_VisualItemSerializer(get_item)
    return Response({"status": "success", "data": serialized_item.data}, status=200)

    

@api_view(['GET'])
def line_style_detail(request):
    pass

@api_view(['GET'])
def area_fill_detail(request):
    pass

@api_view(['GET'])
def pixmap_detail(request):
    pass

@api_view(['GET'])
def item_schema_detail(request):
    pass

@api_view(['GET'])
def symbol_schema_detail(request):
    pass

# @api_view(['GET'])
# def line_style_schema_detail(request):
    

# @api_view(['GET'])
# def area_fill_schema_detail(request):
    

# @api_view(['GET'])
# def pixmap_schema_detail(request):
    

# @api_view(['GET'])
# def colour_profile_schema_detail(request):
    

# @api_view(['GET'])
# def colour_token_detail(request):
    

# @api_view(['GET'])
# def palette_item_detail(request):
    

# @api_view(['GET'])
# def colour_palette_detail(request):
    

# @api_view(['GET'])
# def display_plane_detail(request):
    

# @api_view(['GET'])
# def display_mode_detail(request):
    

# @api_view(['GET'])
# def viewing_group_layer_detail(request):
    

# @api_view(['GET'])
# def viewing_group_detail(request):
    

# @api_view(['GET'])
# def font_detail(request):
    

# @api_view(['GET'])
# def context_parameter_detail(request):
    

# @api_view(['GET'])
# def drawing_priority_detail(request):
    

# @api_view(['GET'])
# def alert_detail(request):
    

# @api_view(['GET'])
# def alert_highlight_detail(request):
    

# @api_view(['GET'])
# def alert_info_detail(request):
    

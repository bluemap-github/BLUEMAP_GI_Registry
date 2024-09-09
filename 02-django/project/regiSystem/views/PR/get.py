from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.models.PR_Visual import (
    SymbolSchemaModel,
    LineStyleSchemaModel,
    AreaFillSchemaModel,
    PixmapSchemaModel,
    ColourProfileSchemaModel,
    SymbolModel,
    LineStyleModel,
    AreaFillModel,
    PixmapModel
)
from regiSystem.serializers.PR import (S100_PR_ItemSchemaSerializer, S100_PR_VisualItemSerializer)

from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)
from regiSystem.info_sec.getByURI import uri_to_serial

@api_view(['GET'])
def get_symbol_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = SymbolModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_symbol(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = SymbolModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_line_style_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = LineStyleModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_line_style(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = LineStyleModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_area_fill_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = AreaFillModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_area_fill(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = AreaFillModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_pixmap_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = PixmapModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_pixmap(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = PixmapModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_symbol_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = SymbolSchemaModel.get_list(C_id)  

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200) 
    else:
        return Response(symbol_schema_data, status=400)


@api_view(['GET'])
def get_symbol_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = SymbolSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_line_style_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = LineStyleSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)

@api_view(['GET'])
def get_line_style_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = LineStyleSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_area_fill_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = AreaFillSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)

@api_view(['GET'])
def get_area_fill_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = AreaFillSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_pixmap_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = PixmapSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)
    
@api_view(['GET'])  
def get_pixmap_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = PixmapSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_colour_profile_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = ColourProfileSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)
    
@api_view(['GET'])
def get_colour_profile_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ColourProfileSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)



from regiSystem.models.PR_Visual import ColourTokenModel
@api_view(['GET'])
def get_colour_token_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = ColourTokenModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_colour_token(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ColourTokenModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Visual import PaletteItemModel
from regiSystem.serializers.PR import S100_PR_PaletteItemSerializer
@api_view(['GET'])
def palette_item_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = PaletteItemModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_PaletteItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def palette_item(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = PaletteItemModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Visual import ColourPaletteModel
from regiSystem.serializers.PR import S100_PR_ColourPalletteSerializer

@api_view(['GET'])
def colour_palette_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = ColourPaletteModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_ColourPalletteSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def colour_palette(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ColourPaletteModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import DisplayPlaneModel
from regiSystem.serializers.PR import S100_PR_DisplayPlaneSerializer
@api_view(['GET'])
def display_plane_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = DisplayPlaneModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_DisplayPlaneSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)
    
@api_view(['GET'])
def display_plane(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = DisplayPlaneModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import DisplayModeModel
from regiSystem.serializers.PR import S100_PR_DisplayModeSerializer
@api_view(['GET'])
def display_mode_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = DisplayModeModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_DisplayModeSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def display_mode(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = DisplayModeModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import ViewingGroupLayerModel
from regiSystem.serializers.PR import S100_PR_ViewingGroupLayerSerializer
@api_view(['GET'])
def viewing_group_layer_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = ViewingGroupLayerModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_ViewingGroupLayerSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def viewing_group_layer(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ViewingGroupLayerModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import ViewingGroupModel
from regiSystem.serializers.PR import S100_PR_ViewingGroupSerializer
@api_view(['GET'])
def viewing_group_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = ViewingGroupModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_ViewingGroupSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)
    
@api_view(['GET'])
def viewing_group(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ViewingGroupModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import FontModel
from regiSystem.serializers.PR import S100_PR_FontSerializer
@api_view(['GET'])
def font_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = FontModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_FontSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)
    
@api_view(['GET'])
def font(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = FontModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import ContextParameterModel
from regiSystem.serializers.PR import S100_PR_ContextParameterSerializer
@api_view(['GET'])
def context_parameter_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = ContextParameterModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_ContextParameterSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def context_parameter(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ContextParameterModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import DrawingPriorityModel
from regiSystem.serializers.PR import S100_PR_DrawingPrioritySerializer
@api_view(['GET'])
def drawing_priority_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = DrawingPriorityModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_DrawingPrioritySerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def drawing_priority(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = DrawingPriorityModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Display import AlertHighlightModel
from regiSystem.serializers.PR import S100_PR_AlertHighlightSerializer
@api_view(['GET'])
def alert_highlight_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = AlertHighlightModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_AlertHighlightSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)
    
@api_view(['GET'])
def alert_highlight(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = AlertHighlightModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)
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
    PixmapModel,
    ColourTokenModel,
    PaletteItemModel,
    ColourPaletteModel,
    DisplayModeModel,
    ViewingGroupLayerModel,
    DisplayPlaneModel,
    ViewingGroupModel,
    FontModel,
    ContextParameterModel,
    DrawingPriorityModel,
    AlertHighlightModel,
    AlertModel,
    AlertMessageModel
)

from regiSystem.serializers.PR import (
    S100_PR_ItemSchemaSerializer,
    S100_PR_VisualItemSerializer,
    S100_PR_PaletteItemSerializer,
    S100_PR_ColourPalletteSerializer,
    S100_PR_DisplayPlaneSerializer,
    S100_PR_DisplayModeSerializer,
    S100_PR_ViewingGroupLayerSerializer,
    S100_PR_ViewingGroupSerializer,
    S100_PR_FontSerializer,
    S100_PR_ContextParameterSerializer,
    S100_PR_DrawingPrioritySerializer,
    S100_PR_AlertHighlightSerializer,
    S100_PR_ColourTokenSerializer,
    S100_PR_AlertSerializer,
    S100_PR_AlertMessageSerializer
)

from regiSystem.info_sec.encryption import decrypt
from regiSystem.info_sec.getByURI import uri_to_serial


# 공통 헬퍼 함수들
def get_one_item(Model, item_id, serializer_class=None):
    try:
        item = Model.get_one(item_id)
        if 'status' in item and item['status'] == 'error':
            return Response({"status": "error", "message": item.get("message", "Unknown error")}, status=400)

        # if serializer_class:
        #     item = serializer_class(item['data']).data

        return Response({"status": "success", "data": item}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)


def get_list_items(Model, C_id, serializer_class):
    try:
        items = Model.get_list(C_id)
        if 'status' in items and items['status'] == 'error':
            return Response({"status": "error", "message": items.get("message", "Unknown error")}, status=400)

        serializer = serializer_class(items['data'], many=True)
        return Response({"status": "success", "data": serializer.data}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)


# 각 API 핸들러들

# Symbol
@api_view(['GET'])
def get_symbol_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(SymbolModel, C_id, S100_PR_VisualItemSerializer)


@api_view(['GET'])
def get_symbol(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(SymbolModel, I_id, S100_PR_VisualItemSerializer)


# LineStyle
@api_view(['GET'])
def get_line_style_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(LineStyleModel, C_id, S100_PR_VisualItemSerializer)


@api_view(['GET'])
def get_line_style(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(LineStyleModel, I_id, S100_PR_VisualItemSerializer)


# AreaFill
@api_view(['GET'])
def get_area_fill_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(AreaFillModel, C_id, S100_PR_VisualItemSerializer)


@api_view(['GET'])
def get_area_fill(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(AreaFillModel, I_id, S100_PR_VisualItemSerializer)


# Pixmap
@api_view(['GET'])
def get_pixmap_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(PixmapModel, C_id, S100_PR_VisualItemSerializer)


@api_view(['GET'])
def get_pixmap(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(PixmapModel, I_id, S100_PR_VisualItemSerializer)


# SymbolSchema
@api_view(['GET'])
def get_symbol_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(SymbolSchemaModel, C_id, S100_PR_ItemSchemaSerializer)


@api_view(['GET'])
def get_symbol_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(SymbolSchemaModel, I_id, S100_PR_ItemSchemaSerializer)


# LineStyleSchema
@api_view(['GET'])
def get_line_style_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(LineStyleSchemaModel, C_id, S100_PR_ItemSchemaSerializer)


@api_view(['GET'])
def get_line_style_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(LineStyleSchemaModel, I_id, S100_PR_ItemSchemaSerializer)


# AreaFillSchema
@api_view(['GET'])
def get_area_fill_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(AreaFillSchemaModel, C_id, S100_PR_ItemSchemaSerializer)


@api_view(['GET'])
def get_area_fill_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(AreaFillSchemaModel, I_id, S100_PR_ItemSchemaSerializer)


# PixmapSchema
@api_view(['GET'])
def get_pixmap_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(PixmapSchemaModel, C_id, S100_PR_ItemSchemaSerializer)


@api_view(['GET'])
def get_pixmap_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(PixmapSchemaModel, I_id, S100_PR_ItemSchemaSerializer)


# ColourProfileSchema
@api_view(['GET'])
def get_colour_profile_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(ColourProfileSchemaModel, C_id, S100_PR_ItemSchemaSerializer)


@api_view(['GET'])
def get_colour_profile_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(ColourProfileSchemaModel, I_id, S100_PR_ItemSchemaSerializer)


# ColourToken
@api_view(['GET'])
def get_colour_token_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(ColourTokenModel, C_id, S100_PR_ColourTokenSerializer)


@api_view(['GET'])
def get_colour_token(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(ColourTokenModel, I_id, S100_PR_ColourTokenSerializer)


# PaletteItem
@api_view(['GET'])
def palette_item_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(PaletteItemModel, C_id, S100_PR_PaletteItemSerializer)


@api_view(['GET'])
def palette_item(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(PaletteItemModel, I_id, S100_PR_PaletteItemSerializer)

@api_view(['GET'])
def alert_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(AlertModel, C_id, S100_PR_AlertSerializer)

@api_view(['GET'])
def alert(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(AlertModel, I_id, S100_PR_AlertSerializer)

@api_view(['GET'])
def alert_message_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(AlertMessageModel, C_id, S100_PR_AlertMessageSerializer)

@api_view(['GET'])
def alert_message(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(AlertMessageModel, I_id, S100_PR_AlertMessageSerializer)

# ColourPalette
@api_view(['GET'])
def colour_palette_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(ColourPaletteModel, C_id, S100_PR_ColourPalletteSerializer)


@api_view(['GET'])
def colour_palette(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(ColourPaletteModel, I_id, S100_PR_ColourPalletteSerializer)


# DisplayPlane
@api_view(['GET'])
def display_plane_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(DisplayPlaneModel, C_id, S100_PR_DisplayPlaneSerializer)


@api_view(['GET'])
def display_plane(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(DisplayPlaneModel, I_id, S100_PR_DisplayPlaneSerializer)


# DisplayMode
@api_view(['GET'])
def display_mode_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(DisplayModeModel, C_id, S100_PR_DisplayModeSerializer)


@api_view(['GET'])
def display_mode(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(DisplayModeModel, I_id, S100_PR_DisplayModeSerializer)


# ViewingGroupLayer
@api_view(['GET'])
def viewing_group_layer_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(ViewingGroupLayerModel, C_id, S100_PR_ViewingGroupLayerSerializer)


@api_view(['GET'])
def viewing_group_layer(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(ViewingGroupLayerModel, I_id, S100_PR_ViewingGroupLayerSerializer)


# ViewingGroup
@api_view(['GET'])
def viewing_group_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(ViewingGroupModel, C_id, S100_PR_ViewingGroupSerializer)


@api_view(['GET'])
def viewing_group(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(ViewingGroupModel, I_id, S100_PR_ViewingGroupSerializer)


# Font
@api_view(['GET'])
def font_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(FontModel, C_id, S100_PR_FontSerializer)


@api_view(['GET'])
def font(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(FontModel, I_id, S100_PR_FontSerializer)


# ContextParameter
@api_view(['GET'])
def context_parameter_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(ContextParameterModel, C_id, S100_PR_ContextParameterSerializer)


@api_view(['GET'])
def context_parameter(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(ContextParameterModel, I_id, S100_PR_ContextParameterSerializer)


# DrawingPriority
@api_view(['GET'])
def drawing_priority_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(DrawingPriorityModel, C_id, S100_PR_DrawingPrioritySerializer)


@api_view(['GET'])
def drawing_priority(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(DrawingPriorityModel, I_id, S100_PR_DrawingPrioritySerializer)


# AlertHighlight
@api_view(['GET'])
def alert_highlight_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return get_list_items(AlertHighlightModel, C_id, S100_PR_AlertHighlightSerializer)


@api_view(['GET'])
def alert_highlight(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    return get_one_item(AlertHighlightModel, I_id, S100_PR_AlertHighlightSerializer)

from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from regiSystem.info_sec.encryption import get_encrypted_id
from regiSystem.info_sec.getByURI import uri_to_serial
from regiSystem.models.Concept import RegiModel

# 공통 함수 정의
def insert_item(model_class, request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

# Visual Item Models
from regiSystem.models.PR_Class import (
    SymbolModel, 
    LineStyleModel, 
    AreaFillModel, 
    PixmapModel,
    ColourTokenModel,
    PaletteItemModel,
    ColourPaletteModel,
    SymbolSchemaModel,
    LineStyleSchemaModel,
    AreaFillSchemaModel,
    PixmapSchemaModel,
    ColourProfileSchemaModel,
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

# API 엔드포인트
@api_view(['POST'])
def insert_symbol_item(request):
    return insert_item(SymbolModel, request)

@api_view(['POST'])
def insert_line_style_item(request):
    return insert_item(LineStyleModel, request)

@api_view(['POST'])
def insert_area_fill_item(request):
    return insert_item(AreaFillModel, request)

@api_view(['POST'])
def insert_pixmap_item(request):
    return insert_item(PixmapModel, request)

@api_view(['POST'])
def insert_colour_token(request):
    return insert_item(ColourTokenModel, request)

@api_view(['POST'])
def insert_palette_item(request):
    return insert_item(PaletteItemModel, request)

@api_view(['POST'])
def insert_alert(request):
    return insert_item(AlertModel, request)


@api_view(['POST'])
def insert_colour_palette(request):
    return insert_item(ColourPaletteModel, request)


@api_view(['POST'])
def insert_symbol_schema(request):
    return insert_item(SymbolSchemaModel, request)

@api_view(['POST'])
def insert_line_style_schema(request):
    return insert_item(LineStyleSchemaModel, request)

@api_view(['POST'])
def insert_area_fill_schema(request):
    return insert_item(AreaFillSchemaModel, request)

@api_view(['POST'])
def insert_pixmap_schema(request):
    return insert_item(PixmapSchemaModel, request)

@api_view(['POST'])
def insert_colour_profile_schema(request):
    return insert_item(ColourProfileSchemaModel, request)


@api_view(['POST'])
def insert_display_mode(request):
    return insert_item(DisplayModeModel, request)

@api_view(['POST'])
def insert_display_plane(request):
    return insert_item(DisplayPlaneModel, request)

@api_view(['POST'])
def insert_viewing_group_layer(request):
    return insert_item(ViewingGroupLayerModel, request)

@api_view(['POST'])
def insert_viewing_group(request):
    return insert_item(ViewingGroupModel, request)

@api_view(['POST'])
def insert_font(request):
    return insert_item(FontModel, request)

@api_view(['POST'])
def insert_context_parameter(request):
    return insert_item(ContextParameterModel, request)

@api_view(['POST'])
def insert_drawing_priority(request):
    return insert_item(DrawingPriorityModel, request)

@api_view(['POST'])
def insert_alert_highlight(request):
    return insert_item(AlertHighlightModel, request)

@api_view(['POST'])
def insert_alert_message(request):
    return insert_item(AlertMessageModel, request)


## Association 공통함수 정의
from regiSystem.info_sec.encryption import decrypt
def insert_association_item(model_class, request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    data = request.data
    if data.get("child_id") is not None:
        A_id = decrypt(data.get("child_id").get("encrypted_data"), data.get("child_id").get("iv"))
        inserted_ = model_class.insert(ObjectId(I_id), ObjectId(A_id))
        if inserted_["status"] == "error":
            return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    else:
        return Response("child_id is required.", status=HTTP_400_BAD_REQUEST)
    return Response("successfuly inserted.", status=HTTP_201_CREATED)

from regiSystem.models.PR_Association import (
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
@api_view(['POST'])
def insert_colour_token_association(request):
    return insert_association_item(ColourTokenAssociation, request)

@api_view(['POST'])
def insert_palette_association(request):
    return insert_association_item(PaletteAssociation, request)

@api_view(['POST'])
def insert_display_mode_association(request):
    return insert_association_item(DisplayModeAssociation, request)

@api_view(['POST'])
def insert_viewing_group_association(request):
    return insert_association_item(ViewingGroupAssociation, request)

@api_view(['POST'])
def insert_message_association(request):
    return insert_association_item(MessageAssociation, request)

@api_view(['POST'])
def insert_highlight_association(request):
    return insert_association_item(HighlightAssociation, request)

@api_view(['POST'])
def insert_value_association(request):
    return insert_association_item(ValueAssociation, request)

@api_view(['POST'])
def insert_icon_association(request):
    return insert_association_item(IconAssociation, request)

@api_view(['POST'])
def insert_symbol_association(request):
    return insert_association_item(SymbolAssociation, request)

@api_view(['POST'])
def insert_item_schema_association(request):
    return insert_association_item(ItemSchemaAssociation, request)


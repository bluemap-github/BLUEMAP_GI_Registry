from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from regiSystem.info_sec.encryption import get_encrypted_id
from regiSystem.info_sec.getByURI import uri_to_serial
from regiSystem.models.Concept import RegiModel
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING)
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING)


# 공통 함수 정의
def insert_item(model_class, request):
    C_id = uri_to_serial(request.GET.get('regiURI'))
    data = request.data
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    
    encrypted_id = inserted_["inserted_id"]
    RegiModel.update_date(C_id)
    return Response({"status": "created", "_id": encrypted_id}, status=HTTP_201_CREATED)

# Visual Item Models
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
# API 엔드포인트
@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_VisualItemSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_symbol_item(request):
    return insert_item(PR_Symbol, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_VisualItemSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_line_style_item(request):
    return insert_item(PR_LineStyle, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_VisualItemSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_area_fill_item(request):
    return insert_item(PR_AreaFill, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_VisualItemSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_pixmap_item(request):
    return insert_item(PR_Pixmap, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ColourTokenSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_colour_token(request):
    return insert_item(PR_ColourToken, request)

# @api_view(['POST'])
# def insert_palette_item(request):
#     return insert_item(PaletteItemModel, request)

# @api_view(['POST'])
# def insert_alert(request):
#     return insert_item(AlertModel, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ColourPalletteSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_colour_palette(request):
    return insert_item(PR_ColourPalette, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ItemSchemaSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_symbol_schema(request):
    return insert_item(PR_SymbolSchema, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ItemSchemaSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_line_style_schema(request):
    return insert_item(PR_LineStyleSchema, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ItemSchemaSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_area_fill_schema(request):
    return insert_item(PR_AreaFillSchema, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ItemSchemaSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_pixmap_schema(request):
    return insert_item(PR_PixmapSchema, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ItemSchemaSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_colour_profile_schema(request):
    return insert_item(PR_ColourProfileSchema, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_DisplayModeSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_display_mode(request):
    return insert_item(PR_DisplayMode, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_DisplayPlaneSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_display_plane(request):
    return insert_item(PR_DisplayPlane, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ViewingGroupLayerSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_viewing_group_layer(request):
    return insert_item(PR_ViewingGroupLayer, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ViewingGroupSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_viewing_group(request):
    return insert_item(PR_ViewingGroup, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_FontSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_font(request):
    return insert_item(PR_Font, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_ContextParameterSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_context_parameter(request):
    return insert_item(PR_ContextParameter, request)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_DrawingPrioritySerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_drawing_priority(request):
    return insert_item(PR_DrawingPriority, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_AlertHighlightSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_alert_highlight(request):
    return insert_item(PR_AlertHighlight, request)

# @api_view(['POST'])
# def insert_alert_message(request):
#     return insert_item(AlertMessageModel, request)


# ## Association 공통함수 정의
# from regiSystem.info_sec.encryption import decrypt
# def insert_association_item(model_class, request):
#     item_iv = request.GET.get('item_iv')
#     I_id = decrypt(request.GET.get('item_id'), item_iv)
#     data = request.data
#     if data.get("child_id") is not None:
#         A_id = decrypt(data.get("child_id").get("encrypted_data"), data.get("child_id").get("iv"))
#         inserted_ = model_class.insert(ObjectId(I_id), ObjectId(A_id))
#         if inserted_["status"] == "error":
#             return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
#     else:
#         return Response("child_id is required.", status=HTTP_400_BAD_REQUEST)
#     return Response("successfuly inserted.", status=HTTP_201_CREATED)

# from regiSystem.models.PR_Association import (
#     SymbolAssociation,
#     IconAssociation,
#     ItemSchemaAssociation,
#     ColourTokenAssociation,
#     ValueAssociation,
#     PaletteAssociation,
#     DisplayModeAssociation,
#     ViewingGroupAssociation,
#     HighlightAssociation,
#     MessageAssociation
# )
# @api_view(['POST'])
# def insert_colour_token_association(request):
#     return insert_association_item(ColourTokenAssociation, request)

# @api_view(['POST'])
# def insert_palette_association(request):
#     return insert_association_item(PaletteAssociation, request)

# @api_view(['POST'])
# def insert_display_mode_association(request):
#     return insert_association_item(DisplayModeAssociation, request)

# @api_view(['POST'])
# def insert_viewing_group_association(request):
#     return insert_association_item(ViewingGroupAssociation, request)

# @api_view(['POST'])
# def insert_message_association(request):
#     return insert_association_item(MessageAssociation, request)

# @api_view(['POST'])
# def insert_highlight_association(request):
#     return insert_association_item(HighlightAssociation, request)

# @api_view(['POST'])
# def insert_value_association(request):
#     return insert_association_item(ValueAssociation, request)

# @api_view(['POST'])
# def insert_icon_association(request):
#     return insert_association_item(IconAssociation, request)

# @api_view(['POST'])
# def insert_symbol_association(request):
#     return insert_association_item(SymbolAssociation, request)

# @api_view(['POST'])
# def insert_item_schema_association(request):
#     return insert_association_item(ItemSchemaAssociation, request)


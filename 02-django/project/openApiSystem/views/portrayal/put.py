from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK
from regiSystem.info_sec.encryption import get_encrypted_id
from regiSystem.info_sec.getByURI import uri_to_serial
from regiSystem.models.Concept import RegiModel
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

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
    S100_PR_AlertSerializer, S100_PR_AlertInfoSerializer,
    S100_PR_PaletteItemSerializer,
    S100_PR_AlertMessageSerializer
)
from openApiSystem.models.portrayal.item import (
    PR_VisualItem, PR_RegisterItem, PR_NationalLanguageString,
    PR_ItemSchema, PR_ColourToken,
    PR_Symbol, PR_LineStyle, PR_AreaFill, PR_Pixmap,
    PR_SymbolSchema, PR_LineStyleSchema, PR_AreaFillSchema, PR_PixmapSchema, PR_ColourProfileSchema,
    PR_ColourPalette, PR_PaletteItem,
    PR_DisplayPlane, PR_DisplayMode, PR_ViewingGroupLayer, PR_ViewingGroup,
    PR_Font, PR_ContextParameter, PR_DrawingPriority, PR_AlertHighlight, 
    PR_Alert, PR_AlertInfo, PR_AlertMessage
)

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING)
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING)
itemID = openapi.Parameter('itemID', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)


# 공통 함수 정의
def update_item(model_class, request, item_id, serializer_class):
    C_id = uri_to_serial(request.GET.get('regiURI'))
    data = request.data

    # 기존 데이터 조회
    existing_item = model_class.collection[0].find_one({"_id": ObjectId(item_id)})
    if not existing_item:
        return Response({"status": "error", "message": "Item not found."}, status=HTTP_404_NOT_FOUND)

    # 업데이트
    updated_ = model_class.update(data, ObjectId(C_id), serializer_class, ObjectId(item_id))

    if updated_["status"] == "error":
        return Response(updated_["errors"], status=HTTP_400_BAD_REQUEST)

    encrypted_id = updated_["updated_id"]
    RegiModel.update_date(C_id)
    return Response({"status": "updated", "_id": encrypted_id}, status=HTTP_200_OK)


# API 엔드포인트
@swagger_auto_schema(
    method='put', 
    manual_parameters=[regiURI, serviceKey, itemID],
    request_body=S100_PR_VisualItemSerializer  # 요청 body 시리얼라이저 추가
)
@api_view(['PUT'])
def symbol(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_Symbol, request, I_id, S100_PR_VisualItemSerializer)


@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_VisualItemSerializer)
@api_view(['PUT'])
def line_style(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_LineStyle, request, I_id, S100_PR_VisualItemSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_VisualItemSerializer)
@api_view(['PUT'])
def area_fill(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_AreaFill, request, I_id, S100_PR_VisualItemSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_VisualItemSerializer)
@api_view(['PUT'])
def pixmap(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_Pixmap, request, I_id, S100_PR_VisualItemSerializer)



@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ItemSchemaSerializer)
@api_view(['PUT'])
def symbol_schema(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_SymbolSchema, request, I_id, S100_PR_ItemSchemaSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ItemSchemaSerializer)
@api_view(['PUT'])
def line_style_schema(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_LineStyleSchema, request, I_id, S100_PR_ItemSchemaSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ItemSchemaSerializer)
@api_view(['PUT'])
def area_fill_schema(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_AreaFillSchema, request, I_id, S100_PR_ItemSchemaSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ItemSchemaSerializer)
@api_view(['PUT'])
def pixmap_schema(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_PixmapSchema, request, I_id, S100_PR_ItemSchemaSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ItemSchemaSerializer)
@api_view(['PUT'])
def colour_profile_schema(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_ColourProfileSchema, request, I_id, S100_PR_ItemSchemaSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ColourTokenSerializer)
@api_view(['PUT'])
def colour_token(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_ColourToken, request, I_id, S100_PR_ColourTokenSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ColourPalletteSerializer)
@api_view(['PUT'])
def colour_palette(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_ColourPalette, request, I_id, S100_PR_ColourPalletteSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_DisplayPlaneSerializer)
@api_view(['PUT'])
def display_plane(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_DisplayPlane, request, I_id, S100_PR_DisplayPlaneSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_DisplayModeSerializer)
@api_view(['PUT'])
def display_mode(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_DisplayMode, request, I_id, S100_PR_DisplayModeSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ViewingGroupLayerSerializer)
@api_view(['PUT'])
def viewing_group_layer(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_ViewingGroupLayer, request, I_id, S100_PR_ViewingGroupLayerSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ViewingGroupSerializer)
@api_view(['PUT'])
def viewing_group(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_ViewingGroup, request, I_id, S100_PR_ViewingGroupSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_FontSerializer)
@api_view(['PUT'])
def font(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_Font, request, I_id, S100_PR_FontSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_ContextParameterSerializer)
@api_view(['PUT'])
def context_parameter(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_ContextParameter, request, I_id, S100_PR_ContextParameterSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_DrawingPrioritySerializer)
@api_view(['PUT'])
def drawing_priority(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_DrawingPriority, request, I_id, S100_PR_DrawingPrioritySerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_AlertHighlightSerializer)
@api_view(['PUT'])
def alert_highlight(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_AlertHighlight, request, I_id, S100_PR_AlertHighlightSerializer)


@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_PaletteItemSerializer)
@api_view(['PUT'])
def palette_item(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_PaletteItem, request, I_id, S100_PR_PaletteItemSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_AlertMessageSerializer)
@api_view(['PUT'])
def alert_message(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_AlertMessage, request, I_id, S100_PR_AlertMessageSerializer)

@swagger_auto_schema(method='put', manual_parameters=[regiURI, serviceKey, itemID], request_body=S100_PR_AlertSerializer)
@api_view(['PUT'])
def alert(request):
    I_id = request.GET.get('itemID')
    return update_item(PR_Alert, request, I_id, S100_PR_AlertSerializer)
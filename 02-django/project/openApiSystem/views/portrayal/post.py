from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from openApiSystem.models.registry.item import RE_Register
from regiSystem.models.Concept import RegiModel
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')


# 공통 함수 정의
def insert_item(model_class, request):
    C_id = RE_Register.get_register_by_url(request.GET.get('regiURI'))
    data = request.data
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    
    encrypted_id = inserted_["inserted_id"]
    RegiModel.update_date(C_id)
    return Response({"status": "created", "_id": encrypted_id}, status=HTTP_201_CREATED)

# Visual Item Models
from openApiSystem.models.registry.item import RE_Register 
from openApiSystem.utils import check_key_validation
from openApiSystem.serializers.portrayal.item import (
    S100_PR_NationalLanguageStringSerializer, S100_PR_RegisterItemSerializer,
    S100_PR_VisualItemSerializer, S100_PR_ItemSchemaSerializer,
    S100_PR_ColourTokenSerializer, S100_PR_ColourPalletteSerializer,
    S100_PR_DisplayPlaneSerializer, S100_PR_DisplayModeSerializer,
    S100_PR_ViewingGroupLayerSerializer, S100_PR_ViewingGroupSerializer,
    S100_PR_FontSerializer, S100_PR_ContextParameterSerializer,
    S100_PR_DrawingPrioritySerializer, S100_PR_AlertHighlightSerializer,
    S100_PR_AlertSerializer, S100_PR_AlertMessageSerializer,
    S100_PR_PaletteItemSerializer
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

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_PaletteItemSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_palette_item(request):
    return insert_item(PR_PaletteItem, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_AlertSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_alert(request):
    return insert_item(PR_Alert, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_AlertMessageSerializer  # 여기에 요청 body 시리얼라이저를 추가
)
@api_view(['POST'])
def insert_alert_message(request):
    return insert_item(PR_AlertMessage, request)

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

from openApiSystem.serializers.portrayal.association import PR_Association
exist_count_limit = [
    IconAssociation, ItemSchemaAssociation, HighlightAssociation, MessageAssociation
]

def common_insert_association(model_class, request):
    parent_id = request.data.get('parent_id')
    # parent_type = request.data.get('parent_type')
    child_id = request.data.get('child_id')
    # child_type = request.data.get('child_type')
    if model_class in exist_count_limit:
        if model_class.get_association(parent_id):
            return Response("Association already exists", status=HTTP_400_BAD_REQUEST)
    inserted_ = model_class.insert(parent_id, child_id)
    if inserted_["status"] == "error":
        return Response(inserted_["message"], status=HTTP_400_BAD_REQUEST)
    return Response({"status": "created", "message" : inserted_["inserted_id"]}, status=HTTP_201_CREATED)


@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def symbol_association(request):
    return common_insert_association(SymbolAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def item_schema_association(request):
    return common_insert_association(ItemSchemaAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def colour_token_association(request):
    return common_insert_association(ColourTokenAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def palette_association(request):
    return common_insert_association(PaletteAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def display_mode_association(request):
    return common_insert_association(DisplayModeAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def viewing_group_association(request):
    return common_insert_association(ViewingGroupAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def highlight_association(request):
    return common_insert_association(HighlightAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def icon_association(request):
    return common_insert_association(IconAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def value_association(request):
    return common_insert_association(ValueAssociation, request)

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=PR_Association
)
@api_view(['POST'])
def msg_association(request):
    return common_insert_association(MessageAssociation, request)


from regiSystem.serializers.PR import S100_PR_AlertInfoSerializer
from regiSystem.models.PR_Class import AlertInfoModel
from regiSystem.info_sec.getByURI import uri_to_serial

@swagger_auto_schema(
    method='post', 
    manual_parameters=[regiURI, serviceKey],
    request_body=S100_PR_AlertInfoSerializer
)
@api_view(['POST'])
def insert_alert_info(request):
    # regiURI에서 C_id 추출
    regiURI = request.GET.get('regiURI')
    if not regiURI:
        return Response({"status": "error", "message": "Missing regiURI"}, status=HTTP_400_BAD_REQUEST)
    
    C_id = uri_to_serial(regiURI)  # C_id 변환
    if not C_id:
        return Response({"status": "error", "message": "Invalid regiURI"}, status=HTTP_400_BAD_REQUEST)

    data = request.data

    # 모델의 insert 메서드 호출
    result = AlertInfoModel.insert(data, C_id)

    # 삽입 결과 확인
    if result.get("status") == "success":
        return Response({"status": "success", "inserted_id": result["inserted_id"]}, status=HTTP_201_CREATED)
    else:
        return Response({"status": "error", "errors": result.get("errors") or result.get("message")}, status=HTTP_400_BAD_REQUEST)
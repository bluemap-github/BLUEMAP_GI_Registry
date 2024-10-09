from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from regiSystem.info_sec.encryption import get_encrypted_id, decrypt
from regiSystem.info_sec.getByURI import uri_to_serial
from regiSystem.models.Concept import RegiModel
import json
import os
from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

# Visual Item Models
from regiSystem.models.PR_Class import (
    SymbolModel, LineStyleModel, AreaFillModel, PixmapModel, ColourTokenModel, PaletteItemModel, ColourPaletteModel, 
    SymbolSchemaModel, LineStyleSchemaModel, AreaFillSchemaModel, PixmapSchemaModel, ColourProfileSchemaModel, 
    DisplayModeModel, ViewingGroupLayerModel, DisplayPlaneModel, ViewingGroupModel, FontModel, ContextParameterModel, 
    DrawingPriorityModel, AlertHighlightModel, AlertModel, AlertMessageModel
)

# Association Models
from regiSystem.models.PR_Association import (
    SymbolAssociation, IconAssociation, ItemSchemaAssociation, ColourTokenAssociation, ValueAssociation, 
    PaletteAssociation, DisplayModeAssociation, ViewingGroupAssociation, HighlightAssociation, MessageAssociation
)


# 공통 파일 저장 함수
def save_file(file, directory, file_name):
    if file:
        file_path = os.path.join(settings.MEDIA_ROOT, directory, file_name)
        try:
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            return os.path.join(settings.MEDIA_URL, directory, file_name)
        except Exception as e:
            print(f"Error saving file {file_name}: {e}")
            return ""
    return ""


# FormData 처리 공통 함수
def handle_visual_data_files(request, model_class):
    """
    FormData 처리를 통해 파일을 저장하고, 필요한 데이터를 변환한 후 모델에 삽입하는 함수
    """
    # 파일 처리
    preview_image = request.FILES.get('previewImage')
    engineering_image = request.FILES.get('engineeringImage')
    svg_file = request.FILES.get('itemDetail')

    # 기본 정보 처리
    concept_id = request.data.get('concept_id')

    # 파일 저장
    preview_image_url = save_file(preview_image, 'preview_image', f"{concept_id}_preview_{preview_image.name}" if preview_image else "")
    engineering_image_url = save_file(engineering_image, 'engineering_image', f"{concept_id}_engineering_{engineering_image.name}" if engineering_image else "")
    svg_file_url = save_file(svg_file, 'svg', f"{concept_id}_symbol_{svg_file.name}" if svg_file and svg_file.name.endswith('.svg') else "")

    # request.data를 복사하고 파일 경로 추가
    mutable_data = request.data.copy()

    # JSON 문자열을 딕셔너리로 변환 (description 등)
    description_str = mutable_data.get('description')
    if description_str:
        try:
            description_list = json.loads(description_str)
            if isinstance(description_list, list) and len(description_list) > 0:
                mutable_data['description'] = description_list[0]
            else:
                return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)

    # 파일 경로 추가
    mutable_data['previewImage'] = preview_image_url
    mutable_data['engineeringImage'] = engineering_image_url
    mutable_data['itemDetail'] = svg_file_url

    # 데이터 삽입
    return insert_item(model_class, request, mutable_data)


def handle_schema_data_files(request, model_class):
    """
    FormData 처리를 통해 XML 또는 XSD 파일을 저장하고, 필요한 데이터를 변환한 후 모델에 삽입하는 함수
    """
    # 파일 처리 (xmlSchema)
    xml_schema = request.FILES.get('xmlSchema')

    # 기본 정보 처리
    concept_id = request.data.get('concept_id')

    # 파일 저장 (확장자가 .xsd 또는 .xml인 파일만 처리)
    xml_schema_url = save_file(xml_schema, 'xml', f"{concept_id}_schema_{xml_schema.name}" if xml_schema and (xml_schema.name.endswith('.xsd') or xml_schema.name.endswith('.xml')) else "")

    # request.data를 복사하고 파일 경로 추가
    mutable_data = request.data.copy()

    # JSON 문자열을 딕셔너리로 변환 (description 등)
    description_str = mutable_data.get('description')
    if description_str:
        try:
            description_list = json.loads(description_str)
            if isinstance(description_list, list) and len(description_list) > 0:
                mutable_data['description'] = description_list[0]
            else:
                return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)

    # 파일 경로 추가 (xmlSchema)
    mutable_data['xmlSchema'] = xml_schema_url

    # 데이터 삽입
    return insert_item(model_class, request, mutable_data)


# 공통 데이터 삽입 함수
def insert_item(model_class, request, data):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)

    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)


# 공통 Association 삽입 함수
def insert_association_item(model_class, request, data):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    if data.get("child_id") is not None:
        A_id = decrypt(data.get("child_id").get("encrypted_data"), data.get("child_id").get("iv"))
        inserted_ = model_class.insert(ObjectId(I_id), ObjectId(A_id))
        if inserted_["status"] == "error":
            return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    else:
        return Response("child_id is required.", status=HTTP_400_BAD_REQUEST)
    return Response("successfully inserted.", status=HTTP_201_CREATED)



@api_view(['POST'])
def insert_symbol_item(request):
    return handle_visual_data_files(request, SymbolModel)

@api_view(['POST'])
def insert_line_style_item(request):
    return handle_visual_data_files(request, LineStyleModel)

@api_view(['POST'])
def insert_area_fill_item(request):
    return handle_visual_data_files(request, AreaFillModel)

@api_view(['POST'])
def insert_pixmap_item(request):
    return handle_visual_data_files(request, PixmapModel)

# 직접 파일 처리가 필요하지 않은 모델
@api_view(['POST'])
def insert_colour_token(request):
    return insert_item(ColourTokenModel, request, request.data)

@api_view(['POST'])
def insert_palette_item(request):
    return insert_item(PaletteItemModel, request, request.data)

@api_view(['POST'])
def insert_alert(request):
    return insert_item(AlertModel, request, request.data)

@api_view(['POST'])
def insert_colour_palette(request):
    return insert_item(ColourPaletteModel, request, request.data)

@api_view(['POST'])
def insert_symbol_schema(request):
    return handle_schema_data_files(request, SymbolSchemaModel)

@api_view(['POST'])
def insert_line_style_schema(request):
    return handle_schema_data_files(request, LineStyleSchemaModel)

@api_view(['POST'])
def insert_area_fill_schema(request):
    return handle_schema_data_files(request, AreaFillSchemaModel)

@api_view(['POST'])
def insert_pixmap_schema(request):
    return handle_schema_data_files(request, PixmapSchemaModel)

@api_view(['POST'])
def insert_colour_profile_schema(request):
    return handle_schema_data_files(request, ColourProfileSchemaModel)

@api_view(['POST'])
def insert_display_mode(request):
    return insert_item(DisplayModeModel, request, request.data)

@api_view(['POST'])
def insert_display_plane(request):
    return insert_item(DisplayPlaneModel, request, request.data)

@api_view(['POST'])
def insert_viewing_group_layer(request):
    return insert_item(ViewingGroupLayerModel, request, request.data)

@api_view(['POST'])
def insert_viewing_group(request):
    return insert_item(ViewingGroupModel, request, request.data)

@api_view(['POST'])
def insert_font(request):
    """
    폰트 파일을 업로드하고, 필요한 데이터를 처리한 후 모델에 삽입하는 함수
    """
    # 파일 처리 (fontFile)
    font_file = request.FILES.get('fontFile')

    # 기본 정보 처리 (예: concept_id 등)
    concept_id = request.data.get('concept_id')

    # 파일 저장 (파일이 있는 경우 저장)
    font_file_url = ""
    if font_file:
        font_file_url = save_file(font_file, 'font', f"{concept_id}_font_{font_file.name}")

    # request.data를 복사하지 않고, 수동으로 데이터 추가
    mutable_data = request.data.dict()  # dict()로 변환하여 복사, 하지만 파일은 제외됨

    # JSON 문자열로 전달된 필드가 있다면 변환 처리
    # 'description' 필드가 문자열인지 리스트인지 확인
    description_str = mutable_data.get('description')
    if isinstance(description_str, str):
        try:
            mutable_data['description'] = json.loads(description_str)
        except json.JSONDecodeError:
            return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)
    elif isinstance(description_str, list):
        # 이미 리스트인 경우에는 변환하지 않음
        mutable_data['description'] = description_str
    else:
        return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)

    # 파일 경로 추가 (fontFile 경로)
    mutable_data['fontFile'] = font_file_url

    # 데이터 삽입
    return insert_item(FontModel, request, mutable_data)


@api_view(['POST'])
def insert_context_parameter(request):
    return insert_item(ContextParameterModel, request, request.data)

@api_view(['POST'])
def insert_drawing_priority(request):
    return insert_item(DrawingPriorityModel, request, request.data)

@api_view(['POST'])
def insert_alert_highlight(request):
    return insert_item(AlertHighlightModel, request, request.data)

@api_view(['POST'])
def insert_alert_message(request):
    return insert_item(AlertMessageModel, request, request.data)

# Association 엔드포인트
@api_view(['POST'])
def insert_colour_token_association(request):
    return insert_association_item(ColourTokenAssociation, request, request.data)

@api_view(['POST'])
def insert_palette_association(request):
    return insert_association_item(PaletteAssociation, request, request.data)

@api_view(['POST'])
def insert_display_mode_association(request):
    return insert_association_item(DisplayModeAssociation, request, request.data)

@api_view(['POST'])
def insert_viewing_group_association(request):
    return insert_association_item(ViewingGroupAssociation, request, request.data)

@api_view(['POST'])
def insert_message_association(request):
    return insert_association_item(MessageAssociation, request, request.data)

@api_view(['POST'])
def insert_highlight_association(request):
    return insert_association_item(HighlightAssociation, request, request.data)

@api_view(['POST'])
def insert_value_association(request):
    return insert_association_item(ValueAssociation, request, request.data)

@api_view(['POST'])
def insert_icon_association(request):
    return insert_association_item(IconAssociation, request, request.data)

@api_view(['POST'])
def insert_symbol_association(request):
    return insert_association_item(SymbolAssociation, request, request.data)

@api_view(['POST'])
def insert_item_schema_association(request):
    return insert_association_item(ItemSchemaAssociation, request, request.data)

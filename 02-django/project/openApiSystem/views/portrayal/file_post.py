from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from openApiSystem.models.registry.item import RE_Register
from regiSystem.models.Concept import RegiModel
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework import status
import json
import os
from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from openApiSystem.utils import check_key_validation

# Visual Item Models
from openApiSystem.models.registry.item import RE_Register
from openApiSystem.serializers.portrayal.item import (
    S100_PR_VisualItemSerializer, S100_PR_ItemSchemaSerializer,
    S100_PR_FontSerializer, 
)
from openApiSystem.models.portrayal.item import (
    PR_LineStyle, PR_AreaFill, PR_Pixmap,
    PR_SymbolSchema, PR_LineStyleSchema, PR_AreaFillSchema, PR_PixmapSchema, PR_ColourProfileSchema,
    PR_Font, PR_Symbol, PR_LineStyle, PR_AreaFill, PR_Pixmap
)

from drf_yasg import openapi

# Swagger에서 JSON과 파일 업로드 파라미터 정의 (초기값 포함)
regi_uri = openapi.Parameter('regi_uri', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
service_key = openapi.Parameter('service_key', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')


item_identifier_param = openapi.Parameter('itemIdentifier', openapi.IN_FORM, description='Item Identifier', type=openapi.TYPE_INTEGER, default=1)
name_param = openapi.Parameter('name', openapi.IN_FORM, description='Name of the item', type=openapi.TYPE_STRING, default='Sample Item Name')
definition_param = openapi.Parameter('definition', openapi.IN_FORM, description='Definition', type=openapi.TYPE_STRING, default='This is a sample definition.')
remarks_param = openapi.Parameter('remarks', openapi.IN_FORM, description='Remarks', type=openapi.TYPE_STRING, default='Sample remarks')
item_status_param = openapi.Parameter('itemStatus', openapi.IN_FORM, description='Item Status', type=openapi.TYPE_STRING, default='processing')
alias_param = openapi.Parameter('alias', openapi.IN_FORM, description='Alias', type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING), default=['Alias1'])
camel_case_param = openapi.Parameter('camelCase', openapi.IN_FORM, description='Camel Case', type=openapi.TYPE_STRING, default='sampleCamelCase')
definition_source_param = openapi.Parameter('definitionSource', openapi.IN_FORM, description='Definition Source', type=openapi.TYPE_STRING, default='Sample Source')
reference_param = openapi.Parameter('reference', openapi.IN_FORM, description='Reference', type=openapi.TYPE_STRING, default='Sample Reference')
similarity_to_source_param = openapi.Parameter('similarityToSource', openapi.IN_FORM, description='Similarity to Source', type=openapi.TYPE_STRING, default='100%')
justification_param = openapi.Parameter('justification', openapi.IN_FORM, description='Justification', type=openapi.TYPE_STRING, default='Sample Justification')
proposed_change_param = openapi.Parameter('proposedChange', openapi.IN_FORM, description='Proposed Change', type=openapi.TYPE_STRING, default='No changes proposed')
xml_id_param = openapi.Parameter('xmlID', openapi.IN_FORM, description='XML ID', type=openapi.TYPE_STRING, default='XML1234')
font_type_param = openapi.Parameter('fontType', openapi.IN_FORM, description='Font Type', type=openapi.TYPE_STRING, default='ttf')
# description 필드: JSON 형식으로 입력하도록 설정 (기본값 포함)
description_param = openapi.Parameter(
    'description', 
    openapi.IN_FORM, 
    description='Description (as JSON string)',  # JSON 문자열로 설명
    type=openapi.TYPE_STRING,  # JSON 객체가 아닌 문자열로 받음
    default='[{"text": "Sample text", "language": "en"}]'  # JSON 문자열 형식의 기본값
)

preview_type_param = openapi.Parameter('previewType', openapi.IN_FORM, description='Preview Image Type', type=openapi.TYPE_STRING, default='jpg')
engineering_image_type_param = openapi.Parameter('engineeringImageType', openapi.IN_FORM, description='Engineering Image Type', type=openapi.TYPE_STRING, default='tif')

# 파일 업로드 파라미터 정의 (초기값 설정은 필요하지 않음)
preview_image_param = openapi.Parameter('previewImage', openapi.IN_FORM, description='Upload preview image file', type=openapi.TYPE_FILE)
engineering_image_param = openapi.Parameter('engineeringImage', openapi.IN_FORM, description='Upload engineering image file', type=openapi.TYPE_FILE)
item_detail_param = openapi.Parameter('itemDetail', openapi.IN_FORM, description='Upload item detail file', type=openapi.TYPE_FILE)
xml_schema_param = openapi.Parameter('xmlSchema', openapi.IN_FORM, description='Upload XML schema file', type=openapi.TYPE_FILE)
font_file_param = openapi.Parameter('fontFile', openapi.IN_FORM, description='Upload font file', type=openapi.TYPE_FILE)




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

from regiSystem.info_sec.getByURI import uri_to_serial
# 공통 파일데이터 삽입 함수
def insert_file_item(model_class, request, data):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return None  # 에러 시 None 반환

    ob_id = inserted_["inserted_id"]
    RegiModel.update_date(C_id)
    return ob_id  # 성공 시 실제 _id 값을 반환

derectory_to_match_file = {
    "previewImage": "preview_image",
    "engineeringImage": "engineering_image",
    "itemDetail": "svg",
    "xmlSchema": "xml",
    "fontFile": "font"
}

def handle_file_data(request, model_class, file_fields, directory, file_extension=None):
    # QueryDict 데이터를 일반 딕셔너리로 변환하면서 파일 필드는 빈 문자열로 처리
    mutable_data = {}

    try:
        for key, value in request.data.items():
            if key in file_fields:
                mutable_data[key] = ""
            elif key == 'description':
                try:
                    description_list = json.loads(value)
                    if isinstance(description_list, list):
                        mutable_data[key] = description_list
                    else:
                        return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)
                except json.JSONDecodeError:
                    return Response({"error": "Invalid description format."}, status=HTTP_400_BAD_REQUEST)
            else:
                mutable_data[key] = value
    except Exception as e:
        return Response({"error": f"Failed to process request data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)


    # 파일 경로 설정
    for file_field in file_fields:
        uploaded_file = request.FILES.get(file_field)
        if uploaded_file:
            file_path = os.path.join(settings.MEDIA_ROOT, derectory_to_match_file[file_field])
            mutable_data[file_field] = file_path
        else:
            mutable_data[file_field] = ""
    
    # 데이터를 먼저 삽입하여 _id 값을 얻어옴

    instance_id = insert_file_item(model_class, request, mutable_data)

    if instance_id:
        # 파일명을 _id값으로 변경 후 파일 저장
        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file:
                save_file(uploaded_file, derectory_to_match_file[file_field], f"{instance_id}.{file_extension}" if file_extension else instance_id)

        # 암호화된 _id 반환
        return Response({"_id": instance_id}, status=HTTP_201_CREATED)

    return Response({"error": "Failed to insert item."}, status=HTTP_400_BAD_REQUEST)


def handle_visual_data_files(request, model_class):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_file_data(request, model_class, file_fields, 'visual_data')


item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='Symbol')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_symbol_item(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_visual_data_files(request, PR_Symbol)


item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='LineStyle')
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_line_style_item(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_visual_data_files(request, PR_LineStyle)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='AreaFill')
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_area_fill_item(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_visual_data_files(request, PR_AreaFill)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='Pixmap')
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_pixmap_item(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_visual_data_files(request, PR_Pixmap)

def handle_schema_data_files(request, model_class):
    file_fields = ['xmlSchema']
    return handle_file_data(request, model_class, file_fields, 'xml')

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='SymbolSchema')
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_symbol_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_schema_data_files(request, PR_SymbolSchema)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='LineStyleSchema')
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_line_style_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_schema_data_files(request, PR_LineStyleSchema)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='AreaFillSchema')
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_area_fill_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_schema_data_files(request, PR_AreaFillSchema)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='PixmapSchema') 
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_pixmap_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_schema_data_files(request, PR_PixmapSchema)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='ColourProfileSchema') 
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_colour_profile_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_schema_data_files(request, PR_ColourProfileSchema)


def handle_font_files(request, model_class):
    file_fields = ['fontFile']
    return handle_file_data(request, model_class, file_fields, 'font', 'ttf')

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='Font') 
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        regi_uri, service_key,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, font_file_param, font_type_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def insert_font(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    return handle_font_files(request, PR_Font)

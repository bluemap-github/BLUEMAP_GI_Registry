
from regiSystem.info_sec.getByURI import uri_to_serial
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
item_id = openapi.Parameter('item_id', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

item_identifier_param = openapi.Parameter('item_identifier', openapi.IN_FORM, description='Item Identifier', type=openapi.TYPE_INTEGER, default=1)
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


def update_file_item(model_class, request, data, M_id, serializer_class):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    
    updated_ = model_class.update(data, ObjectId(C_id), serializer_class, M_id)
    
    if updated_["status"] == "error":
        # 'errors' 키가 있는지 확인한 후 처리
        errors = updated_.get("errors", "Unknown error")
        return Response(errors, status=HTTP_400_BAD_REQUEST)
    
    RegiModel.update_date(C_id)
    
    return M_id

derectory_to_match_file = {
    "previewImage": "preview_image",
    "engineeringImage": "engineering_image",
    "itemDetail": "svg",
    "xmlSchema": "xml",
    "fontFile": "font"
}
def handle_file_update(request, model_class, file_fields, directory, serializer_class):
    
    
    """
    FormData 처리를 통해 파일을 업데이트하고, 필요한 데이터를 변환한 후 모델을 수정하는 공통 함수.
    file_fields: 처리할 파일 필드들의 리스트
    directory: 파일이 저장될 디렉토리명
    file_extension: 파일 확장자 (필요시)
    """
    
    file_extension = ""
    M_id = request.GET.get('item_id')
    

    # QueryDict 데이터를 일반 딕셔너리로 변환하면서 파일 필드는 빈 문자열로 처리
    mutable_data = {}

    try:
        for key, value in request.data.items():
            if key in file_fields:
                # 파일 필드는 빈 문자열로 처리 (새 파일이 없을 경우)
                mutable_data[key] = ""
            elif key == 'description':
                try:
                    # description 필드를 리스트로 파싱
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
        print(f"Error processing request data: {str(e)}")
        return Response({"error": f"Failed to process request data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)
    
    

    # 기존 데이터를 업데이트
    for file_field in file_fields:
        uploaded_file = request.FILES.get(file_field)
        if uploaded_file:
            file_path = os.path.join(settings.MEDIA_ROOT, derectory_to_match_file[file_field])
            mutable_data[file_field] = file_path
        else:
            existing_item = model_class.get_exixting_by_id(M_id)
            mutable_data[file_field] = existing_item[file_field] if existing_item else ""
        
    
    # 데이터를 수정
    res = update_file_item(model_class, request, mutable_data, M_id, serializer_class)

    if res:
        # 파일명을 _id값으로 변경 후 파일 저장
        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file:
                save_file(uploaded_file, derectory_to_match_file[file_field], f"{M_id}.{file_extension}" if file_extension else M_id)

        encrypted_id = M_id
        return Response(encrypted_id, status=HTTP_201_CREATED)

    return Response({"error": "Failed to update item."}, status=HTTP_400_BAD_REQUEST)


# 공통 함수 정의
def update_item(model_class, request, item_id, serializer_class):
    return 

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='Symbol')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key, item_id,  # 쿼리 파라미터
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def symbol(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_Symbol, file_fields, 'svg', S100_PR_VisualItemSerializer)


item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='LineStyle')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key, item_id,  # 쿼리 파라미터
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def line_style(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_LineStyle, file_fields, 'svg', S100_PR_VisualItemSerializer)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='AreaFill')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key, item_id,  # 쿼리 파라미터
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def area_fill(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_AreaFill, file_fields, 'area_fill', S100_PR_VisualItemSerializer)


item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='Pixmap')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key, item_id,  # 쿼리 파라미터
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, item_detail_param, preview_type_param, engineering_image_type_param,  # JSON 필드 파라미터
        preview_image_param, engineering_image_param  # 파일 파라미터
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def pixmap(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_Pixmap, file_fields, 'pixmap', S100_PR_VisualItemSerializer)



item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='SymbolSchema')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key,item_id,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def symbol_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['xmlSchema']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_SymbolSchema, file_fields, 'symbol_schema', S100_PR_ItemSchemaSerializer)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='LineStyleSchema')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key,item_id,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def line_style_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['xmlSchema']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_LineStyleSchema, file_fields, 'line_style_schema', S100_PR_ItemSchemaSerializer)



item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='AreaFillSchema')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key,item_id,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def area_fill_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['xmlSchema']
    
    # 여기서 request.data를 이용해
    return handle_file_update(request, PR_AreaFillSchema, file_fields, 'area_fill_schema', S100_PR_ItemSchemaSerializer)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='PixmapSchema')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key,item_id,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def pixmap_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['xmlSchema']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_PixmapSchema, file_fields, 'pixmap_schema', S100_PR_ItemSchemaSerializer)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='ColourProfileSchema')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key,item_id,
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, xml_schema_param
    ],
    consumes=['multipart/form-data']  # multipart/form-data 설정
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])
def colour_profile_schema(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['xmlSchema']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_ColourProfileSchema, file_fields, 'colour_profile_schema', S100_PR_ItemSchemaSerializer)

item_type_param = openapi.Parameter('itemType', openapi.IN_FORM, description='Item type', type=openapi.TYPE_STRING, default='Font')
# API 엔드포인트 - Symbol Item
@swagger_auto_schema(
    method='put',
    manual_parameters=[
        regi_uri, service_key, item_id,  # 쿼리 파라미터
        item_type_param, item_identifier_param, name_param, definition_param, remarks_param, item_status_param, alias_param,
        camel_case_param, definition_source_param, reference_param, similarity_to_source_param, justification_param, proposed_change_param,
        xml_id_param, description_param, font_file_param, font_type_param
    ],
    consumes=['multipart/form-data'],  # multipart/form-data 설정
    request_body=None  # request body를 제외
)
@api_view(['PUT'])
@parser_classes([MultiPartParser])  # MultiPartParser를 사용하여 파일을 처리
def font(request):
    regi_uri = request.GET.get('regi_uri')
    service_key = request.GET.get('service_key')
    validation_response = check_key_validation(service_key, regi_uri)
    if isinstance(validation_response, Response):
        return validation_response
    file_fields = ['fontFile']
    
    # 여기서 request.data를 이용해 처리
    return handle_file_update(request, PR_Font, file_fields, 'font', S100_PR_FontSerializer)

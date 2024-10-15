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

derectory_to_match_file = {
    "previewImage": "preview_image",
    "engineeringImage": "engineering_image",
    "itemDetail": "svg",
    "xmlSchema": "xml",
    "fontFile": "font"
}

def handle_file_data(request, model_class, file_fields, directory, file_extension=None):
    """
    FormData 처리를 통해 파일을 저장하고, 필요한 데이터를 변환한 후 모델에 삽입하는 공통 함수.
    file_fields: 처리할 파일 필드들의 리스트
    directory: 파일이 저장될 디렉토리명
    file_extension: 파일 확장자 (필요시)
    """
    # QueryDict 데이터를 일반 딕셔너리로 변환하면서 파일 필드는 빈 문자열로 처리
    mutable_data = {}

    # QueryDict 데이터를 하나씩 처리
    try:
        for key, value in request.data.items():
            if key in file_fields:
                # 파일 필드는 빈 문자열로 처리
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
                # 나머지 데이터는 그대로 복사
                mutable_data[key] = value
    except Exception as e:
        print(f"Error processing request data: {str(e)}")
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
    res = insert_file_item(model_class, request, mutable_data)

    if res:
        instance_id = res

        # 파일명을 _id값으로 변경 후 파일 저장
        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file:
                save_file(uploaded_file, directory, f"{instance_id}.{file_extension}" if file_extension else instance_id)

        # 암호화된 _id 반환
        encrypted_id = get_encrypted_id([res])
        return Response(encrypted_id, status=HTTP_201_CREATED)

    return Response({"error": "Failed to insert item."}, status=HTTP_400_BAD_REQUEST)



# 공통 파일데이터 삽입 함수
def insert_file_item(model_class, request, data):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)

    ob_id = inserted_["inserted_id"]
    RegiModel.update_date(C_id)
    return ob_id

# 공통 Association 삽입 함수
def insert_association_item(model_class, request, data):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    if data.get("child_id") is not None:
        A_id = decrypt(data["child_id"][0]["encrypted_data"], data.get("child_id")[0].get("iv"))
        inserted_ = model_class.insert(ObjectId(I_id), ObjectId(A_id))
        if inserted_["status"] == "error":
            return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    else:
        return Response("child_id is required.", status=HTTP_400_BAD_REQUEST)
    return Response("successfully inserted.", status=HTTP_201_CREATED)

def handle_visual_data_files(request, model_class):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_file_data(request, model_class, file_fields, 'visual_data')


def handle_schema_data_files(request, model_class):
    file_fields = ['xmlSchema']
    return handle_file_data(request, model_class, file_fields, 'xml')


def handle_font_files(request, model_class):
    file_fields = ['fontFile']
    return handle_file_data(request, model_class, file_fields, 'font', 'ttf')


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
def insert_font(request):
    return handle_font_files(request, FontModel)



# 공통 데이터 삽입 함수
def insert_item(model_class, request, data):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)

    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)


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

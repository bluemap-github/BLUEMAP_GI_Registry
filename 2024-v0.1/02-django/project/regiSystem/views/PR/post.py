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

derectory_to_match_file = {
    "previewImage": "preview_image",
    "engineeringImage": "engineering_image",
    "itemDetail": "svg",
    "xmlSchema": "xml",
    "fontFile": "font"
}

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


# 공통 파일데이터 삽입 함수
def insert_file_item(model_class, request, data):
    
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    inserted_ = model_class.insert(data, ObjectId(C_id))

    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    ob_id = inserted_["inserted_id"]
    RegiModel.update_date(C_id)
    return ob_id




def handle_file_data(request, model_class, file_fields, directory, file_extension, file_db):
    mutable_data = {}

    try:
        # JSON 데이터 형성 및 가공
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

    # insert_file_item을 통해 JSON 데이터를 먼저 저장
    res = insert_file_item(model_class, request, mutable_data)
    print(res)
     
    # res가 Response 객체인지 확인
    if isinstance(res, Response):
        return res  # 에러 Response 반환
    
    if not res:
        return Response({"error": "Failed to insert item."}, status=HTTP_400_BAD_REQUEST)

    instance_id = res

    try:
        # 저장된 데이터 조회
        one_page = file_db.find_one({"_id": ObjectId(str(instance_id))})
        if not one_page:
            return Response({"error": "Failed to find item."}, status=HTTP_400_BAD_REQUEST)

        # 파일 처리 및 경로 업데이트
        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file:
                file_path = os.path.join(settings.MEDIA_ROOT, 
                                       derectory_to_match_file[file_field], 
                                       f"{instance_id}.{file_extension}" if file_extension else instance_id)
                
                save_file(uploaded_file, 
                         derectory_to_match_file[file_field], 
                         f"{instance_id}.{file_extension}" if file_extension else instance_id)
                
                one_page[file_field] = file_path

        # 경로가 포함된 데이터로 업데이트
        update_result = file_db.update_one(
            {"_id": ObjectId(str(instance_id))}, 
            {"$set": one_page}
        )
        
        if not update_result.modified_count:
            return Response({"error": "Failed to update item."}, status=HTTP_400_BAD_REQUEST)

        encrypted_id = get_encrypted_id([instance_id])
        return Response(encrypted_id, status=HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"error": f"Failed to process data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)


from bson.errors import InvalidId 
def handle_visual_file_data(request, model_class, file_fields, file_db):
    mutable_data = {}

    try:
        # JSON 데이터 형성 및 가공
        for key, value in request.data.items():
            if key in file_fields:
                mutable_data[key] = ""  # 경로를 빈 문자열로 설정
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

    # insert_file_item을 통해 JSON 데이터를 먼저 저장
    res = insert_file_item(model_class, request, mutable_data)
    if not res:
        return Response({"error": "Failed to insert item."}, status=HTTP_400_BAD_REQUEST)

    instance_id = res
    fileType = {
        "previewImage": "",
        "engineeringImage": "",
        "itemDetail": "svg"
    }
    file_set_type = {
        "previewImage": "previewType",
        "engineeringImage": "engineeringImageType",
    }
    
    one_page = file_db.find_one(ObjectId(instance_id))
    if not one_page:
        return Response({"error": "Failed to find item."}, status=HTTP_400_BAD_REQUEST)

    for file_field in file_fields:
        uploaded_file = request.FILES.get(file_field)
        if uploaded_file:
            # 파일 확장자 설정
            if file_field != "itemDetail":
                fileType[file_field] = one_page.get(file_set_type[file_field])
            file_path = os.path.join(settings.MEDIA_ROOT, derectory_to_match_file[file_field], f"{instance_id}.{fileType[file_field]}")
            save_file(uploaded_file, derectory_to_match_file[file_field], f"{instance_id}.{fileType[file_field]}" if fileType[file_field] else instance_id)
            one_page[file_field] = file_path
    
    print("들어와")
    # 경로가 포함된 데이터로 업데이트
    print(one_page)
    res = file_db.update_one({"_id": ObjectId(instance_id)}, {"$set": one_page})
    if not res:
        return Response({"error": "Failed to update item."}, status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([instance_id])
    return Response(encrypted_id, status=201)


from mongo_driver import db
Symbol_File = db['S100_Portrayal_Symbol']
LineStyle_File = db['S100_Portrayal_LineStyle']
AreaFill_File = db['S100_Portrayal_AreaFill']
Pixmap_File = db['S100_Portrayal_Pixmap']
SymbolSchema_File = db['S100_Portrayal_SymbolSchema']
LineStyleSchema_File = db['S100_Portrayal_LineStyleSchema']
AreaFillSchema_File = db['S100_Portrayal_AreaFillSchema']
PixmapSchema_File = db['S100_Portrayal_PixmapSchema']
ColourProfileSchema_File = db['S100_Portrayal_ColourProfileSchema']
Font_File = db['S100_Portrayal_Font']


def handle_schema_data_files(request, model_class, file_db):
    file_fields = ['xmlSchema']
    return handle_file_data(request, model_class, file_fields, 'xml', 'xml', file_db)


def handle_font_files(request, model_class, file_db):
    file_fields = ['fontFile']
    return handle_file_data(request, model_class, file_fields, 'font', 'ttf', file_db)


@api_view(['POST'])
def insert_symbol_item(request):
    return handle_visual_data_files(request, SymbolModel, Symbol_File)

@api_view(['POST'])
def insert_line_style_item(request):
    return handle_visual_data_files(request, LineStyleModel, LineStyle_File)

@api_view(['POST'])
def insert_area_fill_item(request):
    return handle_visual_data_files(request, AreaFillModel, AreaFill_File)

@api_view(['POST'])
def insert_pixmap_item(request):
    return handle_visual_data_files(request, PixmapModel, Pixmap_File)

@api_view(['POST'])
def insert_symbol_schema(request):
    return handle_schema_data_files(request, SymbolSchemaModel, SymbolSchema_File)

@api_view(['POST'])
def insert_line_style_schema(request):
    return handle_schema_data_files(request, LineStyleSchemaModel, LineStyleSchema_File)

@api_view(['POST'])
def insert_area_fill_schema(request):
    return handle_schema_data_files(request, AreaFillSchemaModel, AreaFillSchema_File)

@api_view(['POST'])
def insert_pixmap_schema(request):
    return handle_schema_data_files(request, PixmapSchemaModel, PixmapSchema_File)

@api_view(['POST'])
def insert_colour_profile_schema(request):
    return handle_schema_data_files(request, ColourProfileSchemaModel, ColourProfileSchema_File)

@api_view(['POST'])
def insert_font(request):
    return handle_font_files(request, FontModel, Font_File)



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

def handle_visual_data_files(request, model_class, file_db):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']

    return handle_visual_file_data(request, model_class, file_fields, file_db)


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
    item_iv = request.GET.get('item_iv')
    if not item_iv:
        data = request.data
        I_id = data.get('parent_id')
        if data.get("child_id") is not None:
            A_id = decrypt(data["child_id"]["encrypted_data"], data.get("child_id").get("iv"))
            inserted_ = MessageAssociation.insert(ObjectId(I_id), ObjectId(A_id))
            if inserted_["status"] == "error":
                return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
            return Response("successfully inserted.", status=HTTP_201_CREATED)
        else:
            return Response("child_id is required.", status=HTTP_400_BAD_REQUEST)
    return insert_association_item(MessageAssociation, request, request.data)

@api_view(['POST'])
def insert_highlight_association(request):
    data = request.data
    I_id = data.get('parent_id')
    if data.get("child_id") is not None:
        A_id = decrypt(data["child_id"]["encrypted_data"], data.get("child_id").get("iv"))
        inserted_ = HighlightAssociation.insert(ObjectId(I_id), ObjectId(A_id))
        if inserted_["status"] == "error":
            return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
        return Response("successfully inserted.", status=HTTP_201_CREATED)
    else:
        return Response("child_id is required.", status=HTTP_400_BAD_REQUEST)


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

from regiSystem.serializers.PR import S100_PR_AlertInfoSerializer
from regiSystem.models.PR_Class import AlertInfoModel

@api_view(['POST'])
def insert_alert_info(request):
    # regi_uri에서 C_id 추출
    regi_uri = request.GET.get('regi_uri')
    if not regi_uri:
        return Response({"status": "error", "message": "Missing regi_uri"}, status=HTTP_400_BAD_REQUEST)
    
    C_id = uri_to_serial(regi_uri)  # C_id 변환
    if not C_id:
        return Response({"status": "error", "message": "Invalid regi_uri"}, status=HTTP_400_BAD_REQUEST)

    data = request.data

    # 모델의 insert 메서드 호출
    result = AlertInfoModel.insert(data, C_id)

    # 삽입 결과 확인
    if result.get("status") == "success":
        return Response({"status": "success", "inserted_id": result["inserted_id"]}, status=HTTP_201_CREATED)
    else:
        return Response({"status": "error", "errors": result.get("errors") or result.get("message")}, status=HTTP_400_BAD_REQUEST)
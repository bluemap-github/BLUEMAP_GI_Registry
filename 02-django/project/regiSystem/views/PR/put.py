from bson.objectid import ObjectId
from regiSystem.models.PR_Class import (
    ColourTokenModel, PaletteItemModel, ColourPaletteModel,
    DisplayPlaneModel, DisplayModeModel, ViewingGroupLayerModel, ViewingGroupModel,
    ContextParameterModel, DrawingPriorityModel, AlertModel, AlertHighlightModel, AlertMessageModel
    )
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK
from regiSystem.info_sec.encryption import decrypt
from regiSystem.info_sec.getByURI import uri_to_serial

def update_item(request, model):
    """
    공통적으로 PUT 요청을 처리하는 함수.
    `model` 파라미터로 처리할 모델을 받음.
    """
    item_iv = request.GET.get('item_iv')
    M_id = decrypt(request.GET.get('item_id'), item_iv)

    # 모델의 put 메서드를 호출
    result = model.put(M_id, request.data, C_id=uri_to_serial(request.GET.get('regi_uri')))
    if result["status"] == "error":
        return Response(result["errors"], status=HTTP_400_BAD_REQUEST)
    
    return Response(result, status=HTTP_201_CREATED)

@api_view(['PUT'])
def update_colour_token(request):
    return update_item(request, ColourTokenModel)

@api_view(['PUT'])
def update_palette_item(request):
    return update_item(request, PaletteItemModel)

@api_view(['PUT'])
def update_colour_palette(request):
    return update_item(request, ColourPaletteModel)

@api_view(['PUT'])
def update_display_plane(request):
    return update_item(request, DisplayPlaneModel)

@api_view(['PUT'])
def update_display_mode(request):
    return update_item(request, DisplayModeModel)

@api_view(['PUT'])
def update_viewing_group_layer(request):
    return update_item(request, ViewingGroupLayerModel)

@api_view(['PUT'])
def update_viewing_group(request):
    return update_item(request, ViewingGroupModel)

@api_view(['PUT'])
def update_context_parameter(request):
    return update_item(request, ContextParameterModel)

@api_view(['PUT'])
def update_drawing_priority(request):
    return update_item(request, DrawingPriorityModel)

@api_view(['PUT'])
def update_alert(request):
    return update_item(request, AlertModel)

@api_view(['PUT'])
def update_alert_highlight(request):
    return update_item(request, AlertHighlightModel)

@api_view(['PUT'])
def update_alert_message(request):
    return update_item(request, AlertMessageModel)



"""
    파일 수정 함수들
"""
from regiSystem.models.Concept import RegiModel
from regiSystem.models.PR_Class import FontModel
from regiSystem.info_sec.encryption import get_encrypted_id
from regiSystem.info_sec.getByURI import uri_to_serial
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from regiSystem.info_sec.encryption import decrypt
import os
import json
from django.conf import settings
from bson.objectid import ObjectId


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


import json
from bson import ObjectId
from django.conf import settings

def handle_file_update(request, model_class, file_fields, directory, file_extension, file_db, serializer):
    item_iv = request.GET.get('item_iv')
    M_id = decrypt(request.GET.get('item_id'), item_iv)

    mutable_data = {}
    print(request.data)  # 첫 번째 출력

    try:
        for key, value in request.data.items():
            if key in file_fields:
                # 파일 필드는 빈 문자열로 설정하지 않고 넘어갑니다.
                continue
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

        print(mutable_data, "mutable_data")  # 두 번째 출력

    except Exception as e:
        return Response({"error": f"Failed to process request data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)

    updated_ = model_class.update(M_id, mutable_data, uri_to_serial(request.GET.get('regi_uri')), serializer)
    if not updated_:
        return Response({"error": "Item not found."}, status=HTTP_404_NOT_FOUND)

    try:
        one_page = file_db.find_one({"_id": ObjectId(M_id)})
        if not one_page:
            return Response({"error": "Failed to find item."}, status=HTTP_404_NOT_FOUND)

        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file is not None:
                file_path = os.path.join(
                    settings.MEDIA_ROOT,
                    directory,
                    f"{M_id}.{file_extension}" if file_extension else M_id
                )
                
                save_file(
                    uploaded_file,
                    directory,
                    f"{M_id}.{file_extension}" if file_extension else M_id
                )
                
                one_page[file_field] = file_path
            else:
                # 파일이 없을 경우 기존 경로 유지
                one_page[file_field] = one_page.get(file_field)

        update_result = file_db.update_one(
            {"_id": ObjectId(M_id)},
            {"$set": one_page}
        )

        if update_result.matched_count > 0:
            return Response({"status": "success", "updated_id": str(M_id)}, status=HTTP_200_OK)
        else:
            return Response({"error": "Item not found."}, status=HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": f"Failed to process data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)


derectory_to_match_file = {
    "previewImage": "preview_image",
    "engineeringImage": "engineering_image",
    "itemDetail": "svg",
    "xmlSchema": "xml",
    "fontFile": "font"
}

def handle_visual_file_update(request, model_class, file_fields, directory, file_db):
    # item_id와 iv 값을 이용해 기존 아이템을 찾음
    item_iv = request.GET.get('item_iv')
    M_id = decrypt(request.GET.get('item_id'), item_iv)

    mutable_data = {}

    try:
        for key, value in request.data.items():
            if key in file_fields:
                # 파일 필드는 기존 값 유지하도록 넘어감
                continue
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

    # update_file_item을 통해 JSON 데이터를 먼저 업데이트
    print(mutable_data, "mutable_data")
    print(uri_to_serial(request.GET.get('regi_uri')))
    print(request.GET)
    updated_ = model_class.update(M_id, mutable_data, uri_to_serial(request.GET.get('regi_uri')))
    if not updated_:
        return Response({"error": "Item not found."}, status=HTTP_404_NOT_FOUND)
    print(updated_, "됨?는거야?")
    
    fileType = {
        "previewImage": "",
        "engineeringImage": "",
        "itemDetail": "svg"
    }
    file_set_type = {
        "previewImage": "previewType",
        "engineeringImage": "engineeringImageType",
    }

    # 파일 처리 및 경로 업데이트
    try:
        # 기존 데이터 조회
        one_page = file_db.find_one({"_id": ObjectId(M_id)})
        if not one_page:
            return Response({"error": "Failed to find item."}, status=HTTP_404_NOT_FOUND)

        # 기존 데이터에 새 데이터 병합
        updated_data = one_page.copy()
        updated_data.update(mutable_data)

        # 업로드된 각 파일을 저장하고 파일 경로를 업데이트
        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file:
                # 파일 확장자 설정
                if file_field != "itemDetail":
                    fileType[file_field] = updated_data.get(file_set_type[file_field], "")

                # 파일 경로 설정
                file_path = os.path.join(
                    settings.MEDIA_ROOT,
                    derectory_to_match_file[file_field], 
                    f"{M_id}.{fileType[file_field]}" if fileType[file_field] else M_id
                )

                # 파일 저장
                save_file(
                    uploaded_file,
                    derectory_to_match_file[file_field], 
                    f"{M_id}.{fileType[file_field]}" if fileType[file_field] else M_id
                )

                # 저장된 파일 경로 업데이트
                updated_data[file_field] = file_path
            else:
                # 파일이 업로드되지 않은 경우 기존 파일 경로 유지
                updated_data[file_field] = one_page.get(file_field)

        print(updated_data, "updated_data")
        updated_data['concept_id'] = ObjectId(updated_data['concept_id'])

        # 업데이트된 데이터를 데이터베이스에 반영
        update_result = file_db.update_one(
            {"_id": ObjectId(M_id)},
            {"$set": updated_data}
        )

        # 문서가 존재하는 경우 성공 응답 반환
        if update_result.matched_count > 0:
            return Response({"status": "success", "updated_id": get_encrypted_id([M_id])}, status=HTTP_200_OK)
        else:
            # 문서를 찾지 못한 경우
            return Response({"error": "Item not found."}, status=HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": f"Failed to process data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)



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


# 공통 파일 데이터 업데이트 함수
def update_file_item(model_class, request, data, M_id):
    print("update_file_item")
    print("update_file_item")
    print("update_file_item")
    print(data)
    
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    updated_ = model_class.update(M_id, data, ObjectId(C_id))
    if updated_["status"] == "error":
        return Response(updated_["errors"], status=HTTP_400_BAD_REQUEST)
    
    RegiModel.update_date(C_id)
    
    # return M_id
    return Response(updated_["errors"], status=HTTP_400_BAD_REQUEST)


from regiSystem.models.PR_Class import (
    SymbolModel, LineStyleModel, AreaFillModel, PixmapModel
)
@api_view(['PUT'])
def update_symbol(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_visual_file_update(request, SymbolModel, file_fields, 'symbol', Symbol_File)

@api_view(['PUT'])
def update_line_style(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_visual_file_update(request, LineStyleModel, file_fields, 'line_style', LineStyle_File)

@api_view(['PUT'])
def update_area_fill(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_visual_file_update(request, AreaFillModel, file_fields, 'area_fill', AreaFill_File)

@api_view(['PUT'])
def update_pixmap(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_visual_file_update(request, PixmapModel, file_fields, 'pixmap', Pixmap_File)

from regiSystem.serializers.PR import S100_PR_FontSerializer, S100_PR_ItemSchemaSerializer

def handle_font_update(request, model_class):
    file_fields = ['fontFile']
    return handle_file_update(request, model_class, file_fields, 'font', 'ttf', Font_File, S100_PR_FontSerializer)


@api_view(['PUT'])
def update_font(request):
    return handle_font_update(request, FontModel)

from regiSystem.models.PR_Class import (
    LineStyleSchemaModel, SymbolSchemaModel, AreaFillSchemaModel,
    ColourProfileSchemaModel, PixmapSchemaModel
)
@api_view(['PUT'])
def update_line_style_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, LineStyleSchemaModel, file_fields, 'xml', 'xml', LineStyleSchema_File, S100_PR_ItemSchemaSerializer)
from rest_framework.response import Response
from bson import ObjectId
import os
import json

def handle_xml_file_update(request, model_class, file_fields, directory, file_extension, file_db, serializer):
    """
    XML 파일을 업데이트하고, 필요한 데이터를 변환한 후 모델을 수정하는 공통 함수.
    """
    # item_id 복호화
    item_iv = request.GET.get('item_iv')
    M_id = decrypt(request.GET.get('item_id'), item_iv)

    mutable_data = {}
    print(request.data)  # 첫 번째 출력

    try:
        # request.data를 순회하며 각 필드를 mutable_data에 저장
        for key, value in request.data.items():
            if key in file_fields:
                # 파일 필드는 빈 문자열로 설정하지 않고 넘어갑니다.
                continue
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
                # 기타 필드는 그대로 저장
                mutable_data[key] = value

        print(mutable_data, "mutable_data")  # 두 번째 출력

    except Exception as e:
        return Response({"error": f"Failed to process request data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)

    # 모델 업데이트
    updated_ = model_class.update(M_id, mutable_data, uri_to_serial(request.GET.get('regi_uri')))
    if not updated_:
        return Response({"error": "Item not found."}, status=HTTP_404_NOT_FOUND)

    try:
        # 기존 데이터 조회
        one_page = file_db.find_one({"_id": ObjectId(M_id)})
        if not one_page:
            return Response({"error": "Failed to find item."}, status=HTTP_404_NOT_FOUND)

        # 업로드된 각 파일을 저장하고 파일 경로를 업데이트
        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file is not None:
                # 파일 경로 설정
                file_path = os.path.join(
                    settings.MEDIA_ROOT,
                    directory,
                    f"{M_id}.{file_extension}" if file_extension else M_id
                )
                
                # 파일 저장
                save_file(
                    uploaded_file,
                    directory,
                    f"{M_id}.{file_extension}" if file_extension else M_id
                )
                
                # 저장된 파일 경로 업데이트
                one_page[file_field] = file_path
            else:
                # 파일이 없을 경우 기존 경로 유지
                one_page[file_field] = one_page.get(file_field)

        # MongoDB에 업데이트된 데이터를 반영
        update_result = file_db.update_one(
            {"_id": ObjectId(M_id)},
            {"$set": one_page}
        )

        # 업데이트 성공 여부 확인
        if update_result.matched_count > 0:
            return Response({"status": "success", "updated_id": str(M_id)}, status=HTTP_200_OK)
        else:
            return Response({"error": "Item not found."}, status=HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": f"Failed to process data: {str(e)}"}, status=HTTP_400_BAD_REQUEST)


from regiSystem.models.PR_Class import (
    LineStyleSchemaModel, SymbolSchemaModel, AreaFillSchemaModel,
    ColourProfileSchemaModel, PixmapSchemaModel
)
@api_view(['PUT'])
def update_line_style_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, LineStyleSchemaModel, file_fields, 'xml', 'xml', LineStyleSchema_File, S100_PR_ItemSchemaSerializer)


@api_view(['PUT'])
def update_symbol_schema(request):
    file_fields = ['xmlSchema']
    return handle_xml_file_update(request, SymbolSchemaModel, file_fields, 'xml', 'xml', SymbolSchema_File, S100_PR_ItemSchemaSerializer)

@api_view(['PUT'])
def update_area_fill_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, AreaFillSchemaModel, file_fields, 'xml', 'xml', AreaFillSchema_File, S100_PR_ItemSchemaSerializer)

@api_view(['PUT'])
def update_colour_profile_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, ColourProfileSchemaModel, file_fields, 'xml', 'xml', ColourProfileSchema_File, S100_PR_ItemSchemaSerializer)

@api_view(['PUT'])
def update_pixmap_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, PixmapSchemaModel, file_fields, 'xml', 'xml', PixmapSchema_File, S100_PR_ItemSchemaSerializer)





from regiSystem.models.PR_Association import (
    SymbolAssociation, IconAssociation, ItemSchemaAssociation, ColourTokenAssociation,
    PaletteAssociation, DisplayModeAssociation, ViewingGroupAssociation,
    HighlightAssociation, MessageAssociation, PR_Association, ValueAssociation
)
from bson.objectid import ObjectId

# 공통 로직 함수
def update_association(request, AssociationClass):
    print(AssociationClass)
    item_iv = request.GET.get('item_iv')
    if not item_iv:
        item_id = request.GET.get('item_id')
    else: 
        item_id = decrypt(request.GET.get('item_id'), item_iv)

    associations = request.data.get('associations')

    # 먼저 모든 기존의 어소시에이션 삭제
    AssociationClass.delete(item_id, "parent_id")

    # 새로운 어소시에이션 삽입
    for association in associations:
        child_id = association.get('child_id')
        child_iv = association.get('child_iv')
        if child_id and child_iv:
            child_id = decrypt(child_id, child_iv)
            AssociationClass.insert(ObjectId(item_id), ObjectId(child_id))

    return Response({"status": "success"}, status=HTTP_201_CREATED)

# 각 어소시에이션 타입별로 공통 로직을 호출
@api_view(['PUT'])
def update_colour_token_association(request):
    return update_association(request, ColourTokenAssociation)

@api_view(['PUT'])
def update_symbol_association(request):
    return update_association(request, SymbolAssociation)

@api_view(['PUT'])
def update_icon_association(request):
    return update_association(request, IconAssociation)

@api_view(['PUT'])
def update_viewing_group_association(request):
    return update_association(request, ViewingGroupAssociation)

@api_view(['PUT'])
def update_item_schema_association(request):
    return update_association(request, ItemSchemaAssociation)

@api_view(['PUT'])
def update_palette_association(request):
    return update_association(request, PaletteAssociation)

@api_view(['PUT'])
def update_display_mode_association(request):
    return update_association(request, DisplayModeAssociation)

@api_view(['PUT'])
def update_message_association(request):
    return update_association(request, MessageAssociation)
    # item_type = request.GET.get('item_type')
    # # print(item_type)
    # # if item_type != 'AlertInfo':
    # #     return Response({"error": "Invalid item type."}, status=HTTP_400_BAD_REQUEST)
    # # print("??????????")
    # data = request.data.get('associations')[0]
    # # print(data, "??????????")
    # parent_id = data.get('parent_id')
    # child_id = decrypt(data.get('child_id').get('encrypted_data'), data.get('child_id').get('iv'))
    # data['child_id'] = child_id
    # result = MessageAssociation.update(parent_id, child_id)
    # if result["status"] == "error":
    #     return Response(result["errors"], status=HTTP_400_BAD_REQUEST)
    # return Response(result, status=HTTP_201_CREATED)



@api_view(['PUT'])
def update_highlight_association(request):
    return update_association(request, HighlightAssociation)
    # item_type = request.GET.get('item_type')
    # if item_type != 'AlertInfo':
    #     return Response({"error": "Invalid item type."}, status=HTTP_400_BAD_REQUEST)
    # data = request.data
    # parent_id = data.get('parent_id')
    # child_id = decrypt(data.get('child_id').get('encrypted_data'), data.get('child_id').get('iv'))
    # data['child_id'] = child_id
    # result = HighlightAssociation.update(parent_id, child_id)
    # if result["status"] == "error":
    #     return Response(result["errors"], status=HTTP_400_BAD_REQUEST)
    # return Response(result, status=HTTP_201_CREATED)
    

@api_view(['PUT'])
def update_value_association(request):
    return update_association(request, ValueAssociation)

from regiSystem.models.PR_Class import AlertInfoModel
@api_view(['PUT'])
def update_alert_info(request):
    item_id = request.GET.get('item_id')
    C_id = request.data.get('concept_id')
    result = AlertInfoModel.update(item_id, request.data, C_id)
    if result["status"] == "error":
        return Response(result["errors"], status=HTTP_400_BAD_REQUEST)
    return Response(result, status=HTTP_201_CREATED)

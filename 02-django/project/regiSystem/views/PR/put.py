from bson.objectid import ObjectId
from regiSystem.models.PR_Class import (
    ColourTokenModel, PaletteItemModel, ColourPaletteModel,
    DisplayPlaneModel, DisplayModeModel, ViewingGroupLayerModel, ViewingGroupModel,
    ContextParameterModel, DrawingPriorityModel, AlertModel, AlertHighlightModel, AlertMessageModel
    )
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
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


def handle_file_update(request, model_class, file_fields, directory, file_extension=None):
    
    
    """
    FormData 처리를 통해 파일을 업데이트하고, 필요한 데이터를 변환한 후 모델을 수정하는 공통 함수.
    file_fields: 처리할 파일 필드들의 리스트
    directory: 파일이 저장될 디렉토리명
    file_extension: 파일 확장자 (필요시)
    """
    item_iv = request.GET.get('item_iv')
    M_id = decrypt(request.GET.get('item_id'), item_iv)
    

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
            file_path = os.path.join(settings.MEDIA_ROOT, directory)
            mutable_data[file_field] = file_path
        else:
            existing_item = model_class.get_exixting_by_id(M_id)
            mutable_data[file_field] = existing_item[file_field] if existing_item else ""
        
    
    # 데이터를 수정
    res = update_file_item(model_class, request, mutable_data, M_id)

    if res:
        # 파일명을 _id값으로 변경 후 파일 저장
        for file_field in file_fields:
            uploaded_file = request.FILES.get(file_field)
            if uploaded_file:
                save_file(uploaded_file, directory, f"{M_id}.{file_extension}" if file_extension else M_id)

        # 암호화된 _id 반환
        encrypted_id = get_encrypted_id([M_id])
        return Response(encrypted_id, status=HTTP_201_CREATED)

    return Response({"error": "Failed to update item."}, status=HTTP_400_BAD_REQUEST)


# 공통 파일 데이터 업데이트 함수
def update_file_item(model_class, request, data, M_id):
    
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    updated_ = model_class.update(M_id, data, ObjectId(C_id))
    if updated_["status"] == "error":
        return Response(updated_["errors"], status=HTTP_400_BAD_REQUEST)
    
    RegiModel.update_date(C_id)
    
    return M_id


def handle_font_update(request, model_class):
    file_fields = ['fontFile']
    return handle_file_update(request, model_class, file_fields, 'font', 'ttf')


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
    return handle_file_update(request, LineStyleSchemaModel, file_fields, 'xml', 'xml')

@api_view(['PUT'])
def update_symbol_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, SymbolSchemaModel, file_fields, 'xml', 'xml')

@api_view(['PUT'])
def update_area_fill_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, AreaFillSchemaModel, file_fields, 'xml', 'xml')

@api_view(['PUT'])
def update_colour_profile_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, ColourProfileSchemaModel, file_fields, 'xml', 'xml')

@api_view(['PUT'])
def update_pixmap_schema(request):
    file_fields = ['xmlSchema']
    return handle_file_update(request, PixmapSchemaModel, file_fields, 'xml', 'xml')


from regiSystem.models.PR_Class import (
    SymbolModel, LineStyleModel, AreaFillModel, PixmapModel
)
@api_view(['PUT'])
def update_symbol(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_file_update(request, SymbolModel, file_fields, 'symbol')

@api_view(['PUT'])
def update_line_style(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_file_update(request, LineStyleModel, file_fields, 'line_style')

@api_view(['PUT'])
def update_area_fill(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_file_update(request, AreaFillModel, file_fields, 'area_fill')

@api_view(['PUT'])
def update_pixmap(request):
    file_fields = ['previewImage', 'engineeringImage', 'itemDetail']
    return handle_file_update(request, PixmapModel, file_fields, 'pixmap')


from regiSystem.models.PR_Association import (
    SymbolAssociation, IconAssociation, ItemSchemaAssociation, ColourTokenAssociation,
    PaletteAssociation, DisplayModeAssociation, ViewingGroupAssociation,
    HighlightAssociation, MessageAssociation, PR_Association
)
from bson.objectid import ObjectId

# 공통 로직 함수
def update_association(request, AssociationClass):
    item_iv = request.GET.get('item_iv')
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
    item_type = request.GET.get('item_type')
    if item_type != 'AlertInfo':
        return Response({"error": "Invalid item type."}, status=HTTP_400_BAD_REQUEST)
    data = request.data
    parent_id = data.get('parent_id')
    child_id = decrypt(data.get('child_id').get('encrypted_data'), data.get('child_id').get('iv'))
    data['child_id'] = child_id
    result = MessageAssociation.update(parent_id, child_id)
    if result["status"] == "error":
        return Response(result["errors"], status=HTTP_400_BAD_REQUEST)
    return Response(result, status=HTTP_201_CREATED)



@api_view(['PUT'])
def update_highlight_association(request):
    item_type = request.GET.get('item_type')
    if item_type != 'AlertInfo':
        return Response({"error": "Invalid item type."}, status=HTTP_400_BAD_REQUEST)
    data = request.data
    parent_id = data.get('parent_id')
    child_id = decrypt(data.get('child_id').get('encrypted_data'), data.get('child_id').get('iv'))
    data['child_id'] = child_id
    result = HighlightAssociation.update(parent_id, child_id)
    if result["status"] == "error":
        return Response(result["errors"], status=HTTP_400_BAD_REQUEST)
    return Response(result, status=HTTP_201_CREATED)
    

@api_view(['PUT'])
def update_value_association(request):
    return update_association(request, PR_Association)

from regiSystem.models.PR_Class import AlertInfoModel
@api_view(['PUT'])
def update_alert_info(request):
    item_id = request.GET.get('item_id')
    C_id = request.data.get('concept_id')
    result = AlertInfoModel.update(item_id, request.data, C_id)
    if result["status"] == "error":
        return Response(result["errors"], status=HTTP_400_BAD_REQUEST)
    return Response(result, status=HTTP_201_CREATED)

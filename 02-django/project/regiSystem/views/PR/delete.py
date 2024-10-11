from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.info_sec.encryption import decrypt
import os

from regiSystem.models.PR_Class import (
    SymbolModel, SymbolSchemaModel, LineStyleSchemaModel, AreaFillSchemaModel, PixmapSchemaModel, ColourProfileSchemaModel,
    ColourTokenModel, ColourPaletteModel, PaletteItemModel, DisplayModeModel, ViewingGroupModel, ViewingGroupLayerModel,
    AlertHighlightModel, AlertMessageModel, RE_RegisterItemModel
)
from regiSystem.models.PR_Association import (
    SymbolAssociation, IconAssociation, ItemSchemaAssociation, ColourTokenAssociation,
    PaletteAssociation, DisplayModeAssociation, ViewingGroupAssociation,
    HighlightAssociation, MessageAssociation, PR_Association
)
from regiSystem.models.Concept import ManagementInfoModel

# 모델과 필드명을 매칭하는 딕셔너리
model_with_text = {
    "token": ColourTokenAssociation,
    "schema": ItemSchemaAssociation,
    "icon": IconAssociation,
    "symbol": SymbolAssociation,
    "paletteItem": PaletteAssociation,
    "colourPalette": PaletteAssociation,
    "displayMode": DisplayModeAssociation,
    "viewingGroupLayer": ViewingGroupAssociation,
    "alertMessage": MessageAssociation,
    "viewingGroup": ViewingGroupAssociation,
    "highlight": HighlightAssociation
}

# 삭제해야 할 association 리스트
from regiSystem.models.PR_Class import (
    SymbolModel, SymbolSchemaModel, LineStyleSchemaModel, AreaFillSchemaModel, PixmapSchemaModel, ColourProfileSchemaModel,
    ColourTokenModel, ColourPaletteModel, PaletteItemModel, DisplayModeModel, ViewingGroupModel, ViewingGroupLayerModel,
    AlertHighlightModel, AlertMessageModel, RE_RegisterItemModel
)
association_list = {
    "Symbol": {"parent_id": ["token", "schema"], "child_id": ["icon", "symbol"], "main": SymbolModel},
    "LineStyle": {"parent_id": ["token", "schema"], "child_id": ["symbol"], "main": LineStyleSchemaModel},
    "AreaFill": {"parent_id": ["token", "schema"], "child_id": ["symbol"], "main": AreaFillSchemaModel},
    "Pixmap": {"parent_id": ["token", "schema"], "child_id": [], "main": PixmapSchemaModel},
    "SymbolSchema": {"parent_id": ["schema"], "child_id": [], "main": SymbolSchemaModel},
    "LineStyleSchema": {"parent_id": ["schema"], "child_id": [], "main": LineStyleSchemaModel},
    "AreaFillSchema": {"parent_id": ["schema"], "child_id": [], "main": AreaFillSchemaModel},
    "ColourProfileSchema": {"parent_id": ["schema"], "child_id": [], "main": ColourProfileSchemaModel},
    "PixmapSchema": {"parent_id": ["schema"], "child_id": [], "main": PixmapSchemaModel},
    "ColourToken": {"parent_id": ["paletteItem"], "child_id": ["token"], "main": ColourTokenModel},
    "ColourPalette": {"parent_id": [], "child_id": ["colourPalette"], "main": ColourPaletteModel},
    "PaletteItem": {"parent_id": ["colourPalette"], "child_id": ["paletteItem"], "main": PaletteItemModel},
    "DisplayMode": {"parent_id": [], "child_id": ["displayMode"], "main": DisplayModeModel},
    "ViewingGroup": {"parent_id": ["viewingGroupLayer"], "child_id": [], "main": ViewingGroupModel},
    "ViewingGroupLayer": {"parent_id": ["displayMode"], "child_id": ["viewingGroupLayer"], "main": ViewingGroupLayerModel},
    "AlertHighlight": {"parent_id": ["alertMessage", "viewingGroup"], "child_id": [], "main": AlertHighlightModel},
    "AlertMessage": {"parent_id": ["symbol"], "child_id": ["alertMessage"], "main": AlertMessageModel}
}


# decrypt 중복 로직을 공통 함수로 분리
def decrypt_item_id(request):
    I_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), I_iv)
    return I_id

# 공통 삭제 처리 함수
def delete_association(request, item_type):
    I_id = decrypt_item_id(request)  # 공통 함수 호출

    if item_type in association_list:
        for ids in ["parent_id", "child_id"]:
            for model in association_list[item_type][ids]:
                association_class = model_with_text[model]  # 연결된 Association 클래스 가져오기
                result = association_class.delete(I_id, ids)  # 클래스 메서드 호출
                print(f"Deleting {model}: {result}")

    return Response(f"{item_type} deleted")

# MI 삭제 처리 함수
def delete_MI(request, item_type):
    I_id = decrypt_item_id(request)  # 공통 함수 호출
    result = ManagementInfoModel.delete(I_id)  # 모든 엔드포인트에서 적용될 삭제
    print(f"Deleting Management Info: {result}")
    return Response(f"{item_type} deleted")

# 파일 삭제 함수
def delete_files(file_paths):
    for file_path in file_paths:
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)  # 파일 삭제
                print(f"Deleted file: {file_path}")
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")
        else:
            print(f"File not found or invalid: {file_path}")

@api_view(['DELETE'])
def delete_symbol(request):
    # 1. 아이템 ID를 decrypt 해서 가져온다
    M_Id = decrypt_item_id(request)
    
    # 2. Management Info 및 Association 삭제
    delete_association(request, "Symbol")
    delete_MI(request, "Symbol")

    # 3. 파일 삭제
    main_model = association_list["Symbol"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    preview_image_path = document.get('previewImage')
    engineering_image_path = document.get('engineeringImage')
    item_detail_path = document.get('itemDetail')
    delete_files([preview_image_path, engineering_image_path, item_detail_path])

    # 4. 메인 아이템 삭제
    main_model.delete(M_Id)

    return Response(f"Symbol with ID {M_Id} deleted")


@api_view(['DELETE'])
def delete_line_style(request):
    delete_association(request, "LineStyle")
    return delete_MI(request, "LineStyle")

@api_view(['DELETE'])
def delete_area_fill(request):
    delete_association(request, "AreaFill")
    return delete_MI(request, "AreaFill")

@api_view(['DELETE'])
def delete_pixmap(request):
    delete_association(request, "Pixmap")
    return delete_MI(request, "Pixmap")

@api_view(['DELETE'])
def delete_symbol_schema(request):
    delete_association(request, "SymbolSchema")
    return delete_MI(request, "SymbolSchema")

@api_view(['DELETE'])
def delete_line_style_schema(request):
    delete_association(request, "LineStyleSchema")
    return delete_MI(request, "LineStyleSchema")

@api_view(['DELETE'])
def delete_area_fill_schema(request):
    delete_association(request, "AreaFillSchema")
    return delete_MI(request, "AreaFillSchema")

@api_view(['DELETE'])
def delete_colour_profile_schema(request):
    delete_association(request, "ColourProfileSchema")
    return delete_MI(request, "ColourProfileSchema")

@api_view(['DELETE'])
def delete_pixmap_schema(request):
    delete_association(request, "PixmapSchema")
    return delete_MI(request, "PixmapSchema")

@api_view(['DELETE'])
def delete_colour_token(request):
    delete_association(request, "ColourToken")
    return delete_MI(request, "ColourToken")

@api_view(['DELETE'])
def delete_colour_palette(request):
    delete_association(request, "ColourPalette")
    return delete_MI(request, "ColourPalette")

@api_view(['DELETE'])
def delete_palette_item(request):
    delete_association(request, "PaletteItem")
    return delete_MI(request, "PaletteItem")

@api_view(['DELETE'])
def delete_display_mode(request):
    delete_association(request, "DisplayMode")
    return delete_MI(request, "DisplayMode")

@api_view(['DELETE'])
def delete_viewing_group(request):
    delete_association(request, "ViewingGroup")
    return delete_MI(request, "ViewingGroup")

@api_view(['DELETE'])
def delete_viewing_group_layer(request):
    delete_association(request, "ViewingGroupLayer")
    return delete_MI(request, "ViewingGroupLayer")

@api_view(['DELETE'])
def delete_alert_highlight(request):
    delete_association(request, "AlertHighlight")
    return delete_MI(request, "AlertHighlight")

@api_view(['DELETE'])
def delete_alert_message(request):
    delete_association(request, "AlertMessage")
    return delete_MI(request, "AlertMessage")

# 기타 삭제 엔드포인트 (Management Info 삭제만 적용)
@api_view(['DELETE'])
def delete_display_plane(request):
    return delete_MI(request, "DisplayPlane")

@api_view(['DELETE'])
def delete_font(request):
    return delete_MI(request, "Font")

@api_view(['DELETE'])
def delete_context_parameter(request):
    return delete_MI(request, "ContextParameter")

@api_view(['DELETE'])
def delete_drawing_priority(request):
    return delete_MI(request, "DrawingPriority")

@api_view(['DELETE'])
def delete_alert(request):
    return delete_MI(request, "Alert")
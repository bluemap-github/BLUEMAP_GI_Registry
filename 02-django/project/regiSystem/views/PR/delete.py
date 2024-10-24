from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.info_sec.encryption import decrypt
import os

from regiSystem.models.PR_Class import (
    SymbolModel, SymbolSchemaModel, LineStyleSchemaModel, AreaFillSchemaModel, PixmapSchemaModel, ColourProfileSchemaModel,
    ColourTokenModel, ColourPaletteModel, PaletteItemModel, DisplayModeModel, ViewingGroupModel, ViewingGroupLayerModel,
    AlertHighlightModel, AlertMessageModel, RE_RegisterItemModel,AlertInfoModel, AlertModel,
    AreaFillModel, LineStyleModel, PixmapModel
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
    AlertHighlightModel, AlertMessageModel, RE_RegisterItemModel, AlertInfoModel
)
association_list = {
    "Symbol": {"parent_id": ["token", "schema"], "child_id": ["icon", "symbol"], "main": SymbolModel},
    "LineStyle": {"parent_id": ["token", "schema", "symbol"], "child_id": [], "main": LineStyleModel},
    "AreaFill": {"parent_id": ["token", "schema", "symbol"], "child_id": [], "main": AreaFillModel},
    "Pixmap": {"parent_id": ["token", "schema"], "child_id": [], "main": PixmapModel},
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
    "AlertMessage": {"parent_id": ["symbol"], "child_id": ["alertMessage"], "main": AlertMessageModel},
    "AlertInfo": {"parent_id": ["highlight", "alertMessage"], "child_id": [], "main": AlertInfoModel}
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

    return Response(f"{item_type} deleted")

# MI 삭제 처리 함수
def delete_MI(request, item_type):
    I_id = decrypt_item_id(request)  # 공통 함수 호출
    result = ManagementInfoModel.delete(I_id)  # 모든 엔드포인트에서 적용될 삭제
    return Response(f"{item_type} deleted")

# 파일 삭제 함수
def delete_files(file_paths):
    for file_path in file_paths:
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)  # 파일 삭제
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")
        else:
            print(f"File not found or invalid: {file_path}")

@api_view(['DELETE'])
def delete_symbol(request):
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

    return Response(f"Symbol with ID {M_Id} deleted", status=200)


@api_view(['DELETE'])
def delete_line_style(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "LineStyle")
    delete_MI(request, "LineStyle")
    
    delete_association(request, "LineStyle")
    delete_MI(request, "LineStyle")

    main_model = association_list["LineStyle"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    preview_image_path = document.get('previewImage')
    engineering_image_path = document.get('engineeringImage')
    item_detail_path = document.get('itemDetail')
    delete_files([preview_image_path, engineering_image_path, item_detail_path])

    main_model.delete(M_Id)
    return Response(f"LineStyle with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_area_fill(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "AreaFill")
    delete_MI(request, "AreaFill")

    main_model = association_list["AreaFill"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    preview_image_path = document.get('previewImage')
    engineering_image_path = document.get('engineeringImage')
    item_detail_path = document.get('itemDetail')
    delete_files([preview_image_path, engineering_image_path, item_detail_path])

    main_model.delete(M_Id)
    return Response(f"AreaFill with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_pixmap(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "Pixmap")
    delete_MI(request, "Pixmap")

    main_model = association_list["Pixmap"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    preview_image_path = document.get('previewImage')
    engineering_image_path = document.get('engineeringImage')
    item_detail_path = document.get('itemDetail')
    delete_files([preview_image_path, engineering_image_path, item_detail_path])

    main_model.delete(M_Id)
    return Response(f"Pixmap with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_symbol_schema(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "SymbolSchema")
    delete_MI(request, "SymbolSchema")

    main_model = association_list["SymbolSchema"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    xml_schema_path = document.get('xmlSchema')
    delete_files([xml_schema_path])

    main_model.delete(M_Id)
    return Response(f"SymbolSchema with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_line_style_schema(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "LineStyleSchema")
    delete_MI(request, "LineStyleSchema")

    main_model = association_list["LineStyleSchema"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    xml_schema_path = document.get('xmlSchema')
    delete_files([xml_schema_path])

    main_model.delete(M_Id)
    return Response(f"LineStyleSchema with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_area_fill_schema(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "AreaFillSchema")
    delete_MI(request, "AreaFillSchema")

    main_model = association_list["AreaFillSchema"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    xml_schema_path = document.get('xmlSchema')
    delete_files([xml_schema_path])

    main_model.delete(M_Id)
    return Response(f"AreaFillSchema with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_colour_profile_schema(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "ColourProfileSchema")
    delete_MI(request, "ColourProfileSchema")

    main_model = association_list["ColourProfileSchema"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    xml_schema_path = document.get('xmlSchema')
    delete_files([xml_schema_path])

    main_model.delete(M_Id)
    return Response(f"ColourProfileSchema with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_pixmap_schema(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "PixmapSchema")
    delete_MI(request, "PixmapSchema")

    main_model = association_list["PixmapSchema"]["main"]
    document = main_model.get_exixting_by_id(M_Id)
    xml_schema_path = document.get('xmlSchema')
    delete_files([xml_schema_path])

    main_model.delete(M_Id)
    return Response(f"PixmapSchema with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_colour_token(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "ColourToken")
    delete_MI(request, "ColourToken")

    main_model = association_list["ColourToken"]["main"]

    main_model.delete(M_Id)
    return Response(f"ColourToken with ID {M_Id} deleted", status=200)


@api_view(['DELETE'])
def delete_colour_palette(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "ColourPalette")
    delete_MI(request, "ColourPalette")

    main_model = association_list["ColourPalette"]["main"]

    main_model.delete(M_Id)
    return Response(f"ColourPalette with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_palette_item(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "PaletteItem")
    delete_MI(request, "PaletteItem")

    main_model = association_list["PaletteItem"]["main"]

    main_model.delete(M_Id)
    return Response(f"PaletteItem with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_display_mode(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "DisplayMode")
    delete_MI(request, "DisplayMode")

    main_model = association_list["DisplayMode"]["main"]

    main_model.delete(M_Id)
    return Response(f"DisplayMode with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_viewing_group(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "ViewingGroup")
    delete_MI(request, "ViewingGroup")

    main_model = association_list["ViewingGroup"]["main"]

    main_model.delete(M_Id)
    return Response(f"ViewingGroup with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_viewing_group_layer(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "ViewingGroupLayer")
    delete_MI(request, "ViewingGroupLayer")

    main_model = association_list["ViewingGroupLayer"]["main"]

    main_model.delete(M_Id)
    return Response(f"ViewingGroupLayer with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_alert_highlight(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "AlertHighlight")
    delete_MI(request, "AlertHighlight")

    main_model = association_list["AlertHighlight"]["main"]

    main_model.delete(M_Id)
    return Response(f"AlertHighlight with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_alert_message(request):
    M_Id = decrypt_item_id(request)
    delete_association(request, "AlertMessage")
    delete_MI(request, "AlertMessage")

    main_model = association_list["AlertMessage"]["main"]

    main_model.delete(M_Id)
    return Response(f"AlertMessage with ID {M_Id} deleted", status=200)

# 기타 삭제 엔드포인트 (Management Info 삭제만 적용)
@api_view(['DELETE'])
def delete_display_plane(request):
    M_Id = decrypt_item_id(request)
    delete_MI(request, "DisplayPlane")
    main_model = RE_RegisterItemModel
    main_model.delete(M_Id)
    return Response(f"DisplayPlane with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_font(request):
    M_Id = decrypt_item_id(request)
    delete_MI(request, "Font")
    main_model = RE_RegisterItemModel
    document = main_model.get_exixting_by_id(M_Id)
    font_file_path = document.get('fontFile')
    delete_files([font_file_path])
    main_model.delete(M_Id)
    return Response(f"Font with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_context_parameter(request):
    M_Id = decrypt_item_id(request)
    delete_MI(request, "ContextParameter")
    main_model = RE_RegisterItemModel
    main_model.delete(M_Id)
    return Response(f"ContextParameter with ID {M_Id} deleted", status=200)

@api_view(['DELETE'])
def delete_drawing_priority(request):
    M_Id = decrypt_item_id(request)
    delete_MI(request, "DrawingPriority")
    main_model = RE_RegisterItemModel
    main_model.delete(M_Id)
    return Response(f"DrawingPriority with ID {M_Id} deleted", status=200)


@api_view(['DELETE'])
def delete_alert(request):
    item_iv = request.GET.get('item_iv')
    if not item_iv:
        M_Id = request.GET.get('item_id')
    else:
        M_Id = decrypt(request.GET.get('item_id'), item_iv)
    delete_MI(request, "Alert")
    main_model = AlertModel
    main_model.delete(M_Id)
    return Response(f"Alert with ID {M_Id} deleted", status=200)

from regiSystem.models.PR_Class import AlertInfoModel

@api_view(['DELETE'])
def delete_alert_info(request):
    item_iv = request.GET.get('item_iv')
    if not item_iv:
        item_id = request.GET.get('item_id')
    else:
        item_id = decrypt(request.GET.get('item_id'), item_iv)
        
    # delete_association(request, "AlertInfo")
    M_id = request.GET.get('priority_id')
    main_model = AlertInfoModel
    main_model.delete(M_id, item_id)
    return Response(f"AlertInfo with ID {M_id} deleted", status=200)
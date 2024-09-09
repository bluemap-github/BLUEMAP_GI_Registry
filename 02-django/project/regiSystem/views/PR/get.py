from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.models.PR_Visual import (
    SymbolSchemaModel,
    LineStyleSchemaModel,
    AreaFillSchemaModel,
    PixmapSchemaModel,
    ColourProfileSchemaModel,
    SymbolModel,
    LineStyleModel,
    AreaFillModel,
    PixmapModel
)
from regiSystem.serializers.PR import (S100_PR_ItemSchemaSerializer, S100_PR_VisualItemSerializer)

from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)
from regiSystem.info_sec.getByURI import uri_to_serial

@api_view(['GET'])
def get_symbol_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = SymbolModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_symbol(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = SymbolModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_line_style_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = LineStyleModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_line_style(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = LineStyleModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_area_fill_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = AreaFillModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_area_fill(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = AreaFillModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_pixmap_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = PixmapModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_pixmap(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = PixmapModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_symbol_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = SymbolSchemaModel.get_list(C_id)  

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200) 
    else:
        return Response(symbol_schema_data, status=400)


@api_view(['GET'])
def get_symbol_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = SymbolSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_line_style_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = LineStyleSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)

@api_view(['GET'])
def get_line_style_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = LineStyleSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_area_fill_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = AreaFillSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)

@api_view(['GET'])
def get_area_fill_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = AreaFillSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_pixmap_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = PixmapSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)
    
@api_view(['GET'])  
def get_pixmap_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = PixmapSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

@api_view(['GET'])
def get_colour_profile_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = ColourProfileSchemaModel.get_list(C_id)

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_schema_data, status=400)
    
@api_view(['GET'])
def get_colour_profile_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ColourProfileSchemaModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)



from regiSystem.models.PR_Visual import ColourTokenModel
@api_view(['GET'])
def get_colour_token_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_data = ColourTokenModel.get_list(C_id)

    if symbol_data['status'] == 'success':
        serializer = S100_PR_VisualItemSerializer(symbol_data['data'], many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(symbol_data, status=400)

@api_view(['GET'])
def get_colour_token(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    # 복호화된 ID가 유효한 ObjectId인지 확인
    try:
        symbol_schema = ColourTokenModel.get_one(I_id)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
    return Response(symbol_schema, status=200)

from regiSystem.models.PR_Visual import PaletteItemModel
from regiSystem.models.PR_Visual import ColourPaletteModel
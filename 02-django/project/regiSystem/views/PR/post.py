from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

import json
from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)
from regiSystem.info_sec.getByURI import uri_to_serial

from regiSystem.models.Concept import (
    RegiModel
)

### Visual Item
from regiSystem.models.PR_Visual import (
    SymbolModel, 
    LineStyleModel, 
    AreaFillModel, 
    PixmapModel
)  
@api_view(['POST'])
def insert_symbol_item(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = SymbolModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_line_style_item(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = LineStyleModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_area_fill_item(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = AreaFillModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_pixmap_item(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = PixmapModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)


### Item Schema
from regiSystem.models.PR_Visual import (
    SymbolSchemaModel,
    LineStyleSchemaModel,
    AreaFillSchemaModel,
    PixmapSchemaModel,
    ColourProfileSchemaModel,
)  

@api_view(['POST'])
def insert_symbol_schema(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = SymbolSchemaModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_line_style_schema(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = LineStyleSchemaModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_area_fill_schema(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = AreaFillSchemaModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_pixmap_schema(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = PixmapSchemaModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_colour_profile_schema(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = ColourProfileSchemaModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

## Colour Token
from regiSystem.models.PR_Visual import ColourTokenModel
@api_view(['POST'])
def insert_colour_token(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = ColourTokenModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

## Palette Item
from regiSystem.models.PR_Visual import PaletteItemModel
@api_view(['POST'])
def insert_palette_item(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = PaletteItemModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

## Colour Palette
from regiSystem.models.PR_Visual import ColourPaletteModel
@api_view(['POST'])
def insert_colour_palette(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    data = request.data
    inserted_ = ColourPaletteModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)


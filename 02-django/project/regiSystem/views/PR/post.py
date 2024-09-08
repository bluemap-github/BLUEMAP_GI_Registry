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
    data = request.data
    SymbolModel.insert(data)
    return Response(status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_line_style_item(request):
    data = request.data
    LineStyleModel.insert(data)
    return Response(status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_area_fill_item(request):
    data = request.data
    AreaFillModel.insert(data)
    return Response(status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_pixmap_item(request):
    data = request.data
    PixmapModel.insert(data)
    return Response(status=HTTP_201_CREATED)


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
    # data['concept_id'] = ObjectId(C_id)
    print(data, "!!!!!!!!!!!!!!!")
    inserted_ = SymbolSchemaModel.insert(data, ObjectId(C_id))
    if inserted_["status"] == "error":
        print(inserted_["errors"])
        return Response(inserted_["errors"], status=HTTP_400_BAD_REQUEST)
    encrypted_id = get_encrypted_id([inserted_["inserted_id"]])
    RegiModel.update_date(C_id)
    return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_line_style_schema(request):
    data = request.data
    LineStyleSchemaModel.insert(data)
    return Response(status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_area_fill_schema(request):
    data = request.data
    AreaFillSchemaModel.insert(data)
    return Response(status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_pixmap_schema(request):
    data = request.data
    PixmapSchemaModel.insert(data)
    return Response(status=HTTP_201_CREATED)

@api_view(['POST'])
def insert_colour_profile_schema(request):
    data = request.data
    ColourProfileSchemaModel.insert(data)
    return Response(status=HTTP_201_CREATED)

## Colour Token
from regiSystem.models.PR_Visual import ColourTokenModel
@api_view(['POST'])
def insert_colour_token(request):
    data = request.data
    ColourTokenModel.insert(data)
    return Response(status=HTTP_201_CREATED)

## Palette Item
from regiSystem.models.PR_Visual import PaletteItemModel
@api_view(['POST'])
def insert_palette_item(request):
    data = request.data
    PaletteItemModel.insert(data)
    return Response(status=HTTP_201_CREATED)

## Colour Palette
from regiSystem.models.PR_Visual import ColourPaletteModel
@api_view(['POST'])
def insert_colour_palette(request):
    data = request.data
    ColourPaletteModel.insert(data)
    return Response(status=HTTP_201_CREATED)

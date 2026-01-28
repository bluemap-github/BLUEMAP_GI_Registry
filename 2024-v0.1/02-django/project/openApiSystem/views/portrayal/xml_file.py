from bson.objectid import ObjectId
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from openApiSystem.utils import check_key_validation
import os
from django.conf import settings
from openApiSystem.models.dbs import (
    S100_Portrayal_AreaFillSchema, S100_Portrayal_ColourProfileSchema, 
    S100_Portrayal_LineStyleSchema, S100_Portrayal_PixmapSchema, S100_Portrayal_SymbolSchema
)
from django.http import FileResponse

# XML 저장 경로 설정
XML_DIR = settings.XML_DIR

# 모델 매핑을 위한 딕셔너리 설정
MODEL_MAPPING = {
    'AreaFillSchema': S100_Portrayal_AreaFillSchema,
    'ColourProfileSchema': S100_Portrayal_ColourProfileSchema,
    'LineStyleSchema': S100_Portrayal_LineStyleSchema,
    'PixmapSchema': S100_Portrayal_PixmapSchema,
    'SymbolSchema': S100_Portrayal_SymbolSchema,
}

# 파일 저장 함수
def save_file(file, directory, file_name):
    if file:
        file_path = os.path.join(directory, file_name)
        try:
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            return file_path  # 절대 경로 반환
        except Exception as e:
            print(f"Error saving file {file_name}: {e}")
            return None
    return None

# Swagger 파라미터 정의
schema_type_param = openapi.Parameter(
    'schema_type', openapi.IN_FORM, description='Schema type to determine the model', 
    type=openapi.TYPE_STRING, enum=list(MODEL_MAPPING.keys()), required=True
)
item_id_param = openapi.Parameter('item_id', openapi.IN_FORM, description='ID of the existing item', type=openapi.TYPE_STRING, required=True)
registry_uri_param = openapi.Parameter('registry_uri', openapi.IN_FORM, description='Registry URI for user identification', type=openapi.TYPE_STRING, required=True, default='test')
service_key_param = openapi.Parameter('service_key', openapi.IN_FORM, description='Service key for authentication', type=openapi.TYPE_STRING, required=True, default='0000')
file_param = openapi.Parameter('file', openapi.IN_FORM, description='Upload XML file', type=openapi.TYPE_FILE, required=True)

# XML 파일 업로드 API
@swagger_auto_schema(
    method='post',
    manual_parameters=[schema_type_param, item_id_param, registry_uri_param, service_key_param, file_param],
    consumes=['multipart/form-data']
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_xml_file(request):
    schema_type = request.POST.get('schema_type')
    item_id = request.POST.get('item_id')
    registry_uri = request.POST.get('registry_uri')
    service_key = request.POST.get('service_key')
    uploaded_file = request.FILES.get('file')

    # Validate registry URI and service key
    validation_response = check_key_validation(service_key, registry_uri)
    if isinstance(validation_response, Response):
        return validation_response

    # 모델 선택 (Collection 객체가 반환됨)
    model = MODEL_MAPPING.get(schema_type)
    if model is None:
        return Response({"error": f"Invalid schema_type '{schema_type}' provided. Valid options are {list(MODEL_MAPPING.keys())}."}, status=status.HTTP_400_BAD_REQUEST)

    # 파일 확장자 확인
    if uploaded_file and not uploaded_file.name.endswith('.xml'):
        return Response({"error": "Only XML files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

    # 설정 파일에 정의된 절대 경로를 사용하여 directory 설정
    directory = XML_DIR
    file_name = f"{item_id}.xml"

    # Save file
    file_path = save_file(uploaded_file, directory, file_name)
    if not file_path:
        return Response({"error": "File upload failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Update the database with the file path (model은 Collection 객체)
    update_data = {'xmlSchema': file_path}
    item_updated = db_update_xml_function(model, ObjectId(item_id), update_data)
    
    if item_updated:
        return Response({"message": "XML file uploaded successfully.", "file_path": file_path}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "Failed to update item in database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# MongoDB 업데이트 함수
def db_update_xml_function(model, item_id, update_data):
    try:
        # Collection 객체에서 바로 find_one과 update_one 사용
        item = model.find_one({"_id": ObjectId(item_id)})
        if item:
            model.update_one({"_id": ObjectId(item_id)}, {"$set": update_data})
            return True
        else:
            return False
    except Exception as e:
        print(f"Error updating item in database: {e}")
        return False


# XML 파일 다운로드 API
item_id_param = openapi.Parameter(
    'item_id', openapi.IN_QUERY, description="ID of the item to retrieve the XML file for", type=openapi.TYPE_STRING, required=True
)
schema_type_param = openapi.Parameter(
    'schema_type', openapi.IN_QUERY, description="Schema type to determine the model", 
    type=openapi.TYPE_STRING, enum=list(MODEL_MAPPING.keys()), required=True
)

from pymongo.collection import Collection

@swagger_auto_schema(
    method='get',
    manual_parameters=[schema_type_param, item_id_param],
    operation_description="Download the XML file using the item ID",
    responses={
        200: 'File downloaded successfully',
        404: 'File not found or item does not exist'
    }
)
@api_view(['GET'])
def download_xml_file(request):
    schema_type = request.GET.get('schema_type')
    item_id = request.GET.get('item_id')
    if not item_id:
        return Response({"error": "item_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    # 모델 선택
    model = MODEL_MAPPING.get(schema_type)
    print(model, "Collection 확인용")
    if not isinstance(model, Collection):
        return Response({"error": f"Invalid schema_type provided or model is not a Collection. Received: {type(model)}"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ObjectId 변환
        try:
            object_id = ObjectId(item_id)
        except Exception:
            return Response({"error": "Invalid item_id format. Must be a valid MongoDB ObjectId."}, status=status.HTTP_400_BAD_REQUEST)

        # MongoDB에서 문서 검색
        item = model.find_one({"_id": object_id})
        if not item:
            return Response({"error": "Item not found in the database."}, status=status.HTTP_404_NOT_FOUND)

        # xmlSchema 경로 확인
        file_name = item.get("xmlSchema")
        if not file_name:
            return Response({"error": "xmlSchema path is missing in the database item."}, status=status.HTTP_404_NOT_FOUND)

        # 파일 존재 여부 확인 및 파일 응답
        if os.path.exists(file_name):
            return FileResponse(open(file_name, 'rb'), as_attachment=True)
        else:
            return Response({"error": "File not found on the server."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": f"Error retrieving file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@swagger_auto_schema(
    method='delete',
    manual_parameters=[schema_type_param, item_id_param],
    operation_description="Delete the XML file using the item ID and schema type",
    responses={
        200: 'File deleted successfully',
        404: 'File not found or item does not exist'
    }
)
@api_view(['DELETE'])
def delete_xml_file(request):
    schema_type = request.GET.get('schema_type')
    item_id = request.GET.get('item_id')

    # 모델 선택
    model = MODEL_MAPPING.get(schema_type)
    if not isinstance(model, Collection):
        return Response({"error": f"Invalid schema_type provided or model is not a Collection. Received: {type(model)}"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ObjectId 변환 및 문서 검색
        object_id = ObjectId(item_id)
        item = model.find_one({"_id": object_id})
        if not item or 'xmlSchema' not in item:
            return Response({"error": "Item not found or xmlSchema is missing."}, status=status.HTTP_404_NOT_FOUND)

        # xmlSchema 경로 가져오기
        file_path = item['xmlSchema']
        
        # 파일 삭제
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            return Response({"error": "File not found on the server."}, status=status.HTTP_404_NOT_FOUND)

        # 데이터베이스에서 경로를 빈 문자열로 업데이트
        model.update_one({"_id": object_id}, {"$set": {"xmlSchema": ""}})
        
        return Response({"message": "File deleted successfully."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Error deleting file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

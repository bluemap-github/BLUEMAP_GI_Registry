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
from openApiSystem.models.dbs import S100_Portrayal_Font
from django.http import FileResponse

# 폰트 저장 경로 설정
FONT_DIR = settings.FONT_DIR

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
item_type_param = openapi.Parameter('item_type', openapi.IN_FORM, description='Field to update (fontFile)', type=openapi.TYPE_STRING, required=True, default='fontFile')
item_id_param = openapi.Parameter('item_id', openapi.IN_FORM, description='ID of the existing item', type=openapi.TYPE_STRING, required=True)
registry_uri_param = openapi.Parameter('registry_uri', openapi.IN_FORM, description='Registry URI for user identification', type=openapi.TYPE_STRING, required=True, default='test')
service_key_param = openapi.Parameter('service_key', openapi.IN_FORM, description='Service key for authentication', type=openapi.TYPE_STRING, required=True, default='0000')
file_param = openapi.Parameter('file', openapi.IN_FORM, description='Upload TTF font file', type=openapi.TYPE_FILE, required=True)

# 폰트 파일 업로드 API
@swagger_auto_schema(
    method='post',
    manual_parameters=[item_type_param, item_id_param, registry_uri_param, service_key_param, file_param],
    consumes=['multipart/form-data']
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_font_file(request):
    item_type = request.POST.get('item_type')
    item_id = request.POST.get('item_id')
    registry_uri = request.POST.get('registry_uri')
    service_key = request.POST.get('service_key')
    uploaded_file = request.FILES.get('file')

    # Validate registry URI and service key
    validation_response = check_key_validation(service_key, registry_uri)
    if isinstance(validation_response, Response):
        return validation_response

    # Validate item_type and file extension
    if item_type != 'fontFile':
        return Response({"error": "Invalid item_type provided. Only 'fontFile' is allowed."}, status=status.HTTP_400_BAD_REQUEST)
    
    if uploaded_file and not uploaded_file.name.endswith('.ttf'):
        return Response({"error": "Only TTF files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

    # 설정 파일에 정의된 절대 경로를 사용하여 directory 설정
    directory = FONT_DIR
    
    # Generate filename based on item_id
    file_name = f"{item_id}.ttf"

    # Save file
    file_path = save_file(uploaded_file, directory, file_name)
    if not file_path:
        return Response({"error": "File upload failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Update the database with the file path
    update_data = {'fontFile': file_path}
    item_updated = db_update_font_function(ObjectId(item_id), update_data)
    
    if item_updated:
        return Response({"message": "Font file uploaded successfully.", "file_path": file_path}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "Failed to update item in database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# MongoDB 업데이트 함수
def db_update_font_function(item_id, update_data):
    try:
        # 아이템이 존재하는지 확인
        item = S100_Portrayal_Font.find_one({"_id": ObjectId(item_id)})
        if item:
            # 컬렉션에서 직접 update_one 호출
            S100_Portrayal_Font.update_one({"_id": ObjectId(item_id)}, {"$set": update_data})
            return True
        else:
            return False
    except Exception as e:
        print(f"Error updating item in database: {e}")
        return False

# 폰트 파일 다운로드 API
item_id_param = openapi.Parameter(
    'item_id', openapi.IN_QUERY, description="ID of the item to retrieve the font file for", type=openapi.TYPE_STRING, required=True
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[item_id_param],
    operation_description="Download the font file using the item ID",
    responses={
        200: 'File downloaded successfully',
        404: 'File not found or item does not exist'
    }
)
@api_view(['GET'])
def download_font_file(request):
    # 쿼리 파라미터로부터 item_id 받기
    item_id = request.GET.get('item_id')
    if not item_id:
        return Response({"error": "item_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ObjectId로 변환 후 모델에서 아이템 검색
        item = S100_Portrayal_Font.find_one({"_id": ObjectId(item_id)})
        if not item or "fontFile" not in item:
            return Response({"error": "Item not found or fontFile is missing"}, status=status.HTTP_404_NOT_FOUND)

        # fontFile 경로 가져오기
        file_name = item["fontFile"]

        # 파일 존재 여부 확인 및 파일 응답
        if os.path.exists(file_name):
            # 파일을 첨부 파일로 다운로드하도록 설정
            return FileResponse(open(file_name, 'rb'), as_attachment=True)
        else:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": f"Error retrieving file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    method='delete',
    manual_parameters=[item_id_param],
    operation_description="Delete the font file using the item ID",
    responses={
        200: 'File deleted successfully',
        404: 'File not found or item does not exist'
    }
)
@api_view(['DELETE'])
def delete_font_file(request):
    item_id = request.GET.get('item_id')

    # item_id 확인
    if not item_id:
        return Response({"error": "item_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ObjectId로 변환 후 데이터베이스에서 문서 검색
        object_id = ObjectId(item_id)
        item = S100_Portrayal_Font.find_one({"_id": object_id})
        if not item or 'fontFile' not in item:
            return Response({"error": "Item not found or fontFile is missing."}, status=status.HTTP_404_NOT_FOUND)

        # fontFile 경로 가져오기
        file_path = item['fontFile']
        
        # 파일 존재 여부 확인 후 삭제
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            return Response({"error": "File not found on the server."}, status=status.HTTP_404_NOT_FOUND)

        # 데이터베이스에서 경로를 빈 문자열로 설정
        S100_Portrayal_Font.update_one({"_id": object_id}, {"$set": {"fontFile": ""}})
        
        return Response({"message": "Font file deleted successfully."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Error deleting file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

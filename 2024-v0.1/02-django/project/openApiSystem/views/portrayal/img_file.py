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
    S100_Portrayal_Symbol, S100_Portrayal_Pixmap, S100_Portrayal_LineStyle, S100_Portrayal_AreaFill
)
from django.http import FileResponse

# 이미지 저장 경로 설정
PREVIEW_IMAGE_DIR = settings.PREVIEW_IMAGE_DIR 
ENGINEERING_IMAGE_DIR = settings.ENGINEERING_IMAGE_DIR

MODEL_MAPPING = {
    'Symbol': S100_Portrayal_Symbol,
    'Pixmap': S100_Portrayal_Pixmap,
    'LineStyle': S100_Portrayal_LineStyle,
    'AreaFill': S100_Portrayal_AreaFill,
}

# 지원하는 이미지 확장자와 매핑
ALLOWED_EXTENSIONS = {
    'jpg': 'jpg',
    'jpeg': 'jpg',
    'png': 'png',
    'tiff': 'tif',
    'tif': 'tif'
}

# Swagger 파라미터 정의
visual_item_type_param = openapi.Parameter(
    'visual_item_type', openapi.IN_FORM, 
    description="Type of visual item (Symbol, Pixmap, LineStyle, AreaFill)",
    type=openapi.TYPE_STRING, enum=list(MODEL_MAPPING.keys()), required=True
)
img_file_type_param = openapi.Parameter(
    'img_file_type', openapi.IN_FORM, description='Image file type (png, tif, jpg, jpeg, tiff)', 
    type=openapi.TYPE_STRING, enum=list(ALLOWED_EXTENSIONS.keys()), required=True
)
image_type_param = openapi.Parameter(
    'image_type', openapi.IN_FORM, description='Image type to determine path (engineeringImage, previewImage)', 
    type=openapi.TYPE_STRING, enum=['engineeringImage', 'previewImage'], required=True
)
item_id_param = openapi.Parameter('item_id', openapi.IN_FORM, description='ID of the existing item', type=openapi.TYPE_STRING, required=True)
file_param = openapi.Parameter('file', openapi.IN_FORM, description='Upload image file', type=openapi.TYPE_FILE, required=True)

# 이미지 파일 업로드 API
@swagger_auto_schema(
    method='post',
    manual_parameters=[visual_item_type_param, img_file_type_param, image_type_param, item_id_param, file_param],
    consumes=['multipart/form-data']
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_img_file(request):
    visual_item_type = request.POST.get('visual_item_type')
    img_file_type = request.POST.get('img_file_type')
    image_type = request.POST.get('image_type')
    item_id = request.POST.get('item_id')
    uploaded_file = request.FILES.get('file')

    
    model = MODEL_MAPPING.get(visual_item_type)
    if model is None:
        return Response({"error": "Invalid visual_item_type provided."}, status=status.HTTP_400_BAD_REQUEST)
    

    # 모델 확인 및 파일 형식 처리
    file_extension = ALLOWED_EXTENSIONS.get(img_file_type.lower())
    if not file_extension:
        return Response({"error": "Invalid img_file_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    # 경로와 필드 설정
    if image_type == 'engineeringImage':
        directory = ENGINEERING_IMAGE_DIR
        image_field = 'engineeringImage'
        type_field = 'engineeringImageType'
    elif image_type == 'previewImage':
        directory = PREVIEW_IMAGE_DIR
        image_field = 'previewImage'
        type_field = 'previewType'
    else:
        return Response({"error": "Invalid image_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    # 파일 확장자 변경 및 파일명 설정
    file_name = f"{item_id}.{file_extension}"
    file_path = os.path.join(directory, file_name)

    # 파일 저장
    if not save_image_file(uploaded_file, file_path):
        return Response({"error": "File upload failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 데이터베이스 업데이트
    update_data = {image_field: file_path, type_field: file_extension}
    item_updated = db_update_image_function(model, ObjectId(item_id), update_data)
    
    if item_updated:
        return Response({"message": "Image file uploaded successfully.", "file_path": file_path}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "Failed to update item in database."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 이미지 파일 저장 함수
def save_image_file(file, file_path):
    try:
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return True
    except Exception as e:
        print(f"Error saving file {file_path}: {e}")
        return False

# MongoDB 업데이트 함수
def db_update_image_function(model, item_id, update_data):
    try:
        # Collection 객체에서 문서 검색 후 업데이트
        item = model.find_one({"_id": item_id})
        if item:
            model.update_one({"_id": item_id}, {"$set": update_data})
            return True
        return False
    except Exception as e:
        print(f"Error updating item in database: {e}")
        return False


from django.http import FileResponse

# Swagger 파라미터 정의
visual_item_type_param = openapi.Parameter(
    'visual_item_type', openapi.IN_QUERY, 
    description="Type of visual item (Symbol, Pixmap, LineStyle, AreaFill)",
    type=openapi.TYPE_STRING, enum=list(MODEL_MAPPING.keys()), required=True
)
item_id_param = openapi.Parameter(
    'item_id', openapi.IN_QUERY, description="ID of the item to retrieve the image for", type=openapi.TYPE_STRING, required=True
)
image_type_param = openapi.Parameter(
    'image_type', openapi.IN_QUERY, description="Type of image to download (engineeringImage, previewImage)", 
    type=openapi.TYPE_STRING, enum=['engineeringImage', 'previewImage'], required=True
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[visual_item_type_param, item_id_param, image_type_param],
    operation_description="Download the image file using the item ID and image type",
    responses={
        200: 'File downloaded successfully',
        404: 'File not found or item does not exist'
    }
)
@api_view(['GET'])
def download_image_file(request):
    visual_item_type = request.GET.get('visual_item_type')
    item_id = request.GET.get('item_id')
    image_type = request.GET.get('image_type')
    
    
    model = MODEL_MAPPING.get(visual_item_type)
    if model is None:
        return Response({"error": "Invalid visual_item_type provided."}, status=status.HTTP_400_BAD_REQUEST)
    # 모델 및 경로 필드 설정
    if image_type == 'engineeringImage':
        image_field = 'engineeringImage'
    elif image_type == 'previewImage':
        image_field = 'previewImage'
    else:
        return Response({"error": "Invalid image_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ObjectId로 변환 후 데이터베이스에서 문서 검색
        object_id = ObjectId(item_id)
        
        item = model.find_one({"_id": object_id})
        if not item or image_field not in item:
            return Response({"error": "Item not found or image path is missing."}, status=status.HTTP_404_NOT_FOUND)

        # 이미지 파일 경로 가져오기
        file_path = item[image_field]
        if not os.path.exists(file_path):
            return Response({"error": "File not found on the server."}, status=status.HTTP_404_NOT_FOUND)

        # 파일 응답 전송
        return FileResponse(open(file_path, 'rb'), as_attachment=True)

    except Exception as e:
        return Response({"error": f"Error retrieving file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    method='delete',
    manual_parameters=[visual_item_type_param, item_id_param, image_type_param],
    operation_description="Delete the image file using the item ID and image type",
    responses={
        200: 'File deleted successfully',
        404: 'File not found or item does not exist'
    }
)
@api_view(['DELETE'])
def delete_image_file(request):
    visual_item_type = request.GET.get('visual_item_type')
    item_id = request.GET.get('item_id')
    image_type = request.GET.get('image_type')

    model = MODEL_MAPPING.get(visual_item_type)
    if model is None:
        return Response({"error": "Invalid visual_item_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    # 이미지 타입에 따라 데이터베이스 필드 설정
    if image_type == 'engineeringImage':
        image_field = 'engineeringImage'
        type_field = 'engineeringImageType'
    elif image_type == 'previewImage':
        image_field = 'previewImage'
        type_field = 'previewType'
    else:
        return Response({"error": "Invalid image_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ObjectId 변환 및 데이터베이스에서 문서 검색
        object_id = ObjectId(item_id)
        item = model.find_one({"_id": object_id})
        if not item or image_field not in item:
            return Response({"error": "Item not found or image path is missing."}, status=status.HTTP_404_NOT_FOUND)

        # 이미지 파일 경로 가져오기
        file_path = item[image_field]

        # 파일 존재 여부 확인 후 삭제
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            return Response({"error": "File not found on the server."}, status=status.HTTP_404_NOT_FOUND)

        # 데이터베이스에서 경로와 타입 필드의 값을 빈 문자열로 설정
        model.update_one({"_id": object_id}, {"$set": {image_field: "", type_field: ""}})
        
        return Response({"message": "File deleted successfully."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Error deleting file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

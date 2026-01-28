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
    S100_Portrayal_Symbol, S100_Portrayal_Pixmap, 
    S100_Portrayal_LineStyle, S100_Portrayal_AreaFill
)

MODEL_MAPPING = {
    'Symbol': S100_Portrayal_Symbol,
    'Pixmap': S100_Portrayal_Pixmap,
    'LineStyle': S100_Portrayal_LineStyle,
    'AreaFill': S100_Portrayal_AreaFill,
}

from bson.objectid import ObjectId
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import os
from django.conf import settings

# Swagger Parameters for Upload
visual_item_type_param = openapi.Parameter(
    'visual_item_type', openapi.IN_FORM, 
    description="Type of visual item (Symbol, Pixmap, LineStyle, AreaFill)",
    type=openapi.TYPE_STRING, enum=list(MODEL_MAPPING.keys()), required=True
)
item_type_param = openapi.Parameter(
    'item_type', openapi.IN_FORM,
    description="Field to update (itemDetail, previewImage, engineeringImage)",
    type=openapi.TYPE_STRING, enum=['itemDetail'], required=True
)
item_id_param = openapi.Parameter('item_id', openapi.IN_FORM, description="ID of the existing item", type=openapi.TYPE_STRING, required=True)
file_param = openapi.Parameter('file', openapi.IN_FORM, description="Upload SVG file", type=openapi.TYPE_FILE, required=True)

def save_file(file, directory, file_name):
    file_path = os.path.join(directory, file_name)
    try:
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return file_path
    except Exception as e:
        print(f"Error saving file {file_name}: {e}")
        return None

@swagger_auto_schema(
    method='post',
    manual_parameters=[visual_item_type_param, item_type_param, item_id_param, file_param],
    consumes=['multipart/form-data']
)
@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_svg_file(request):
    # 파라미터 가져오기
    visual_item_type = request.POST.get('visual_item_type')
    item_type = request.POST.get('item_type')
    item_id = request.POST.get('item_id')
    uploaded_file = request.FILES.get('file')

    # 모델 매핑 가져오기
    model = MODEL_MAPPING.get(visual_item_type)

    if model is None:
        return Response({"error": "Invalid visual_item_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    # 저장할 디렉토리 매핑
    directory_mapping = {
        'itemDetail': settings.SVG_DIR,
        'previewImage': settings.PREVIEW_IMAGE_DIR,
        'engineeringImage': settings.ENGINEERING_IMAGE_DIR
    }
    directory = directory_mapping.get(item_type)
    if not directory:
        return Response({"error": "Invalid item_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    # 파일명 생성 및 저장 경로 설정
    file_name = f"{item_id}.svg"
    file_path = os.path.join(directory, file_name)
    
    # 파일 저장
    saved_path = save_file(uploaded_file, directory, file_name)
    if not saved_path:
        return Response({"error": "File upload failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # 데이터베이스 업데이트
    try:
        update_result = model.update_one({"_id": ObjectId(item_id)}, {"$set": {item_type: saved_path}})
        if update_result.modified_count == 0:
            return Response({"error": "Failed to update item in database."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Database update error: {e}")
        return Response({"error": "Database update failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # 성공 응답
    return Response({"message": "File uploaded successfully.", "file_path": saved_path}, status=status.HTTP_201_CREATED)


from django.http import FileResponse

# Swagger Parameters for Download
visual_item_type_param = openapi.Parameter(
    'visual_item_type', openapi.IN_QUERY, 
    description="Type of visual item (Symbol, Pixmap, LineStyle, AreaFill)",
    type=openapi.TYPE_STRING, enum=list(MODEL_MAPPING.keys()), required=True
)
item_type_param = openapi.Parameter(
    'item_type', openapi.IN_QUERY, 
    description="Field to download (itemDetail, previewImage, engineeringImage)", 
    type=openapi.TYPE_STRING, enum=['itemDetail'], required=True
)
item_id_param = openapi.Parameter('item_id', openapi.IN_QUERY, description="ID of the existing item", type=openapi.TYPE_STRING, required=True)

@swagger_auto_schema(
    method='get',
    manual_parameters=[visual_item_type_param, item_type_param, item_id_param],
    operation_description="Download the file using the item ID and type",
    responses={200: 'File downloaded successfully', 404: 'File not found'}
)
@api_view(['GET'])
def download_svg_file(request):
    visual_item_type = request.GET.get('visual_item_type')
    item_type = request.GET.get('item_type')
    item_id = request.GET.get('item_id')

    # 모델 매핑 확인
    model = MODEL_MAPPING.get(visual_item_type)
    if model is None:
        return Response({"error": "Invalid visual_item_type provided."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        object_id = ObjectId(item_id)
    except Exception as e:
        return Response({"error": f"Invalid item_id format: {e}"}, status=status.HTTP_400_BAD_REQUEST)

    # MongoDB에서 Document 검색 및 item_type 필드 확인
    item = model.find_one({"_id": object_id})
    if not item:
        return Response({"error": "Item not found in database"}, status=status.HTTP_404_NOT_FOUND)
    if item_type not in item:
        return Response({"error": f"'{item_type}' field not found in item"}, status=status.HTTP_404_NOT_FOUND)

    # 파일 경로 확인
    file_path = item.get(item_type)
    print(f"File Path: {file_path}")  # 경로 출력 확인
    if not file_path or not os.path.exists(file_path):
        return Response({"error": "File not found on server"}, status=status.HTTP_404_NOT_FOUND)

    # 파일 응답 반환
    return FileResponse(open(file_path, 'rb'), as_attachment=True)


# Swagger Parameters for Delete
visual_item_type_param = openapi.Parameter(
    'visual_item_type', openapi.IN_QUERY, 
    description="Type of visual item (Symbol, Pixmap, LineStyle, AreaFill)",
    type=openapi.TYPE_STRING, enum=list(MODEL_MAPPING.keys()), required=True
)
item_type_param = openapi.Parameter(
    'item_type', openapi.IN_QUERY, 
    description="Field to delete (itemDetail, previewImage, engineeringImage)", 
    type=openapi.TYPE_STRING, enum=['itemDetail'], required=True
)
item_id_param = openapi.Parameter('item_id', openapi.IN_QUERY, description="ID of the existing item", type=openapi.TYPE_STRING, required=True)

@swagger_auto_schema(
    method='delete',
    manual_parameters=[visual_item_type_param, item_type_param, item_id_param],
    operation_description="Delete the file using the item ID and type",
    responses={200: 'File deleted successfully', 404: 'File not found'}
)
@api_view(['DELETE'])
def delete_svg_file(request):
    visual_item_type = request.GET.get('visual_item_type')
    item_type = request.GET.get('item_type')
    item_id = request.GET.get('item_id')

    model = MODEL_MAPPING.get(visual_item_type)
    if model is None:
        return Response({"error": "Invalid visual_item_type provided."}, status=status.HTTP_400_BAD_REQUEST)

    item = model.find_one({"_id": ObjectId(item_id)})
    if not item or item_type not in item:
        return Response({"error": "Item not found or specified type path is missing"}, status=status.HTTP_404_NOT_FOUND)

    file_path = item.get(item_type)
    if os.path.exists(file_path):
        os.remove(file_path)

    model.update_one({"_id": ObjectId(item_id)}, {"$set": {item_type: ""}})
    return Response({"message": "File deleted successfully"}, status=status.HTTP_200_OK)

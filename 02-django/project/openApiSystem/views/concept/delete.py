from bson.objectid import ObjectId
from regiSystem.models.Concept import (
        S100_Concept_Register,
        S100_Concept_Item,
        S100_Concept_ManagementInfo,
        S100_Concept_ReferenceSource,
        S100_Concept_Reference
    )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regi_uri = openapi.Parameter('regi_uri', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
service_key = openapi.Parameter('service_key', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
item_id = openapi.Parameter('item_id', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)


# Register 삭제 API
@swagger_auto_schema(
    method='delete',
    manual_parameters=[regi_uri, service_key, item_id],
)
@api_view(['DELETE'])
def register(request, C_id):
    try:
        if request.method == 'DELETE':
            result = S100_Concept_Register.delete_one({'_id': ObjectId(C_id)})
            if result.deleted_count == 1:
                return Response(status=HTTP_204_NO_CONTENT)
            else:
                return Response({'error': 'Document not found'}, status=HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

# Item 삭제 API
@swagger_auto_schema(
    method='delete',
    manual_parameters=[regi_uri, service_key, item_id],
)
@api_view(['DELETE'])
def item(request):
    I_id = request.GET.get('item_id')
    print(I_id, "왜?")

    if request.method == 'DELETE':
        try:
            result = S100_Concept_Item.delete_one({'_id': ObjectId(I_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_400_BAD_REQUEST)
            
            S100_Concept_ManagementInfo.delete_many({'concept_item_id': ObjectId(I_id)})
            S100_Concept_ReferenceSource.delete_many({'concept_item_id': ObjectId(I_id)})
            S100_Concept_Reference.delete_many({'concept_item_id': ObjectId(I_id)})

            return Response({'message': 'Concept item and related data deleted successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

# Management Info 삭제 API
@swagger_auto_schema(
    method='delete',
    manual_parameters=[regi_uri, service_key, item_id],
)
@api_view(['DELETE'])
def management_info(request):
    M_id = request.GET.get('item_id')
    if request.method == 'DELETE':
        try:
            result = S100_Concept_ManagementInfo.delete_one({'_id': ObjectId(M_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

# Reference Source 삭제 API
@swagger_auto_schema(
    method='delete',
    manual_parameters=[regi_uri, service_key, item_id],
)
@api_view(['DELETE'])
def reference_source(request):
    RS_id = request.GET.get('item_id')
    if request.method == 'DELETE':
        try:
            result = S100_Concept_ReferenceSource.delete_one({'_id': ObjectId(RS_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

# Reference 삭제 API
@swagger_auto_schema(
    method='delete',
    manual_parameters=[regi_uri, service_key, item_id],
)
@api_view(['DELETE'])
def reference(request):
    R_id = request.GET.get('item_id')
    if request.method == 'DELETE':
        try:
            result = S100_Concept_Reference.delete_one({'_id': ObjectId(R_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
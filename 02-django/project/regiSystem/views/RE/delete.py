from bson.objectid import ObjectId
from regiSystem.models import (
        S100_Concept_Register,
        S100_Concept_Item,
        S100_Concept_ManagementInfo,
        S100_Concept_ReferenceSource,
        S100_Concept_Reference
    )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

@api_view(['DELETE'])
def concept_register(request, C_id):
    try:
        if request.method == 'DELETE':
            result = S100_Concept_Register.delete_one({'_id': ObjectId(C_id)})
            if result.deleted_count == 1:
                return Response(status=HTTP_204_NO_CONTENT)
            else:
                return Response({'error': 'Document not found'}, status=HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

from regiSystem.info_sec.encryption import decrypt    

@api_view(['DELETE'])
def concept_item(request):
    item_iv = request.data.get('item_iv')
    I_id = decrypt(request.data.get('item_id'), item_iv)

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



@api_view(['DELETE'])
def concept_managemant_info(request):
    item_iv = request.data.get('item_iv')
    M_id = decrypt(request.data.get('item_id'), item_iv)
    if request.method == 'DELETE':
        try:
            result = S100_Concept_ManagementInfo.delete_one({'_id': ObjectId(M_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
        

@api_view(['DELETE'])
def concept_reference_source(request):
    item_iv = request.data.get('item_iv')
    RS_id = decrypt(request.data.get('item_id'), item_iv)
    if request.method == 'DELETE':
        try:
            result = S100_Concept_ReferenceSource.delete_one({'_id': ObjectId(RS_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
        

@api_view(['DELETE'])
def concept_reference(request):
    item_iv = request.data.get('item_iv')
    R_id = decrypt(request.data.get('item_id'), item_iv)
    if request.method == 'DELETE':
        try:
            result = S100_Concept_Reference.delete_one({'_id': ObjectId(R_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
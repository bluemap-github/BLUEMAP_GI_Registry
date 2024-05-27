from bson.objectid import ObjectId

# from ..models import (
#     S100_RE_RegisterItem, 
#     S100_RE_ManagementInfo, 
#     S100_RE_Reference, 
#     S100_RE_ReferenceSource,
# )
from ..models import (
        S100_Concept_Register,
        S100_Concept_Item,
        S100_Concept_ManagementInfo,
        S100_Concept_ReferenceSource,
        S100_Concept_Reference
    )


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from django.shortcuts import get_object_or_404

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
        

# @api_view(['DELETE'])
# def item(request, pk):
#     item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
#     if request.method == 'DELETE':
#         item_obj.delete()
#         return Response(status=HTTP_204_NO_CONTENT)



@api_view(['DELETE'])
def concept_item(request, I_id):
    if request.method == 'DELETE':
        try:
            # 먼저 주 문서를 삭제합니다
            result = S100_Concept_Item.delete_one({'_id': ObjectId(I_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_400_BAD_REQUEST)
            
            # 관련된 모든 문서를 삭제합니다
            S100_Concept_ManagementInfo.delete_many({'concept_item_id': ObjectId(I_id)})
            S100_Concept_ReferenceSource.delete_many({'concept_item_id': ObjectId(I_id)})
            S100_Concept_Reference.delete_many({'concept_item_id': ObjectId(I_id)})

            return Response({'message': 'Concept item and related data deleted successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

# @api_view(['DELETE'])
# def managemant_info(request, pk):
#     management_info_obj = get_object_or_404(S100_RE_ManagementInfo, pk=pk)
#     if request.method == 'DELETE':
#         management_info_obj.delete()
#         return Response(status=HTTP_204_NO_CONTENT)
    

@api_view(['DELETE'])
def concept_managemant_info(request, M_id):
    if request.method == 'DELETE':
        try:
            result = S100_Concept_ManagementInfo.delete_one({'_id': ObjectId(M_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
        

# @api_view(['DELETE'])
# def reference_source(request, pk):
#     reference_source_obj = get_object_or_404(S100_RE_ReferenceSource, pk=pk)
#     if request.method == 'DELETE':
#         reference_source_obj.delete()
#         return Response(status=HTTP_204_NO_CONTENT)
    
@api_view(['DELETE'])
def concept_reference_source(request, RS_id):
    if request.method == 'DELETE':
        try:
            result = S100_Concept_ReferenceSource.delete_one({'_id': ObjectId(RS_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
        
# @api_view(['DELETE'])
# def reference(request, pk):
#     reference_obj = get_object_or_404(S100_RE_Reference, pk=pk)
#     if request.method == 'DELETE':
#         reference_obj.delete()
#         return Response(status=HTTP_204_NO_CONTENT)
    
@api_view(['DELETE'])
def concept_reference(request, R_id):
    if request.method == 'DELETE':
        try:
            result = S100_Concept_Reference.delete_one({'_id': ObjectId(R_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Concept item not found'}, status=HTTP_404_NOT_FOUND)
            return Response({'message': 'Concept item deleted successfully'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
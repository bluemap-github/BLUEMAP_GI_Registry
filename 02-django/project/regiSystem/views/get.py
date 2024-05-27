from bson.objectid import ObjectId
from ..models import (
    S100_Concept_Register,
    S100_Concept_Item,
    S100_Concept_ManagementInfo,
    S100_Concept_ReferenceSource,
    S100_Concept_Reference
)
from ..serializers import (
    

    ConceptSerializer,
    ConceptItemSerializer,
    ConceptReferenceSerializer,
    ConceptReferenceSourceSerializer,
    ConceptManagementInfoSerializer
)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from rest_framework.status import (
        HTTP_400_BAD_REQUEST, 
        HTTP_404_NOT_FOUND,
        HTTP_405_METHOD_NOT_ALLOWED
    )

@api_view(['GET'])
def concept_register_list(request):
    if request.method == 'GET':
        try :
            cursor = S100_Concept_Register.find()
            serializer = ConceptSerializer(cursor, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def concept_register_detail(request, C_id):
    if request.method == 'GET':
        try:
            c_register = S100_Concept_Register.find_one({'_id': ObjectId(C_id)})
            if c_register:
                serializer = ConceptSerializer(c_register)
                return Response(serializer.data)
            else:
                return Response({'error': 'Register not found'}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
    return Response(status=HTTP_405_METHOD_NOT_ALLOWED)


# @api_view(['GET'])
# def register_itemList(request, pk):
#     if request.method == 'GET':
#         register = get_object_or_404(S100_RE_Register, pk=pk)
#         serializer = RegisterSerializer(register)

#         # 연결된 모델의 정보를 가져와서 시리얼라이징
#         register_items = S100_RE_RegisterItem.objects.filter(s100_RE_Register=register)
#         register_items_serializer = RegisterItemSerializer(register_items, many=True)

#         # 시리얼라이징 결과를 합쳐서 반환
#         response_data = {
#             'register' : serializer.data,
#             'register_items' : register_items_serializer.data
#         }
#         return Response(response_data)

@api_view(['GET'])
def concept_item_list(request, C_id): #레지스터 시리얼넘버가 들어감
    if request.method == 'GET':
        try:
            c_item_list = list(S100_Concept_Item.find({"concept_id": ObjectId(C_id)}))
            serializer = ConceptItemSerializer(c_item_list, many=True)
            response_data = {
                'register' : "", 
                'register_items' : serializer.data
            }
            return Response(response_data)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_item_detail(request, I_id):
    if request.method == 'GET':
        try:
            c_item = S100_Concept_Item.find_one({'_id': ObjectId(I_id)})
            if not c_item:
                return Response({'error': 'Concept item not found'}, status=HTTP_400_BAD_REQUEST)
            
            serializer = ConceptItemSerializer(c_item)
            response_data = {
                'item': serializer.data,
            }
            
            for model, seri, key_name in [
                (S100_Concept_ManagementInfo, ConceptManagementInfoSerializer, "management_infos"), 
                (S100_Concept_ReferenceSource, ConceptReferenceSourceSerializer, "reference_sources"), 
                (S100_Concept_Reference, ConceptReferenceSerializer, "references")
            ]:
                searching = model.find({'concept_item_id': ObjectId(I_id)})
                serialized_data = []
                for item in searching:
                    data = seri(item).data
                    # 고유 ID 추가
                    data['_id'] = str(item['_id'])
                    serialized_data.append(data)
                response_data[key_name] = serialized_data
            
            return Response(response_data)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def item_detail(request, pk):
#     if request.method == 'GET':
#         item = get_object_or_404(S100_RE_RegisterItem, pk=pk)
#         item_serializer = RegisterItemSerializer(item)
#         print("이거", item_serializer.data)
        
#         management_infos = S100_RE_ManagementInfo.objects.filter(s100_RE_RegisterItem=item)
#         reference_sources = S100_RE_ReferenceSource.objects.filter(s100_RE_RegisterItem=item)
#         references = S100_RE_Reference.objects.filter(s100_RE_RegisterItem=item)
#         management_info_serializer = ManagementInfoSerializer(management_infos, many=True)
#         reference_source_serializer = ReferenceSourceSerializer(reference_sources, many=True)
#         reference_serializer = ReferenceSerializer(references, many=True)
        
#         response_data = {
#             'item': item_serializer.data,
#             'management_infos': management_info_serializer.data,
#             'reference_sources': reference_source_serializer.data,
#             'references': reference_serializer.data,
#         }
#         return Response(response_data)
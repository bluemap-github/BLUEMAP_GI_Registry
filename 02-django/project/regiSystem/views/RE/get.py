from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
        HTTP_400_BAD_REQUEST, 
        HTTP_404_NOT_FOUND,
        HTTP_405_METHOD_NOT_ALLOWED
    )
from regiSystem.models import (
    S100_Concept_Register,
    S100_Concept_Item,
    S100_Concept_ManagementInfo,
    S100_Concept_ReferenceSource,
    S100_Concept_Reference
)
from regiSystem.serializers.RE import (
    ConceptSerializer,
    ConceptItemSerializer,
    ConceptReferenceSerializer,
    ConceptReferenceSourceSerializer,
    ConceptManagementInfoSerializer, 
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



@api_view(['GET'])
def concept_item_list(request, C_id): #레지스터 시리얼넘버가 들어감
    if request.method == 'GET':
        try:
            c_item_list = list(S100_Concept_Item.find({"concept_id": ObjectId(C_id)}).sort("_id", -1))
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










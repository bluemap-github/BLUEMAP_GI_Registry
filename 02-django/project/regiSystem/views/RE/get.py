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
import json
from regiSystem.InfoSec.encryption import (encrypt, get_encrypted_id, decrypt)

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
def concept_register_detail(request):
    C_id = request.GET.get('user_serial')
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

def make_response_data(serializer):
    response_data = {
        'register': "",
        'register_items': serializer.data
    }
    return response_data


@api_view(['GET'])
def concept_item_list(request): #레지스터 시리얼넘버가 들어감
    if request.method == 'GET':
        C_id = request.GET.get('user_serial')
        try:
            c_item_list = list(S100_Concept_Item.find({"concept_id": ObjectId(C_id)}).sort("_id", -1))
            serializer = ConceptItemSerializer(c_item_list, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            response_data = make_response_data(serializer)
            return Response(response_data)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_item_one(request):
    print(request.GET)
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    
    if request.method == 'GET':
        try:
            c_item = S100_Concept_Item.find_one({'_id': ObjectId(I_id)})
            if not c_item:
                return Response({'error': 'Concept item not found'}, status=HTTP_400_BAD_REQUEST)
            c_item["_id"] = get_encrypted_id([c_item["_id"]])
            serializer = ConceptItemSerializer(c_item)
            return Response({'item': serializer.data })
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_managemant_info(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_ManagementInfo.find({'concept_item_id': ObjectId(I_id)})
            if not c_item:
                Response({"management_infos" : []})
            serializer = ConceptManagementInfoSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            return Response({"management_infos" : serializer.data})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_reference_source(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_ReferenceSource.find({'concept_item_id': ObjectId(I_id)})
            if not c_item:
                Response({"reference_sources" : []})
            serializer = ConceptReferenceSourceSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            return Response({"reference_sources" : serializer.data})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def concept_reference(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_Reference.find({'concept_item_id': ObjectId(I_id)})
            if not c_item:
                Response({"references" : []})
            serializer = ConceptReferenceSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            return Response({"references" : serializer.data})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)






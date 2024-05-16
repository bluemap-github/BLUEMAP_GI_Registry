from bson.objectid import ObjectId
from django.shortcuts import render
from django.http import HttpResponse

from ..models import (
    S100_RE_Register, 
    S100_RE_RegisterItem, 
    S100_RE_ManagementInfo, 
    S100_RE_Reference, 
    S100_RE_ReferenceSource,
)
from ..models import (
    S100_Concept_Register,
    S100_Concept_Item,
)
from ..serializers import (
    RegisterSerializer, 
    ManagementInfoSerializer, 
    ReferenceSourceSerializer, 
    ReferenceSerializer, 
    RegisterItemSerializer,

    ConceptSerializer,
    ConceptItemSerializer,
)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from django.shortcuts import get_object_or_404, get_list_or_404

@api_view(['PUT'])
def concept_register(request, _id):
    try:
        c_register = S100_Concept_Register.find_one({'_id': ObjectId(_id)})
        if request.method == 'PUT':
            serializer = ConceptSerializer(c_register, data=request.data)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                S100_Concept_Register.update_one({'_id': ObjectId(_id)}, {'$set': validated_data})
                return Response(serializer.data, status=HTTP_201_CREATED) # 이 부분을 "직접 응답 데이터"라고 말함
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    except Exception as e: 
        return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def item(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'PUT':
        serializer = RegisterItemSerializer(item_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def concept_item(request, _id):
    c_item = S100_Concept_Item.find_one({'_id': ObjectId(_id)})
    serializer = ConceptItemSerializer(c_item, data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(validated_data['concept_id'])
        S100_Concept_Item.update_one({'_id': ObjectId(_id)}, {'$set': validated_data})
        return Response(serializer.data, status=HTTP_201_CREATED) # 이 부분을 "직접 응답 데이터"라고 말함
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        


@api_view(['PUT'])
def managemant_info(request, pk):
    management_info_obj = get_object_or_404(S100_RE_ManagementInfo, pk=pk)    
    if request.method == 'PUT':
        serializer = ManagementInfoSerializer(management_info_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def reference_source(request, pk):
    reference_source_obj = get_object_or_404(S100_RE_ReferenceSource, pk=pk)
    if request.method == 'PUT':
        serializer = ReferenceSourceSerializer(reference_source_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def reference(request, pk):
    reference_obj = get_object_or_404(S100_RE_Reference, pk=pk)
    if request.method == 'PUT':
        serializer = ReferenceSerializer(reference_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
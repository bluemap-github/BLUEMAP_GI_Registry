from bson.objectid import ObjectId
from django.shortcuts import render
from django.http import HttpResponse

from ..models import S100_RE_Register, S100_RE_RegisterItem, S100_RE_ManagementInfo, S100_RE_Reference, S100_RE_ReferenceSource
from ..models import (
        S100_Concept_Register,
        S100_Concept_Item,
        S100_Concept_ManagementInfo,
        S100_Concept_ReferenceSource,
        S100_Concept_Reference
    )
from ..serializers import (
        ManagementInfoSerializer, 
        ReferenceSourceSerializer, 
        ReferenceSerializer, 
        RegisterItemSerializer,

        ConceptSerializer,
        ConceptItemSerializer,
        ConceptManagementInfoSerializer,
        ConceptReferenceSourceSerializer,
        ConceptReferenceSerializer
    )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from django.shortcuts import get_object_or_404, get_list_or_404

@api_view(['POST'])
def concept_register(request):
    if request.method == 'POST':
        serializer = ConceptSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            S100_Concept_Register.insert_one(validated_data) 
            return Response(serializer.data, status=HTTP_201_CREATED) # 이 부분을 "직접 응답 데이터"라고 말함
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def item(request, pk):
    regi = get_object_or_404(S100_RE_Register, pk=pk)
    if request.method == 'POST':
        serializer = RegisterItemSerializer(data=request.data)
        if serializer.is_valid():
            # 참조하는 객체를 s100_RE_Register에 따로 저장하는 중
            serializer.validated_data['s100_RE_Register'] = regi
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def concept_item(request):
    serializer = ConceptItemSerializer(data=request.data)
    if serializer.is_valid():
        # validated_data를 사용하여 classroom_id를 ObjectId로 변환
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(validated_data['concept_id'])
        
        S100_Concept_Item.insert_one(validated_data) 
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def managemant_info(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'POST':
        serializer = ManagementInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['s100_RE_RegisterItem'] = item_obj
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def concept_managemant_info(request, I_id):
    serializer = ConceptManagementInfoSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)

        S100_Concept_ManagementInfo.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reference_source(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'POST':
        serializer = ReferenceSourceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['s100_RE_RegisterItem'] = item_obj
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def concept_reference_source(request, I_id):
    serializer = ConceptReferenceSourceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_ReferenceSource.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def reference(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'POST':
        serializer = ReferenceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['s100_RE_RegisterItem'] = item_obj
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def concept_reference(request, I_id):
    serializer = ConceptReferenceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_Reference.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
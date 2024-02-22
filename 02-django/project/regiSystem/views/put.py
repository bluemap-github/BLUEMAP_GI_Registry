from django.shortcuts import render
from django.http import HttpResponse

from ..models import S100_RE_Register, S100_RE_RegisterItem, S100_RE_ManagementInfo, S100_RE_Reference, S100_RE_ReferenceSource
from ..serializers import RegisterSerializer, ManagementInfoSerializer, ReferenceSourceSerializer, ReferenceSerializer, RegisterItemSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from django.shortcuts import get_object_or_404, get_list_or_404

@api_view(['PUT'])
def register(request, pk):
    register = get_object_or_404(S100_RE_Register, pk=pk)
    if request.method == 'PUT':
        serializer = RegisterSerializer(register, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

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
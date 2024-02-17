from django.shortcuts import render
from django.http import HttpResponse
from .sample_data import register_data, item_data, management_info_data, reference_data, reference_source_data

def create_sample(request):
    # S100_RE_Register
    registry = S100_RE_Register(**register_data)
    registry.save()

    # S100_RE_RegisterItem
    for item_pick in item_data:
        item = S100_RE_RegisterItem(**item_pick)
        item.save()
        
    # S100_RE_ManagementInfo
    for manage_pick in management_info_data:
        manage_info = S100_RE_ManagementInfo(**manage_pick)
        manage_info.save()

    # S100_RE_ReferenceSource
    for source_pick in reference_source_data:
        reference_source = S100_RE_ReferenceSource(**source_pick)
        reference_source.save()

    # S100_RE_Reference
    for reference_pick in reference_data:
        reference = S100_RE_Reference(**reference_pick)
        reference.save()

    sample_items = S100_RE_RegisterItem.objects.all()

    return HttpResponse(sample_items)

from .models import (
    S100_RE_Register,
    S100_RE_RegisterItem,
    S100_RE_ManagementInfo,
    S100_RE_Reference,
    S100_RE_ReferenceSource
)

from .serializers import (
    RegisterSerializer,
    ManagementInfoSerializer,
    ReferenceSourceSerializer,
    ReferenceSerializer,
    RegisterItemSerializer,

)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST
)

from django.shortcuts import get_object_or_404, get_list_or_404

@api_view(['GET'])
def register_detail(request, pk):
    if request.method == 'GET':
        register = get_object_or_404(S100_RE_Register, pk=pk)
        serializer = RegisterSerializer(register)
        return Response(serializer.data)

@api_view(['GET'])
def item_list(request):
    if request.method == 'GET':
        item_list = get_list_or_404(S100_RE_RegisterItem)
        serializer = RegisterItemSerializer(item_list, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def item_detail(request, pk):
    if request.method == 'GET':
        item = get_object_or_404(S100_RE_RegisterItem, pk=pk)
        item_serializer = RegisterItemSerializer(item)
        
        # 연결된 모델들의 정보를 가져와서 시리얼라이징
        management_infos = S100_RE_ManagementInfo.objects.filter(s100_RE_RegisterItem=item)
        reference_sources = S100_RE_ReferenceSource.objects.filter(s100_RE_RegisterItem=item)
        references = S100_RE_Reference.objects.filter(s100_RE_RegisterItem=item)
        management_info_serializer = ManagementInfoSerializer(management_infos, many=True)
        reference_source_serializer = ReferenceSourceSerializer(reference_sources, many=True)
        reference_serializer = ReferenceSerializer(references, many=True)
        
        # 시리얼라이저 결과를 합쳐서 반환
        response_data = {
            'item': item_serializer.data,
            'management_infos': management_info_serializer.data,
            'reference_sources': reference_source_serializer.data,
            'references': reference_serializer.data,
        }
        return Response(response_data)


@api_view(['POST'])
def create_item(request):
    regi = get_object_or_404(S100_RE_Register, pk=1)
    if request.method == 'POST':
        serializer = RegisterItemSerializer(data=request.data)
        if serializer.is_valid():
            # 참조하는 객체를 s100_RE_Register에 따로 저장하는 중
            serializer.validated_data['s100_RE_Register'] = regi
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_managemant_info(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'POST':
        serializer = ManagementInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['s100_RE_RegisterItem'] = item_obj
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_reference_source(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'POST':
        serializer = ReferenceSourceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['s100_RE_RegisterItem'] = item_obj
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_reference(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'POST':
        serializer = ReferenceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['s100_RE_RegisterItem'] = item_obj
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def put_item(request, pk):
    try:
        item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)
    
    if request.method == 'PUT':
        serializer = RegisterItemSerializer(item_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def put_managemant_info(request, pk):
    try:
        management_info_obj = get_object_or_404(S100_RE_ManagementInfo, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)
    
    if request.method == 'PUT':
        serializer = ManagementInfoSerializer(management_info_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def put_reference_source(request, pk):
    try:
        reference_source_obj = get_object_or_404(S100_RE_ReferenceSource, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)
    
    if request.method == 'PUT':
        serializer = ReferenceSourceSerializer(reference_source_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def put_reference(request, pk):
    try:
        reference_obj = get_object_or_404(S100_RE_Reference, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)
    
    if request.method == 'PUT':
        serializer = ReferenceSerializer(reference_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_item(request, pk):
    try:
        item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)
    
    if request.method == 'DELETE':
        item_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def delete_managemant_info(request, pk):
    try:
        management_info_obj = get_object_or_404(S100_RE_ManagementInfo, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)
    
    if request.method == 'DELETE':
        management_info_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def delete_reference_source(request, pk):
    try:
        reference_source_obj = get_object_or_404(S100_RE_ReferenceSource, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)

    if request.method == 'DELETE':
        reference_source_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def delete_reference(request, pk):
    try:
        reference_obj = get_object_or_404(S100_RE_Reference, pk=pk)
    except S100_RE_RegisterItem.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)

    if request.method == 'DELETE':
        reference_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)
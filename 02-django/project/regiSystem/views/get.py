from django.shortcuts import render
from django.http import HttpResponse

from ..models import S100_RE_Register, S100_RE_RegisterItem, S100_RE_ManagementInfo, S100_RE_Reference, S100_RE_ReferenceSource
from ..serializers import RegisterSerializer, ManagementInfoSerializer, ReferenceSourceSerializer, ReferenceSerializer, RegisterItemSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from django.shortcuts import get_object_or_404, get_list_or_404

@api_view(['GET'])
def register_list(request):
    if request.method == 'GET':
        regist_list = get_list_or_404(S100_RE_Register)
        serializer = RegisterSerializer(regist_list, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def register_detail(request, pk):
    if request.method == 'GET':
        register = get_object_or_404(S100_RE_Register, pk=pk)
        serializer = RegisterSerializer(register)
        return Response(serializer.data)


@api_view(['GET'])
def register_itemList(request, pk):
    if request.method == 'GET':
        register = get_object_or_404(S100_RE_Register, pk=pk)
        serializer = RegisterSerializer(register)

        # 연결된 모델의 정보를 가져와서 시리얼라이징
        register_items = S100_RE_RegisterItem.objects.filter(s100_RE_Register=register)
        register_items_serializer = RegisterItemSerializer(register_items, many=True)

        # 시리얼라이징 결과를 합쳐서 반환
        response_data = {
            'register' : serializer.data,
            'register_items' : register_items_serializer.data
        }
        return Response(response_data)


@api_view(['GET'])
def item_detail(request, pk):
    if request.method == 'GET':
        item = get_object_or_404(S100_RE_RegisterItem, pk=pk)
        item_serializer = RegisterItemSerializer(item)
        
        management_infos = S100_RE_ManagementInfo.objects.filter(s100_RE_RegisterItem=item)
        reference_sources = S100_RE_ReferenceSource.objects.filter(s100_RE_RegisterItem=item)
        references = S100_RE_Reference.objects.filter(s100_RE_RegisterItem=item)
        management_info_serializer = ManagementInfoSerializer(management_infos, many=True)
        reference_source_serializer = ReferenceSourceSerializer(reference_sources, many=True)
        reference_serializer = ReferenceSerializer(references, many=True)
        
        response_data = {
            'item': item_serializer.data,
            'management_infos': management_info_serializer.data,
            'reference_sources': reference_source_serializer.data,
            'references': reference_serializer.data,
        }
        return Response(response_data)
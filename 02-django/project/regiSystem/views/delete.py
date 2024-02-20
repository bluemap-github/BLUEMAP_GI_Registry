from django.shortcuts import render
from django.http import HttpResponse

from ..models import S100_RE_Register, S100_RE_RegisterItem, S100_RE_ManagementInfo, S100_RE_Reference, S100_RE_ReferenceSource
from ..serializers import RegisterSerializer, ManagementInfoSerializer, ReferenceSourceSerializer, ReferenceSerializer, RegisterItemSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from django.shortcuts import get_object_or_404, get_list_or_404

@api_view(['DELETE'])
def register(request, pk):
    register = get_object_or_404(S100_RE_Register, pk=pk)
    if request.method == 'DELETE':
        register.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def item(request, pk):
    item_obj = get_object_or_404(S100_RE_RegisterItem, pk=pk)
    if request.method == 'DELETE':
        item_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def managemant_info(request, pk):
    management_info_obj = get_object_or_404(S100_RE_ManagementInfo, pk=pk)
    if request.method == 'DELETE':
        management_info_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def reference_source(request, pk):
    reference_source_obj = get_object_or_404(S100_RE_ReferenceSource, pk=pk)
    if request.method == 'DELETE':
        reference_source_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def reference(request, pk):
    reference_obj = get_object_or_404(S100_RE_Reference, pk=pk)
    if request.method == 'DELETE':
        reference_obj.delete()
        return Response(status=HTTP_204_NO_CONTENT)
from django.shortcuts import render
from django.http import HttpResponse
from .models import S100_RE_Register, S100_RE_RegisterItem, S100_RE_ManagementInfo, S100_RE_Reference, S100_RE_ReferenceSource
from .sample_data import register_data, item_data, management_info_data, reference_data, reference_source_data

def create_registry(request):
    registry = S100_RE_Register(**register_data)
    registry.save()
    return HttpResponse('register is created')

def create_item(request, pk):
    item_pick = item_data[pk]
    item = S100_RE_RegisterItem(**item_pick)
    item.save()
    return HttpResponse(f'item {pk} is created')

def create_management_info(request, pk):
    item_pick = management_info_data[pk]
    item = S100_RE_ManagementInfo(**item_pick)
    item.save()
    return HttpResponse(f'management info {pk} is created')

def create_reference(request, pk):
    item_pick = reference_data[pk]
    item = S100_RE_Reference(**item_pick)
    item.save()
    return HttpResponse(f'reference {pk} is created')

def create_reference_source(request, pk):
    item_pick = reference_source_data[pk]
    item = S100_RE_ReferenceSource(**item_pick)
    item.save()
    return HttpResponse(f'reference source {pk} is created')
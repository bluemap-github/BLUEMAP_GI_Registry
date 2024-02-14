from django.shortcuts import render
from django.http import HttpResponse
from .models import S100_RE_Register, S100_RE_RegisterItem, S100_RE_ManagementInfo, S100_RE_Reference, S100_RE_ReferenceSource
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

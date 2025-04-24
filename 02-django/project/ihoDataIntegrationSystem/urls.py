from django.urls import path

from .views.ihoData import (integrateIho, get, post)

app_name = 'regiSystem'
urlpatterns = [
    # iho 데이터 동기화 
    path('sync/item_list/', integrateIho.sync_iho_data),
    path('fetch/item-preview/', integrateIho.sync_iho_data_one),
    
    # Concept
    path('concept_item_list/get/', get.iho_concept_item_list),
    path('concept_item_one/get/', get.iho_concept_item_one),
    path('concept_management_info/get/', get.iho_concept_management_info),
    path('concept_reference/get/', get.iho_concept_reference),
    path('concept_reference_source/get/', get.iho_concept_reference_source),

    path('concept_item/post/', post.iho_concept_item),
    path('enumerated_value/post/', post.iho_enumerated_value),
    path('simple_attribute/post/', post.iho_simple_attribute),
    path('complex_attribute/post/', post.iho_complex_attribute),
    path('feature/post/', post.iho_feature),
    path('information/post/', post.iho_information_type),
    path('concept_management_info/post/', post.iho_concept_management_info),
    path('concept_reference/post/', post.iho_concept_reference),    
    path('concept_reference_source/post/', post.iho_concept_reference_source),

    # DDR 
    path('ddr_item_list/get/', get.iho_DDR_item_list),
    path('ddr_item_one/get/', get.iho_DDR_item_one),

    
    path('related_item/search/', get.iho_related_item),
]
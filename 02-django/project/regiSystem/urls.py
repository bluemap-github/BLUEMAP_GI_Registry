from django.urls import path

from .views import (RE, CD, SEARCH)

app_name = 'regiSystem'
urlpatterns = [
    # CR
    # Register
    path('concept_register_list/get/', RE.get.concept_register_list),  
    path('concept_register/get/', RE.get.concept_register_detail),  
    path('concept_register/post/', RE.post.concept_register), 
    path('concept_register/put/<str:C_id>/', RE.put.concept_register),  
    path('concept_register/delete/<str:C_id>/', RE.delete.concept_register),  

    # RegisterItem
    path('concept_item/item/post/', CD.post.concept_item),
    path('concept_item_list/get/', RE.get.concept_item_list), 
    path('concept_item_one/get/', RE.get.concept_item_one), 
    path('concept_item/delete/<str:I_id>/', RE.delete.concept_item), 

    # ManagementInfo
    path('concept_item/mamagement_info/get/', RE.get.concept_managemant_info), 
    path('concept_item/mamagement_info/post/', RE.post.mamagement_info), 
    path('concept_item/mamagement_info/put/', RE.put.concept_managemant_info), 
    path('concept_item/mamagement_info/delete/<str:M_id>/', RE.delete.concept_managemant_info), 

    # ReferenceSource
    path('concept_item/reference_source/get/', RE.get.concept_reference_source), 
    path('concept_item/reference_source/post/', RE.post.reference_source), 
    path('concept_item/reference_source/put/', RE.put.concept_reference_source), 
    path('concept_item/reference_source/delete/<str:RS_id>/', RE.delete.concept_reference_source), 

    # Reference
    path('concept_item/reference/get/', RE.get.concept_reference), 
    path('concept_item/reference/post/', RE.post.reference), 
    path('concept_item/reference/put/', RE.put.concept_reference), 
    path('concept_item/reference/delete/<str:R_id>/', RE.delete.concept_reference), 

    # DDR
    path('ddr_item_list/get/', CD.get.ddr_item_list),
    path('ddr_item_one/get/', CD.get.ddr_item_one),

    # EnumeratedValue
    path('enumerated_value/post/', CD.post.enumerated_value), 

    # SimpleAttrbute
    path('simple_attribute/post/', CD.post.simple_attribute), 

    # AttributeConstraints
    path('attribute_constraints/post/', CD.post.attribute_constraints),
    
    # ComplexAttribute 
    path('complex_attribute/post/', CD.post.complex_attribute), 

    # Feature
    path('feature/post/', CD.post.feature), 

    # Information
    path('information/post/', CD.post.information), 

    # RelatedValue
    path('related_item/search/', SEARCH.search.related_item),
]


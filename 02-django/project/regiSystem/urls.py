from django.urls import path

from .views import (RE, CD)

app_name = 'regiSystem'
urlpatterns = [
    # CR
    # Register
    path('concept_register_list/get/', RE.get.concept_register_list),  
    path('concept_register/get/<str:C_id>/', RE.get.concept_register_detail),  
    path('concept_register/post/', RE.post.concept_register), 
    path('concept_register/put/<str:C_id>/', RE.put.concept_register),  
    path('concept_register/delete/<str:C_id>/', RE.delete.concept_register),  

    # RegisterItem
    path('concept_item_list/get/', RE.get.concept_item_list),
    path('concept_item_detail/get/', RE.get.concept_item_detail),
    path('concept_item/post/', RE.post.concept_item), 
    path('concept_item/put/<str:I_id>/', RE.put.concept_item), #😂
    path('concept_item/delete/<str:I_id>/', RE.delete.concept_item), #😂

    # ManagementInfo
    path('concept_item/mamagement_info/post/<str:I_id>/', RE.post.concept_managemant_info), #😂
    path('concept_item/mamagement_info/put/<str:I_id>/', RE.put.concept_managemant_info), #😂
    path('concept_item/mamagement_info/delete/<str:M_id>/', RE.delete.concept_managemant_info), #😂

    # ReferenceSource
    path('concept_item/reference_source/post/<str:I_id>/', RE.post.concept_reference_source), #😂
    path('concept_item/reference_source/put/<str:I_id>/', RE.put.concept_reference_source), #😂
    path('concept_item/reference_source/delete/<str:RS_id>/', RE.delete.concept_reference_source), #😂

    # Reference
    path('concept_item/reference/post/<str:I_id>/', RE.post.concept_reference), #😂
    path('concept_item/reference/put/<str:I_id>/', RE.put.concept_reference), #😂
    path('concept_item/reference/delete/<str:R_id>/', RE.delete.concept_reference), #😂

    # DDR
    # EnumeratedValue
    path('enumerated_value_list/get/', CD.get.enumerated_value_list),
    path('enumerated_value_one/get/', CD.get.enumerated_value_one),
    path('enumerated_value/post/<str:C_id>/', CD.post.enumerated_value), #😂
    # path('enumerated_value_list/put/<str:EV_id>/', put.enumerated_value),
    # path('enumerated_value_list/delete/<str:EV_id>/', delete.enumerated_value),

    # SimpleAttrbute
    path('simple_attribute_list/get/', CD.get.simple_attribute_list), 
    path('simple_attribute_one/get/', CD.get.simple_attribute_one),
    path('simple_attribute/post/<str:C_id>/', CD.post.simple_attribute), #😂

    # AttributeConstraints

    # ComplexAttribute 
    path('complex_attribute_list/get/', CD.get.complex_attribute_list),
    path('complex_attribute_one/get/', CD.get.complex_attribute_one),
    path('complex_attribute/post/<str:C_id>/', CD.post.complex_attribute), #😂

    # Feature
    path('feature_list/get/', CD.get.feature_list),
    path('feature_one/get/', CD.get.feature_one),
    path('feature/post/<str:C_id>/', CD.post.feature), #😂

    # Information
    path('information_list/get/', CD.get.information_list),
    path('information_one/get/', CD.get.information_one),
    path('information/post/<str:C_id>/', CD.post.information), #😂

    # RelatedValue
    path('not_related_enum_list_search/get/', CD.get.not_related_enum_list_search),
    path('sub_att_list_search/get/', CD.get.sub_att_list_search),
]


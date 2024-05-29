from django.urls import path
from .views import (get, post, put, delete)

app_name = 'regiSystem'
urlpatterns = [
    # CR
    # Register
    path('concept_register_list/get/', get.concept_register_list),  
    path('concept_register/get/<str:C_id>/', get.concept_register_detail),  
    path('concept_register/post/', post.concept_register), 
    path('concept_register/put/<str:C_id>/', put.concept_register),  
    path('concept_register/delete/<str:C_id>/', delete.concept_register),  

    # RegisterItem
    path('concept_item_list/get/<str:C_id>/', get.concept_item_list),
    path('concept_item/get/<str:I_id>/', get.concept_item_detail), 
    path('concept_item/post/', post.concept_item), 
    path('concept_item/put/<str:I_id>/', put.concept_item),
    path('concept_item/delete/<str:I_id>/', delete.concept_item),

    # ManagementInfo
    path('concept_item/mamagement_info/post/<str:I_id>/', post.concept_managemant_info),
    path('concept_item/mamagement_info/put/<str:I_id>/', put.concept_managemant_info),
    path('concept_item/mamagement_info/delete/<str:M_id>/', delete.concept_managemant_info),

    # ReferenceSource
    path('concept_item/reference_source/post/<str:I_id>/', post.concept_reference_source),
    path('concept_item/reference_source/put/<str:I_id>/', put.concept_reference_source),
    path('concept_item/reference_source/delete/<str:RS_id>/', delete.concept_reference_source),

    # Reference
    path('concept_item/reference/post/<str:I_id>/', post.concept_reference),
    path('concept_item/reference/put/<str:I_id>/', put.concept_reference),
    path('concept_item/reference/delete/<str:R_id>/', delete.concept_reference),

    # DDR
    # EnumeratedValue
    path('enumerated_value_list/get/<str:C_id>/', get.enumerated_value_list),
    path('enumerated_value_list/get/<str:EV_id>/', get.enumerated_value_one),
    path('enumerated_value/post/<str:C_id>/', post.enumerated_value),
    # path('enumerated_value_list/put/<str:EV_id>/', put.enumerated_value),
    # path('enumerated_value_list/delete/<str:EV_id>/', delete.enumerated_value),

    # SimpleAttrbute
    path('simple_attribute_list/get/<str:C_id>/', get.simple_attribute_list),
    path('simple_attribute/post/<str:C_id>/', post.simple_attribute),

    # AttributeConstraints

]
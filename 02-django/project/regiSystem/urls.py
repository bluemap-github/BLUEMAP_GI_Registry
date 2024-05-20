from django.urls import path
from .views import (get, post, put, delete, sample)

app_name = 'regiSystem'
urlpatterns = [
    # Register✅
    ## 레지스터 리스트 조회✅
    path('concept_register_list/get/', get.concept_register_list),  
    ## 레지스터 정보 조회✅
    path('concept_register/get/<str:C_id>/', get.concept_register_detail),  
    ## 레지스터 생성✅
    path('concept_register/post/', post.concept_register), 
    ## 레지스터 변경✅
    path('concept_register/put/<str:C_id>/', put.concept_register),  
    ## 레지스터 삭제✅
    path('concept_register/delete/<str:C_id>/', delete.concept_register),  

    # RegisterItem
    ## 레지스터에 등록된 아이템 리스트 조회
    path('<int:pk>/itemList/', get.register_itemList), 
    path('concept_item_list/get/<str:C_id>/', get.concept_item_list), #✅✅
    ## 아이템 개별 조회
    path('registerItem/<int:pk>/', get.item_detail), 
    path('concept_item/get/<str:I_id>/', get.concept_item_detail), #✅✅
    ## 아이템 생성
    path('registerItem/<int:pk>/post/', post.item),
    path('concept_item/post/', post.concept_item), #✅✅
    ## 아이템 수정
    path('registerItem/<int:pk>/put/', put.item),
    path('concept_item/put/<str:I_id>/', put.concept_item),#✅✅
    ## 아이템  
    path('registerItem/<int:pk>/delete/', delete.item),
    path('concept_item/delete/<str:I_id>/', delete.concept_item),#✅✅

    # ManagementInfo
    ## ManagementInfo 생성
    path('registerItem/<int:pk>/managementInfo/post/', post.managemant_info),
    path('concept_item/mamagement_info/post/<str:I_id>/', post.concept_managemant_info),#✅✅
    ## ManagementInfo 수정
    path('registerItem/managementInfo/<int:pk>/put/', put.managemant_info),
    path('concept_item/mamagement_info/put/<str:I_id>/', put.concept_managemant_info),#✅✅
    ## ManagementInfo 삭제
    path('registerItem/managementInfo/<int:pk>/delete/', delete.managemant_info),
    path('concept_item/mamagement_info/delete/<str:M_id>/', delete.concept_managemant_info),#✅✅

    # ReferenceSource
    ## ReferenceSource 생성
    path('registerItem/<int:pk>/referenceSource/post/', post.reference_source),
    path('concept_item/reference_source/post/<str:I_id>/', post.concept_reference_source),#✅✅
    ## ReferenceSource 수정
    path('registerItem/referenceSource/<int:pk>/put/', put.reference_source),
    path('concept_item/reference_source/put/<str:I_id>/', put.concept_reference_source),#✅✅
    ## ReferenceSource 삭제
    path('registerItem/referenceSource/<int:pk>/delete/', delete.reference_source),
    path('concept_item/reference_source/delete/<str:RS_id>/', delete.concept_reference_source),#✅✅

    # Reference
    ## Reference 생성
    path('registerItem/<int:pk>/reference/post/', post.reference),
    path('concept_item/reference/post/<str:I_id>/', post.concept_reference),#✅✅
    ## Reference 수정
    path('registerItem/reference/<int:pk>/put/', put.reference),
    path('concept_item/reference/put/<str:I_id>/', put.concept_reference),#✅✅
    ## Reference 삭제
    path('registerItem/reference/<int:pk>/delete/', delete.reference),
    path('concept_item/reference/delete/<str:R_id>/', delete.concept_reference),#✅✅

    ## sample
    path('sample_post/', sample.create_student_info),
    path('get_student_list/', sample.get_student_list),
    
    path('classroom_get/', sample.get_classroom),
    path('classroom_post/', sample.create_classroom),

    path('get_student/<str:student_id>/', sample.get_student_info)
]
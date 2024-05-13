from django.urls import path
from .views import (get, post, put, delete, sample)

app_name = 'movies'
urlpatterns = [
    # Register
    ## 레지스터 리스트 조회 (임시)
    path('registerList/', get.register_list),  
    ## 레지스터 정보 조회
    path('register/<int:pk>/', get.register_detail),  
    ## 레지스터 생성
    path('register/post/', post.register), 
    ## 레지스터 변경
    path('register/<int:pk>/put/', put.register),  
    ## 레지스터 삭제
    path('register/<int:pk>/delete/', delete.register),  

    # RegisterItem
    ## 레지스터에 등록된 아이템 리스트 조회
    path('register/<int:pk>/itemList/', get.register_itemList), 
    ## 아이템 개별 조회
    path('registerItem/<int:pk>/', get.item_detail), 
    ## 아이템 생성
    path('registerItem/<int:pk>/post/', post.item),
    ## 아이템 수정
    path('registerItem/<int:pk>/put/', put.item),
    ## 아이템 삭제
    path('registerItem/<int:pk>/delete/', delete.item),

    # ManagementInfo
    ## ManagementInfo 생성
    path('registerItem/<int:pk>/managementInfo/post/', post.managemant_info),
    ## ManagementInfo 수정
    path('registerItem/managementInfo/<int:pk>/put/', put.managemant_info),
    ## ManagementInfo 삭제
    path('registerItem/managementInfo/<int:pk>/delete/', delete.managemant_info),

    # ReferenceSource
    ## ReferenceSource 생성
    path('registerItem/<int:pk>/referenceSource/post/', post.reference_source),
    ## ReferenceSource 수정
    path('registerItem/referenceSource/<int:pk>/put/', put.reference_source),
    ## ReferenceSource 삭제
    path('registerItem/referenceSource/<int:pk>/delete/', delete.reference_source),

    # Reference
    ## Reference 생성
    path('registerItem/<int:pk>/reference/post/', post.reference),
    ## Reference 수정
    path('registerItem/reference/<int:pk>/put/', put.reference),
    ## Reference 삭제
    path('registerItem/reference/<int:pk>/delete/', delete.reference),

    ## sample
    path('sample_post/', sample.create_student_info),
    path('sample_get/', sample.get_student_info),
    
    path('classroom_get/', sample.get_classroom),
    path('classroom_post/', sample.create_classroom)
]
from django.urls import path

from openApiSystem.views.concept import (get, post, put, delete)

app_name = 'openApiSystem'
urlpatterns = [
    path('get/item_list/', get.item_list),
    path('get/item_detail/', get.item_detail),
    path('get/management_info_list/', get.management_info_list_related_item),
    path('get/reference_list/', get.reference_list_related_item),
    path('get/reference_source/', get.reference_source_related_item),    

    path('post/item/', post.item),
    path('post/management_info/', post.management_info),
    path('post/reference/', post.reference),
    path('post/reference_source/', post.reference_source),

    path('put/item/', put.item),
    path('put/management_info/', put.management_info),
    path('put/reference/', put.reference),
    path('put/reference_source/', put.reference_source),

    path('delete/item/', delete.item),
    path('delete/management_info/', delete.management_info),
    path('delete/reference/', delete.reference),
    path('delete/reference_source/', delete.reference_source),
]
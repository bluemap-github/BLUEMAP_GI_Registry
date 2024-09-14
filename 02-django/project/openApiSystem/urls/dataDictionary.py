from django.urls import path

from openApiSystem.views.dataDictionary import (get, post, put, delete)

app_name = 'openApiSystem'
urlpatterns = [
    path('get/enumerated_value_list/', get.enumerated_value_list),
    path('get/enumerated_value_detail/', get.enumerated_value_detail),
    path('get/attribute_list/', get.attribute_list),
    path('get/simple_attribute_list/', get.simple_attribute_list),
    path('get/simple_attribute_detail/', get.simple_attribute_detail),
    path('get/complex_attribute_list/', get.complex_attribute_list),
    path('get/complex_attribute_detail/', get.complex_attribute_detail),
    path('get/feature_list/', get.feature_list),
    path('get/feature_detail/', get.feature_detail),
    path('get/information_list/', get.information_list),
    path('get/information_detail/', get.information_detail),

    # path('post/enumerated_value/', post.enumerated_value),
    # path('post/simple_attribute/', post.simple_attribute),
    # path('post/complex_attribute/', post.complex_attribute),
    # path('post/feature/', post.feature),
    # path('post/information/', post.information),

    # path('put/enumerated_value/', put.enumerated_value),
    # path('put/simple_attribute/', put.simple_attribute),
    # path('put/complex_attribute/', put.complex_attribute),
    # path('put/feature/', put.feature),
    # path('put/information/', put.information),

    # path('delete/enumerated_value/', delete.enumerated_value),
    # path('delete/simple_attribute/', delete.simple_attribute),
    # path('delete/complex_attribute/', delete.complex_attribute),
    # path('delete/feature/', delete.feature),
    # path('delete/information/', delete.information),
]
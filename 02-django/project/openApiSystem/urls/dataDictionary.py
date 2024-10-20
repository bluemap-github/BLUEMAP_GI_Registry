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

    path('post/enumerated_value/', post.enumerated_value),
    path('post/simple_attribute/', post.simple_attribute),
    path('post/complex_attribute/', post.complex_attribute),
    path('post/feature/', post.feature),
    path('post/information/', post.information),

    path('put/enumerated_value/', put.enumerated_value),
    path('put/simple_attribute/', put.simple_attribute),
    path('put/complex_attribute/', put.complex_attribute),
    path('put/feature/', put.feature),
    path('put/information/', put.information),

    path('post/associated_attribute/', post.associated_attribute),
    path('post/sub_attribute/', post.sub_attribute),
    path('post/distinction/', post.distinction),

    path('put/associated_attribute/', put.associated_attribute),
    path('put/sub_attribute/', put.sub_attribute),
    path('put/distinction/', put.distinction),

    path('delete/associated_attribute/', delete.associated_attribute),
    path('delete/sub_attribute/', delete.sub_attribute),
    path('delete/distinction/', delete.distinction),

    path('get/associated_attribute_list/', get.associated_attribute_list),
    path('get/sub_attribute_list/', get.sub_attribute_list),
    path('get/distinction_list/', get.distinction_list),
]
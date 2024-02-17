from django.urls import path
from . import views

app_name = 'movies'
urlpatterns = [
    # GET
    path('createRegistry/', views.create_sample),
    path('register/<int:pk>/', views.register_detail),
    path('itemList/', views.item_list),
    path('registerItem/<int:pk>/', views.item_detail),
    # POST
    path('registerItem/add/', views.create_item),
    path('registerItem/<int:pk>/managementInfo/add/', views.create_managemant_info),
    path('registerItem/<int:pk>/referenceSource/add/', views.create_reference_source),
    path('registerItem/<int:pk>/reference/add/', views.create_reference),
    # PUT
    path('registerItem/<int:pk>/put/', views.put_item),
    path('registerItem/managementInfo/<int:pk>/put/', views.put_managemant_info),
    path('registerItem/referenceSource/<int:pk>/put/', views.put_reference_source),
    path('registerItem/reference/<int:pk>/put/', views.put_reference),
    #DELETE
    path('registerItem/<int:pk>/delete/', views.delete_item),
    path('registerItem/managementInfo/<int:pk>/delete/', views.delete_managemant_info),
    path('registerItem/referenceSource/<int:pk>/delete/', views.delete_reference_source),
    path('registerItem/reference/<int:pk>/delete/', views.delete_reference),
]
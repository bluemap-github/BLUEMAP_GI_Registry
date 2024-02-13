from django.urls import path
from . import views

app_name = 'movies'
urlpatterns = [
    path('createRegistry/', views.create_registry),
    path('createItems/<int:pk>/', views.create_item),
    path('createManagementInfo/<int:pk>/', views.create_management_info),
    path('createReference/<int:pk>/', views.create_reference),
    path('createReferenceSource/<int:pk>/', views.create_reference_source),
]
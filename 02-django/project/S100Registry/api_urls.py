from django.urls import re_path, include

urlpatterns = [
    re_path('api/v1/', include('regiSystem.urls')),
    re_path('user/', include('userSystem.urls')),
]

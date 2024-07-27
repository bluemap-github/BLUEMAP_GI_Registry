# userSystem/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('check-email/', views.check_email, name='check_email'),  # 이메일 중복 검사 엔드포인트 추가
    path('check-auth/', views.check_auth, name='check_auth'),
    path('registery_list/get/', views.get_registry_list, name='get_registry_list'),
]

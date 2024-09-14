from django.urls import path

from . import views

app_name = 'userSystem'
urlpatterns = [
    path('signup/', views.signup),
    path('login/', views.login),
    path('check-email/', views.check_email, name='check_email'),  # 이메일 중복 검사 엔드포인트 추가
    path('check-auth/', views.check_auth, name='check_auth'),
    path('registery_list/get/', views.get_registry_list, name='get_registry_list'),
    path('register_info_for_guest/get/', views.register_info_for_guest),
]

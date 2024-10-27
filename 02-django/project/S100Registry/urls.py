from django.contrib import admin
from django.urls import re_path, include

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings

# Swagger에 표시할 API들만 정의
allow_patterns = [
    re_path('concept/', include('openApiSystem.urls.concept', namespace='openApi_concept')),
    re_path('dataDictionary/', include('openApiSystem.urls.dataDictionary', namespace='openApi_dataDictionary')),
    re_path('portrayal/', include('openApiSystem.urls.portrayal', namespace='openApi_portrayal')),
    re_path('registry/', include('openApiSystem.urls.registry', namespace='openApiSystem_registry')),
]

# Swagger 설정
schema_view = get_schema_view(
    openapi.Info(
        title="BLUEMAP GI Registry",
        default_version='0.0.3',
        description="GI Registry OpenAPI",
        terms_of_service="https://www.google.com/policies/terms/",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    patterns=allow_patterns,  # Swagger에서 보일 패턴들
    url=settings.API_BASE_URL
)

# 전체 URL 패턴 정의
urlpatterns = [
    re_path(r'swagger(?P<format>\.json|\.yaml)', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'swagger', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'redoc', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc-v1'),
    re_path('admin/', admin.site.urls),

    re_path('api/v1/', include('regiSystem.urls')),
    re_path('user/', include('userSystem.urls')),
]

# allow_patterns의 URL 패턴을 urlpatterns에 병합
urlpatterns += allow_patterns

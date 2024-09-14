from django.urls import re_path, include

urlpatterns = [
    re_path('concept/', include('openApiSystem.urls.concept')),
    re_path('dataDictionary/', include('openApiSystem.urls.dataDictionary')),
    re_path('portrayal/', include('openApiSystem.urls.portrayal')),
]

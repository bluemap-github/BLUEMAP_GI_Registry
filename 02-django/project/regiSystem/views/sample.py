from django.http import HttpResponse
from ..models import collections
from rest_framework.decorators import api_view

@api_view(['POST'])
def create_student_info(request):
    print(request.data)
    content = request.data
    collections.insert_one(content)
    return HttpResponse("create successfully!")
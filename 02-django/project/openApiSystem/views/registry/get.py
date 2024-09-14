from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response

def item(request):
    return Response({'message': 'Hello, world!'})

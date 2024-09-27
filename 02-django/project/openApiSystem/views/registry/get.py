from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING)
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING)
itemID = openapi.Parameter('itemID', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

def item(request):
    return Response({'message': 'Hello, world!'})

from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import api_view
from rest_framework.response import Response

regiURI = openapi.Parameter('regiURI', openapi.IN_QUERY, description='registry uri', required=True, type=openapi.TYPE_STRING, default='test')
serviceKey = openapi.Parameter('serviceKey', openapi.IN_QUERY, description='service key', required=True, type=openapi.TYPE_STRING, default='0000')
association_id = openapi.Parameter('association_id', openapi.IN_QUERY, description='item id', required=True, type=openapi.TYPE_STRING)

from openApiSystem.models.dataDictionary.association import (
    CD_AttributeUsage, DD_associatedAttribute, DD_distinction)

@swagger_auto_schema(
    method='delete',
    manual_parameters=[regiURI, serviceKey, association_id],
)
@api_view(['DELETE'])
def associated_attribute(request):
    association_id = request.GET.get('association_id')
    DD_associatedAttribute.delete_association(association_id)
    return Response({"status": "success", "message": "Associated attribute deleted"}, status=200)


@api_view(['DELETE'])
def sub_attribute(request):
    association_id = request.GET.get('association_id')
    CD_AttributeUsage.delete_association(association_id)
    return Response({"status": "success", "message": "Sub attribute deleted"}, status=200)

@api_view(['DELETE'])
def distinction(request):
    association_id = request.GET.get('association_id')
    DD_distinction.delete_association(association_id)
    return Response({"status": "success", "message": "Distinction deleted"}, status=200)



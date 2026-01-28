from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from ihoDataIntegrationSystem.models import (IHO_Item, IHO_ManagementInfo, 
                                             IHO_Reference, IHO_ReferenceSource, 
                                             IHO_ListedValue, IHO_AttributeUsage)
from regiSystem.serializers.CD import (
        SimpleAttributeSerializer,
        EnumeratedValueSerializer,
        ComplexAttributeSerializer,
        FeatureSerializer,
        InformationSerializer,
)

from regiSystem.serializers.RE import (
        ConceptItemSerializer,
        ConceptManagementInfoSerializer,
        ConceptReferenceSourceSerializer,
        ConceptReferenceSerializer,
)
from regiSystem.views.CD.put import query_simple_attribute
@api_view(['PUT'])
def iho_simple_attribute(request):
    return query_simple_attribute(
        request=request,
        serializer_class=SimpleAttributeSerializer,
        db_class=IHO_Item,
    )

@api_view(['PUT'])
def iho_enumerated_value(request):
    return query_simple_attribute(
        request=request,
        serializer_class=EnumeratedValueSerializer,
        db_class=IHO_Item,
    )

@api_view(['PUT'])
def iho_complex_attribute(request):
    return query_simple_attribute(
        request=request,
        serializer_class=ComplexAttributeSerializer,
        db_class=IHO_Item,
    )
@api_view(['PUT'])
def iho_feature(request):
    return query_simple_attribute(
        request=request,
        serializer_class=FeatureSerializer,
        db_class=IHO_Item,
    )

@api_view(['PUT'])
def iho_information_type(request):
    return query_simple_attribute(
        request=request,
        serializer_class=InformationSerializer,
        db_class=IHO_Item,
    )

SERIALIZER_MAP = {
    "SimpleAttribute": SimpleAttributeSerializer,
    "EnumeratedValue": EnumeratedValueSerializer,
    "ComplexAttribute": ComplexAttributeSerializer,
    "FeatureType": FeatureSerializer,
    "InformationType": InformationSerializer
}

@api_view(['PUT'])
def iho_concept_item(request):
    item_type = request.GET.get('item_type')
    
    serializer_class = SERIALIZER_MAP.get(item_type)
    if not serializer_class:
        return Response({"error": f"Invalid item_type: {item_type}"}, status=400)

    return query_simple_attribute(
        request=request,
        serializer_class=serializer_class,
        db_class=IHO_Item,
    )

@api_view(['PUT'])
def iho_concept_management_info(request):
    return query_simple_attribute(
        request=request,
        serializer_class=ConceptManagementInfoSerializer,
        db_class=IHO_ManagementInfo,
    )

@api_view(['PUT'])
def iho_concept_reference(request):
    return query_simple_attribute(
        request=request,
        serializer_class=ConceptReferenceSerializer,
        db_class=IHO_Reference,
    )

@api_view(['PUT'])
def iho_concept_reference_source(request):
    return query_simple_attribute(
        request=request,
        serializer_class=ConceptReferenceSourceSerializer,
        db_class=IHO_ReferenceSource,
    )
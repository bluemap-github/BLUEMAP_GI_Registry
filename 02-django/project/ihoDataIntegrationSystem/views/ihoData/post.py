### CD > post > concept_item
### CD > post > enumerated_value
### CD > post > simple_attribute
### CD > post > complex_attribute
### CD > post > feature
### CD > post > information_type

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
        AttributeConstraintsSerializer,
        AttributeUsageSerializer
)

from regiSystem.serializers.RE import (
        ConceptItemSerializer,
        ConceptManagementInfoSerializer,
        ConceptReferenceSourceSerializer,
        ConceptReferenceSerializer,
)

from regiSystem.views.RE.post import query_concept_additional_info, reference_source, reference
from regiSystem.views.CD.post import (query_concept_item, query_enumerated_value, query_simple_attribute, 
                                      query_complex_attribute, feature, information)
from pprint import pprint

@swagger_auto_schema(method='post', request_body=ConceptItemSerializer)
@api_view(['POST'])
def iho_concept_item(request):
    return query_concept_item(
        request=request,
        serializer_class=ConceptItemSerializer,
        db_class=IHO_Item,
        concept_id="----"  # 공용 concept_id로 저장
    )
from rest_framework import serializers
class EnumeratedValueAPISerializer(EnumeratedValueSerializer):
    attributeId = serializers.JSONField(default=list) 
    
@swagger_auto_schema(method='post', request_body=EnumeratedValueAPISerializer)
@api_view(['POST'])
def iho_enumerated_value(request):
    print(request.data)
    return query_enumerated_value(
        request=request,
        serializer_class=EnumeratedValueSerializer,
        db_class=IHO_Item,
        concept_id="----",  # 공용 concept_id로 저장
        listed_value=IHO_ListedValue
    )

@api_view(['POST'])
def iho_simple_attribute(request):
    return query_simple_attribute(
        request=request,
        db_class=IHO_Item,
        concept_id="----",  # 공용 concept_id로 저장
    )
    

@api_view(['POST'])
def iho_complex_attribute(request):
    return query_complex_attribute(
        request=request,
        db_class=IHO_Item,
        concept_id="----",  # 공용 concept_id로 저장
        attribute_usage=IHO_AttributeUsage,
    )

@api_view(['POST'])
def iho_feature(request):
    return query_concept_item(
        request=request,
        serializer_class=FeatureSerializer,
        db_class=IHO_Item,
        concept_id="----"  # 공용 concept_id로 저장
    )

@api_view(['POST'])
def iho_information_type(request):
    return query_concept_item(
        request=request,
        serializer_class=InformationSerializer,
        db_class=IHO_Item,
        concept_id="----"  # 공용 concept_id로 저장
    )

@swagger_auto_schema(method='post', request_body=ConceptManagementInfoSerializer)
@api_view(['POST'])
def iho_concept_management_info(request):
    return query_concept_additional_info(
        request=request,
        serializer_class=ConceptManagementInfoSerializer,
        db_class=IHO_ManagementInfo
    )
@api_view(['POST'])
def iho_concept_reference(request):
    return query_concept_additional_info(
        request=request,
        serializer_class=ConceptReferenceSerializer,
        db_class=IHO_Reference
    )

@api_view(['POST'])
def iho_concept_reference_source(request):
    return query_concept_additional_info(
        request=request,
        serializer_class=ConceptReferenceSourceSerializer,
        db_class=IHO_ReferenceSource
    )
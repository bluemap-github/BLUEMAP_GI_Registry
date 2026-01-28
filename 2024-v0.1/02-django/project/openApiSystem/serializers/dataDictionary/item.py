from rest_framework import serializers
from openApiSystem.serializers.registry.item import (
    RE_ItemSerializer,
)
class ConceptSerializer(RE_ItemSerializer):
    pass

class CD_EnumeratedValueSerializer(ConceptSerializer):
    numericCode = serializers.CharField(allow_blank=True)
    enumType = serializers.CharField()
    itemType = serializers.CharField(default='EnumeratedValue')

class CD_AttributeSerializer(ConceptSerializer):
    pass

class CD_SimpleAttributeSerializer(CD_AttributeSerializer):
    valueType = serializers.CharField()# Enum - S100_CD_AttributeValueType
    quantitySpecification = serializers.CharField(allow_blank=True)
    itemType = serializers.CharField(default='SimpleAttribute')

class CD_ComplexAttributeSerializer(CD_AttributeSerializer):
    itemType = serializers.CharField(default='ComplexAttribute')

class CD_FeatureSerializer(ConceptSerializer):
    featureUseType = serializers.CharField() 
    itemType = serializers.CharField(default='Feature')

class CD_InformationSerializer(ConceptSerializer):
    itemType = serializers.CharField(default='Information')
    
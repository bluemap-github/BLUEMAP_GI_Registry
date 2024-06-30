from rest_framework import serializers
from regiSystem.serializers.RE import (
    ConceptItemSerializer,
    ObjectIdField
)

class AttributeSerializer(ConceptItemSerializer):
    pass

class EnumeratedValueSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)
    numericCode = serializers.IntegerField()
    enumType = serializers.CharField()# Enum - S100_CD_EnumType
    attributeId = serializers.CharField(allow_blank=True)


class SimpleAttributeSerializer(AttributeSerializer):
    _id = ObjectIdField(read_only=True)
    valueType = serializers.CharField()# Enum - S100_CD_AttributeValueType
    quantitySpecification = serializers.CharField()# Enum - S100_CD_QuantitySpecification
    listedValue = serializers.JSONField(default=list) 

class AttributeConstraintsSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    stringLength = serializers.IntegerField()
    textPattern = serializers.CharField()
    ACRange = serializers.CharField()
    precision = serializers.IntegerField()

class ComplexAttributeSerializer(AttributeSerializer):
    _id = ObjectIdField(read_only=True)
    subAttribute = serializers.JSONField(default=list) 

class AttributeUsageSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    multiplicity = serializers.CharField()
    sequential = serializers.BooleanField()

class FeatureSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)
    featureUseType = serializers.CharField()# Enum - S100_CD_FeatureUseType
    distinctedFeature = serializers.JSONField(default=list) 

class InformationSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)
    distinctedInformation = serializers.JSONField(default=list) 

class RelatedValueListSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
from rest_framework import serializers
from regiSystem.serializers.RE import (
    ConceptItemSerializer,
    ObjectIdField
)

class EnumeratedValueSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)
    numericCode = serializers.IntegerField()
    enumType = serializers.CharField()# Enum - S100_CD_EnumType
    attributeId = ObjectIdField(read_only=True)

class AttributeSerializer(ConceptItemSerializer):
    pass

class SimpleAttributeSerializer(AttributeSerializer):
    _id = ObjectIdField(read_only=True)
    valueType = serializers.CharField()# Enum - S100_CD_AttributeValueType
    quantitySpecification = serializers.CharField()# Enum - S100_CD_QuantitySpecification
    listedValue = serializers.JSONField(default=list) 

class ComplexAttributeSerializer(AttributeSerializer):
    _id = ObjectIdField(read_only=True)
    subAttribute = serializers.JSONField(default=list) 

class FeatureSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)
    featureUseType = serializers.CharField()# Enum - S100_CD_FeatureUseType
    distinctedFeature = serializers.JSONField(default=list) 

class InformationSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)
    distinctedInformation = serializers.JSONField(default=list) 

class AttributeConstraintsSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    stringLength = serializers.CharField(allow_blank=True)
    textPattern = serializers.CharField(allow_blank=True)
    ACRange = serializers.CharField(allow_blank=True)
    precision = serializers.CharField(allow_blank=True)

class MultiplicitySerializer(serializers.Serializer):
    lower = serializers.IntegerField()
    upper = serializers.IntegerField()

class AttributeUsageSerializer(MultiplicitySerializer):
    _id = ObjectIdField(read_only=True)
    sequential = serializers.BooleanField()

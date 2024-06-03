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
    associated_arrtibute_id = serializers.CharField(allow_blank=True)


class SimpleAttributeSerializer(AttributeSerializer):
    _id = ObjectIdField(read_only=True)
    valueType = serializers.CharField()# Enum - S100_CD_AttributeValueType
    quantitySpecification = serializers.CharField()# Enum - S100_CD_QuantitySpecification
    related_enumeration_value_id_list = serializers.JSONField(default=list) 

class AttributeConstraintsSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    stringLength = serializers.IntegerField()
    textPattern = serializers.CharField()
    ACRange = serializers.CharField()
    precision = serializers.IntegerField()

class ComplexAttributeSerializer(AttributeSerializer):
    _id = ObjectIdField(read_only=True)

class AttributeUsageSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    multiplicity = serializers.CharField()
    sequential = serializers.BooleanField()

class FeatureSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)
    featureUseType = serializers.CharField()# Enum - S100_CD_FeatureUseType

class InformationSerializer(ConceptItemSerializer):
    _id = ObjectIdField(read_only=True)

class RelatedValueListSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
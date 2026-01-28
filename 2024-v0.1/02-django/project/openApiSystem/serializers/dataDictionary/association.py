from rest_framework import serializers


class AttributeConstraintsSerializer(serializers.Serializer):
    stringLength = serializers.CharField(allow_blank=True)
    textPattern = serializers.CharField(allow_blank=True)
    ACRange = serializers.CharField(allow_blank=True)
    precision = serializers.CharField(allow_blank=True)

class MultiplicitySerializer(serializers.Serializer):
    lower = serializers.IntegerField()
    upper = serializers.IntegerField()

class AttributeUsageSerializer(MultiplicitySerializer):
    sequential = serializers.BooleanField()

from bson.objectid import ObjectId
from openApiSystem.serializers.objectID import ObjectIdField

class DDR_Association(serializers.Serializer):
    parent_id = serializers.CharField()
    child_id = serializers.CharField()

class DDR_PUT_Association(serializers.Serializer):
    association_id = serializers.CharField()
    new_child_id = serializers.CharField()

class DDR_PUT_Associated_Attribute(serializers.Serializer):
    association_id = serializers.CharField()
    new_parent_id = serializers.CharField()


class DDR_Association_List(serializers.Serializer):
    child_id = ObjectIdField(read_only=True)
    name = serializers.CharField()
    item_type = serializers.CharField()
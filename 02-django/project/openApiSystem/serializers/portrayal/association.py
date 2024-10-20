from rest_framework import serializers
from bson.objectid import ObjectId
from openApiSystem.serializers.objectID import ObjectIdField
from openApiSystem.serializers.dataDictionary.item import (
    ConceptSerializer,
)

class PR_Association(serializers.Serializer):
    parent_id = serializers.CharField()
    child_id = serializers.CharField()

class PR_PUT_Association(serializers.Serializer):
    association_id = serializers.CharField()
    new_child_id = serializers.CharField()

class PR_Association_List(serializers.Serializer):
    child_id = ObjectIdField(read_only=True)
    name = serializers.CharField()
    item_type = serializers.CharField()
    xmlID = serializers.CharField()
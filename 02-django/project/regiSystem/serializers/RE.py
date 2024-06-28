from rest_framework import serializers
from bson import ObjectId

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except:
            raise serializers.ValidationError("Invalid ObjectId")

class ConceptItemSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    itemType = serializers.CharField()  # EnumeratedValue, SimpleAttribute, ComplexAttribute, Feature, Information.. 더 생기면 추가하기
    concept_id = serializers.CharField()
    itemIdentifier = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    definition = serializers.CharField(allow_blank=True)
    remarks = serializers.CharField(allow_blank=True)
    itemStatus = serializers.CharField()# Enum - S100_RE_ItemStatus
    alias = serializers.JSONField(default=list) 
    camelCase = serializers.CharField(max_length=100, allow_blank=True)
    definitionSource = serializers.CharField(max_length=100, allow_blank=True)
    reference = serializers.CharField(max_length=100, allow_blank=True)
    similarityToSource = serializers.CharField(max_length=100, allow_blank=True)
    justification = serializers.CharField(max_length=100, allow_blank=True)
    proposedChange = serializers.CharField(max_length=100, allow_blank=True)


class ConceptSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    name = serializers.CharField(max_length=100)
    operatingLanguage = serializers.CharField(max_length=100, )
    contentSummary = serializers.CharField()
    uniformResourceIdentifier = serializers.CharField(max_length=100)
    dateOfLastChange = serializers.CharField()
    

class ConceptManagementInfoSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    # concept_item_id = serializers.CharField()
    proposalType = serializers.CharField()# Enum - S100_RE_ProposalType
    submittingOrganisation = serializers.CharField(max_length=100)
    proposedChange = serializers.CharField(max_length=100)
    dateAccepted = serializers.CharField(allow_blank=True) # DateTime
    dateProposed = serializers.CharField() # DateTime
    dateAmended = serializers.CharField() # DateTime
    proposalStatus = serializers.CharField()# Enum - S100_RE_ProposalStatus
    controlBodyNotes = serializers.JSONField(default=list) 


class ConceptReferenceSourceSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    # concept_item_id = serializers.CharField()
    referenceIdentifier = serializers.CharField(max_length=100, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100)
    similarity = serializers.CharField()# Enum - S100_RE_SimilarityToSource


class ConceptReferenceSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    # concept_item_id = serializers.CharField()
    referenceIdentifier = serializers.CharField(max_length=100, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100)



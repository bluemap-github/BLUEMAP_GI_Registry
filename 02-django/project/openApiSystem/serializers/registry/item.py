from rest_framework import serializers
from openApiSystem.serializers.objectID import ObjectIdField

class RE_RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    operatingLanguage = serializers.CharField()
    contentSummary = serializers.CharField()
    uniformResourceIdentifier = serializers.CharField()
    dateOfLastChange = serializers.DateTimeField()

class RE_ItemSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    itemType = serializers.CharField()  
    concept_id = ObjectIdField(read_only=True)
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

class RE_ManagementInfoSerializer(serializers.Serializer):
    concept_item_id = ObjectIdField(read_only=True)
    proposalType = serializers.CharField()# Enum - S100_RE_ProposalType
    submittingOrganisation = serializers.CharField(max_length=100)
    proposedChange = serializers.CharField(max_length=100)
    dateAccepted = serializers.CharField(allow_blank=True) # DateTime
    dateProposed = serializers.CharField() # DateTime
    dateAmended = serializers.CharField() # DateTime
    proposalStatus = serializers.CharField()# Enum - S100_RE_ProposalStatus
    controlBodyNotes = serializers.JSONField(default=list) 


class RE_ReferenceSourceSerializer(serializers.Serializer):
    concept_item_id = ObjectIdField(read_only=True)
    referenceIdentifier = serializers.CharField(max_length=100, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100)
    similarity = serializers.CharField()# Enum - S100_RE_SimilarityToSource


class RE_ReferenceSerializer(serializers.Serializer):
    concept_item_id = ObjectIdField(read_only=True)
    referenceIdentifier = serializers.CharField(max_length=100, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100)



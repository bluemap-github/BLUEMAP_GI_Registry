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
    itemType = serializers.CharField(default='ConceptItem')  # 기본값 'Symbol'
    concept_id = ObjectIdField(read_only=True)
    itemIdentifier = serializers.IntegerField(default=1)  # 기본값 1
    name = serializers.CharField(max_length=100000, default='Default Name')  # 기본값 'Default Name'
    definition = serializers.CharField(allow_blank=True, default='No definition available')  # 기본값
    remarks = serializers.CharField(allow_blank=True, default='No remarks')  # 기본값
    itemStatus = serializers.CharField(default='processing')  # 기본값 'processing'
    alias = serializers.JSONField(default=list)  # 기본값은 빈 리스트
    camelCase = serializers.CharField(max_length=100000, allow_blank=True, default='defaultCamelCase')  # 기본값
    definitionSource = serializers.CharField(max_length=100000, allow_blank=True, default='Unknown Source')  # 기본값
    reference = serializers.CharField(max_length=100000, allow_blank=True, default='No reference')  # 기본값
    similarityToSource = serializers.CharField(max_length=100000, allow_blank=True, default='0%')  # 기본값
    justification = serializers.CharField(max_length=100000, allow_blank=True, default='No justification')  # 기본값
    proposedChange = serializers.CharField(max_length=100000, allow_blank=True, default='No changes proposed')  # 기본값


class RE_ManagementInfoSerializer(serializers.Serializer):
    concept_item_id = ObjectIdField(read_only=True)
    proposalType = serializers.CharField()# Enum - S100_RE_ProposalType
    submittingOrganisation = serializers.CharField(max_length=100000)
    proposedChange = serializers.CharField(max_length=100000)
    dateAccepted = serializers.CharField(allow_blank=True) # DateTime
    dateProposed = serializers.CharField() # DateTime
    dateAmended = serializers.CharField() # DateTime
    proposalStatus = serializers.CharField()# Enum - S100_RE_ProposalStatus
    controlBodyNotes = serializers.JSONField(default=list) 


class RE_ReferenceSourceSerializer(serializers.Serializer):
    concept_item_id = ObjectIdField(read_only=True)
    referenceIdentifier = serializers.CharField(max_length=100000, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100000)
    similarity = serializers.CharField()# Enum - S100_RE_SimilarityToSource


class RE_ReferenceSerializer(serializers.Serializer):
    concept_item_id = ObjectIdField(read_only=True)
    referenceIdentifier = serializers.CharField(max_length=100000, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100000)



from rest_framework import serializers
from bson import ObjectId
from .models import (
    S100_RE_Register,
    S100_RE_RegisterItem,
    S100_RE_ManagementInfo,
    S100_RE_Reference,
    S100_RE_ReferenceSource
)

# [New]
# Serializer field for Django REST Framework to handle MongoDB ObjectId.
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





# Register Item
class RegisterItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_RegisterItem
        exclude = (
            's100_RE_Register',
        )

# [New]
class ConceptItemSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
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


# Registery
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_Register
        fields = '__all__'

# [New]
class ConceptSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    name = serializers.CharField(max_length=100)
    operatingLanguage = serializers.CharField(max_length=100)
    contentSummary = serializers.CharField()
    uniformResourceIdentifier = serializers.CharField(max_length=100)
    dateOfLastChange = serializers.CharField()
    


# Managemant Info 
class ManagementInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_ManagementInfo
        exclude = (
            's100_RE_RegisterItem',
        )
# [New]
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

# Reference Source 
class ReferenceSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_ReferenceSource
        exclude = (
            's100_RE_RegisterItem',
        )
# [New]
class ConceptReferenceSourceSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    # concept_item_id = serializers.CharField()
    referenceIdentifier = serializers.CharField(max_length=100, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100)
    similarity = serializers.CharField()# Enum - S100_RE_SimilarityToSource

# Reference 
class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_Reference
        exclude = (
            's100_RE_RegisterItem',
        )
# [New]
class ConceptReferenceSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    # concept_item_id = serializers.CharField()
    referenceIdentifier = serializers.CharField(max_length=100, allow_blank=True)
    sourceDocument = serializers.CharField(max_length=100)


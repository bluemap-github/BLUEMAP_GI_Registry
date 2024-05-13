from django.db import models
from enum import Enum

class S100_RE_ItemStatus(Enum):
    PROCESSING = "processing"
    VALID = "valid"
    SUPERSEDED = "superseded"
    NOT_VALID = "notValid"
    RETIRED = "retired"
    CLARIFIED = "clarified"

class S100_RE_ProposalType(Enum):
    ADDITION = "addition"
    CLARIFICATION = "clarification"
    SUPERSESSION = "supersession"
    RETIREMENT = "retirement"

class S100_RE_ProposalStatus(Enum):
    NOT_YET_DETERMINED = "notYetDetermined"
    CLARIFICATION = "transferred"
    SUPERSESSION = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    NEGOTIATION = "negotiation"
    APPEAL = "appeal"
    APPEAL_TRANSFERRED = "appealTransferred"
    APPEAL_ACCEPTED = "appealAccepted"
    APPEAL_REJECTED = "appealRejected"

class S100_RE_SimilarityToSource(Enum):
    IDENTICAL = "identical"
    RESTYLED = "restyled"
    CONTEXT_ADDED = "contextAdded"
    GENERALIZATION = "generalization"
    SPECIALIZATION = "specialization"
    UNSPECIFIED = "unspecified"

class S100_RE_Register(models.Model):
    name = models.CharField(max_length=100)
    operatingLanguage = models.CharField(max_length=100)
    contentSummary = models.TextField()
    uniformResourceIdentifier = models.CharField(max_length=100)
    dateOfLastChange = models.DateField()


class S100_RE_RegisterItem(models.Model):
    s100_RE_Register = models.ForeignKey('S100_RE_Register', on_delete=models.CASCADE)
    itemIdentifier = models.IntegerField()
    name = models.CharField(max_length=100)
    definition = models.TextField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    itemStatus = models.CharField(max_length=50, choices=[(element.value, element.value) for element in S100_RE_ItemStatus])# Enum - S100_RE_ItemStatus
    alias = models.JSONField(default=list, null=True) 
    camelCase = models.CharField(max_length=100, blank=True, null=True)
    definitionSource = models.CharField(max_length=100, blank=True, null=True)
    reference = models.CharField(max_length=100, blank=True, null=True)
    similarityToSource = models.CharField(max_length=100, blank=True, null=True)
    justification = models.CharField(max_length=100, blank=True, null=True)
    proposedChange = models.CharField(max_length=100, blank=True, null=True)


class S100_RE_ManagementInfo(models.Model):
    s100_RE_RegisterItem = models.ForeignKey('S100_RE_RegisterItem', on_delete=models.CASCADE)
    proposalType = models.CharField(max_length=100, choices=[(element.value, element.value) for element in S100_RE_ProposalType])# Enum - S100_RE_ProposalType
    submittingOrganisation = models.CharField(max_length=100)
    proposedChange = models.CharField(max_length=100)
    dateAccepted = models.DateField(null=True)
    dateProposed = models.DateField()
    dateAmended = models.DateField()
    proposalStatus = models.CharField(max_length=100, choices=[(element.value, element.value) for element in S100_RE_ProposalStatus])# Enum - S100_RE_ProposalStatus
    controlBodyNotes = models.JSONField(default=list, null=True) 


class S100_RE_ReferenceSource(models.Model):
    s100_RE_RegisterItem = models.OneToOneField('S100_RE_RegisterItem', on_delete=models.CASCADE)
    referenceIdentifier = models.CharField(max_length=100, blank=True, null=True)
    sourceDocument = models.CharField(max_length=100)
    similarity = models.CharField(max_length=100, choices=[(element.value, element.value) for element in S100_RE_SimilarityToSource])# Enum - S100_RE_SimilarityToSource


class S100_RE_Reference(models.Model):
    s100_RE_RegisterItem = models.ForeignKey('S100_RE_RegisterItem', on_delete=models.CASCADE)
    referenceIdentifier = models.CharField(max_length=100, blank=True, null=True)
    sourceDocument = models.CharField(max_length=100)
    
    


from mongo_driver import db
# test - 곧 삭제 예정
collections = db['collections0417']
collections0417 = db.collections0417

post_classroom = db['classRoom']
getClassroom = db.classRoom


# 스키마 변경중
S100_Register = db['S100_Register']
S100_Concept_Item = db['S100_Concept_Item']
S100_Concept_ManagementInfo = db['S100_Concept_ManagementInfo']
S100_Concept_ReferenceSource = db['S100_Concept_ReferenceSource']
S100_Concept_Reference = db['S100_Concept_Reference']

S100_DataDictionary_Item = db['S100_DataDictionary_Item']

S100_Portrayal_Item = db['S100_Portrayal_Item']

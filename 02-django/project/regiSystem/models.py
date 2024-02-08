from django.db import models
from enum import Enum

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

class S100_RE_ItemStatus(Enum):
    PROCESSING = "processing"
    VALID = "valid"
    SUPERSEDED = "superseded"
    NOT_VALID = "notValid"
    RETIRED = "retired"
    CLARIFIED = "clarified"


class S100_RE_RegisterItem(models.Model):
    itemIdentifier = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    definition = models.CharField(max_length=100, null=True, blank=True)
    remarks = models.CharField(max_length=100, null=True, blank=True)
    itemStatus = models.CharField(max_length=50)
    # alias = models.ForeignKey(Alias, on_delete=models.CASCADE, null=True)  # 0..1
    camelCase = models.CharField(max_length=100, null=True, blank=True)
    definitionSource = models.CharField(max_length=100, null=True, blank=True)
    reference = models.CharField(max_length=100, null=True, blank=True)
    similarityToSource = models.CharField(max_length=100, null=True, blank=True)
    justification = models.CharField(max_length=100, null=True, blank=True)
    proposedChange = models.CharField(max_length=100, null=True, blank=True)

    # s100_RE_ManagementInfo = models.ForeignKey(Alias, on_delete=models.CASCADE)
    # s100_RE_Reference = models.ForeignKey(Alias, on_delete=models.CASCADE, null=True)
    # s100_RE_ReferenceSource = models.ForeignKey(Alias, on_delete=models.CASCADE, null=True)
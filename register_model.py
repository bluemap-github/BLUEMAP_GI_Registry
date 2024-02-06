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
    RETIREMENT = "rejected"
    RETIREMENT = "withdrawn"
    RETIREMENT = "negotiation"
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
    NOT_VALIED = "notValid"
    RETIRED = "retired"
    CLARIFIED = "clarified"



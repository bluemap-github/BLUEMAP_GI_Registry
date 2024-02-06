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
    NOT_VALIED = "notValid"
    RETIRED = "retired"
    CLARIFIED = "clarified"



class S100_RE_Register:
    def __init__(self):
        self.name = None
        self.operatingLanguage = None
        self.contentSummary = None
        self.uniformResourceIdentifier = None
        self.dateOfLastChange = None
        self.S100_RE_RegisterItem = []  # 0..*
    
    def addItem(self, name, operatingLanguage, contentSummary, uniformResourceIdentifier, dateOfLastChange):
        self.name = name
        self.operatingLanguage = operatingLanguage
        self.contentSummary = contentSummary
        self.uniformResourceIdentifier = uniformResourceIdentifier
        self.dateOfLastChange = dateOfLastChange
        


class S100_RE_RegisterItem:
    pass

class S100_RE_ManagementInfo:
    pass

class S100_RE_Reference:
    pass

class S100_RE_ReferenceSource:
    pass
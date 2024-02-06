from enum import Enum
import datetime

def dateValid(value):
    if not isinstance(value, datetime.date): 
        raise ValueError("datetime Error")
    return value

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
    def __init__(self, name, operatingLanguage, contentSummary, uniformResourceIdentifier, dateOfLastChange):
        self.name = name
        self.operatingLanguage = operatingLanguage
        self.contentSummary = contentSummary
        self.uniformResourceIdentifier = uniformResourceIdentifier
        self.dateOfLastChange = dateValid(dateOfLastChange)
        self.s100_RE_RegisterItem = []  # 0..*
    
    def addItem(self, item):
        self.s100_RE_RegisterItem.append(item)
    
    def viewItem(self):
        R_dict = self.__dict__
        print("This is information about the register.")
        print("------------------------------------------")
        for info in R_dict:
            print(f"{info} : {R_dict[info]}")
        print("------------------------------------------\n")
        print()


    def getRegisterItem(self):
        R_items = self.s100_RE_RegisterItem
        if R_items:
            print("This is a list of items.")
            print("------------------")
            for item in R_items:
                print(item.name)
            print("------------------\n")
            print()
        else:
            print("The list is empty.")

class S100_RE_RegisterItem:
    def __init__(self, itemIdentifier, name, itemStatus, s100_RE_ManagementInfo):
        self.itemIdentifier = itemIdentifier
        self.name = name
        self.definition = None  # 0..1
        self.remarks = None
        self.itemStatus = itemStatus
        self.alias = []
        self.camelCase = None
        self.definitionSource = None
        self.reference = None
        self.similarityToSource = None
        self.justification = None
        self.proposedChange = None

        self.s100_RE_ManagementInfo = [s100_RE_ManagementInfo]
        self.s100_RE_Reference = None
        self.s100_RE_ReferenceSource = []
    
    def addDefinition(self, definition):
        self.definition = definition
    
    def addRemarks(self, remarks):
        self.remarks = remarks
    
    def addCamelCase(self, camelCase):
        self.camelCase = camelCase
    
    def addDefinitionSource(self, definitionSource):
        self.definitionSource = definitionSource
    
    def addSimilarityToSource(self, similarityToSource):
        self.similarityToSource = similarityToSource
    
    def addJustification(self, justification):
        self.justification = justification
    
    def addProposedChange(self, proposedChange):
        self.proposedChange = proposedChange
    
    def add_100_RE_ManagementInfo(self, item):
        self.s100_RE_ManagementInfo.append(item)
    
    def add_s100_RE_Reference(self, item):
        self.s100_RE_Reference = item
    
    def add_s100_RE_ReferenceSource(self, item):
        self.s100_RE_ReferenceSource.append(item)
    
    def viewItem(self):
        RI_dict = self.__dict__
        print("This is information about the register item.")
        print("------------------------------------------")
        for info in RI_dict:
            print(f"{info} : {RI_dict[info]}")
        print("------------------------------------------\n")
        print()

class S100_RE_ManagementInfo:
    def __init__(self, proposalType, submittingOrganisation, proposedChange, dateProposed, dateAmended, proposalStatus):
        self.proposalType = proposalType
        self.submittingOrganisation = submittingOrganisation
        self.proposedChange = proposedChange
        self.dateAccepted = None
        self.dateProposed = dateValid(dateProposed)
        self.dateAmended = dateValid(dateAmended)
        self.proposalStatus = proposalStatus
        self.controlBodyNotes = []
    
    def addDateAccepted(self, dateAccepted):
        self.s100_RE_Reference = dateAccepted

    def addControlBodyNotes(self, controlBodyNotes):
        self.s100_RE_ReferenceSource.append(controlBodyNotes)


class S100_RE_Reference:
    def __init__(self, sourceDocument, similarity):
        self.referenceldentifier = None
        self.sourceDocument = sourceDocument
        self.similarity = similarity


class S100_RE_ReferenceSource:
    def __init__(self, sourceDocument):
        self.referenceldentifier = None
        self.sourceDocument = sourceDocument
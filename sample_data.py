

"""
클래스 체크를 위한 샘플데이터입니다.
"""
import datetime


# class S100_RE_Register 
Register_data = {
    "name":"register1",
    "operatingLanguage":"operatingLanguage1",
    "contentSummary":"contentSummary1",
    "uniformResourceldentifier":"uniformResourceldentifier1",
    "dateOfLastChange": datetime.date(2022, 10, 4)
}

# class S100_RE_RegisterItem
Registerltem_data = {
    "itemIdentifier":"itemIdentifier1",
    "name":"item1",
    "itemStatus":"superseded"  #Enum : S100_RE_ItemStatus
}

# class S100_RE_ManagementInfo
Managementinfo_data = {
    "proposal Type":"addition",  #Enum : S100_RE_ProposalType
    "submittingOrganisation":"submittingOrganisation1",
    "proposedChange":"proposedChange1",
    "dateProposed": datetime.date(2013, 7, 2), 
    "dateAmended": datetime.date(2015, 2, 15), 
    "proposal Status":"withdrawn"  #Enum: S100_RE_ProposalStatus
}

# class S100_RE_Reference
ReferenceSource_data = {
    "sourceDocument":"sourceDocument1",
    "similarity":"similarity1"
}

# class S100_RE_ReferenceSource
Reference_data = {
    "sourceDocument":"sourceDocument1"
}
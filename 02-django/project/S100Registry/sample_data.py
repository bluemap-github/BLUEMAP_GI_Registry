

"""
django 모델 체크를 위한 샘플데이터입니다.
"""
import datetime


# class S100_RE_Register 
register_data = {
    "name": "Sample Register",
    "operatingLanguage": "English",
    "contentSummary": "This is a sample register content summary.",
    "uniformResourceIdentifier": "http://example.com/sample-register",
    "dateOfLastChange": date(2024, 2, 13)
}

# Register item data
register_item_data = [
    {
        "itemIdentifier": 1,
        "name": "Item 1",
        "definition": "Definition of Item 1",
        "remarks": "Remarks for Item 1",
        "itemStatus": "processing",
        "camelCase": "itemOne",
        "definitionSource": "Source for definition of Item 1",
        "reference": "Reference for Item 1",
        "similarityToSource": "identical",
        "justification": "Justification for Item 1",
        "proposedChange": "Proposed change for Item 1"
    },
    {
        "itemIdentifier": 2,
        "name": "Item 2",
        "definition": "Definition of Item 2",
        "remarks": "Remarks for Item 2",
        "itemStatus": "valid",
        "camelCase": "itemTwo",
        "definitionSource": "Source for definition of Item 2",
        "reference": "Reference for Item 2",
        "similarityToSource": "restyled",
        "justification": "Justification for Item 2",
        "proposedChange": "Proposed change for Item 2"
    },
]


# Management info data
management_info_data = [
    {
        "proposalType": "addition",
        "submittingOrganisation": "Organization 1",
        "proposedChange": "Proposed change for Item 1",
        "dateAccepted": date(2024, 2, 13),
        "dateProposed": date(2024, 2, 12),
        "dateAmended": date(2024, 2, 14),
        "proposalStatus": "notYetDetermined",
        "controlBodyNotes": []
    },
    {
        "proposalType": "clarification",
        "submittingOrganisation": "Organization 2",
        "proposedChange": "Proposed change for Item 2",
        "dateProposed": date(2024, 2, 10),
        "dateAmended": date(2024, 2, 12),
        "proposalStatus": "transferred",
        "controlBodyNotes": []
    },
    # Add more management info data if needed
]

# class S100_RE_Reference
ReferenceSource_data = {
    "sourceDocument":"sourceDocument1",
    "similarity":"similarity1"
}

# Reference data
reference_data = [
    {
        "referenceldentifier": "Reference1",
        "sourceDocument": "sourceDocument1_reference_data",
        "similarity": "identical"
    },
    {
        "referenceldentifier": "Reference2",
        "sourceDocument": "sourceDocument2_reference_data",
        "similarity": "restyled"
    },
    # Add more reference data if needed
]
register_data = {
    'name': 'Sample Register',
    'operatingLanguage': 'English',
    'contentSummary': 'This is a sample register content summary.',
    'uniformResourceIdentifier': 'http://example.com/sample-register',
    'dateOfLastChange': '2024-02-13',
}

item_data = [ ## 5개
    {
        "s100_RE_Register_id": "1",
        "itemIdentifier": "1",
        "name": "Item 1",
        "definition": "Definition of Item 1",
        "remarks": "Remarks for Item 1",
        "itemStatus": "processing",
        "alias": [],
        "camelCase": "itemOne",
        "definitionSource": "Source for definition of Item 1",
        "reference": "Reference for Item 1",
        "similarityToSource": "identical",
        "justification": "Justification for Item 1",
        "proposedChange": "Proposed change for Item 1"
    },
    {
        "s100_RE_Register_id": "1",
        "itemIdentifier": "2",
        "name": "Item 2",
        "definition": "Definition of Item 2",
        "remarks": "Remarks for Item 2",
        "itemStatus": "valid",
        "alias": {"alias" : ["eleven"]},
        "camelCase": "itemTwo",
        "definitionSource": "Source for definition of Item 2",
        "reference": "Reference for Item 2",
        "similarityToSource": "restyled",
        "justification": "Justification for Item 2",
        "proposedChange": "Proposed change for Item 2"
    },
    {
        "s100_RE_Register_id": "1",
        "itemIdentifier": "3",
        "name": "Item 3",
        "definition": "Definition of Item 3",
        "remarks": "Remarks for Item 3",
        "itemStatus": "superseded",
        "camelCase": "itemThree",
        "definitionSource": "Source for definition of Item 3",
        "reference": "Reference for Item 3",
        "similarityToSource": "contextAdded",
        "justification": "Justification for Item 3",
        "proposedChange": "Proposed change for Item 3"
    },
    {
        "s100_RE_Register_id": "1",
        "itemIdentifier": "4",
        "name": "Item 4",
        "definition": "Definition of Item 4",
        "remarks": "Remarks for Item 4",
        "itemStatus": "notValid",
        "alias": {"alias" : ["alias1", "alias2", "alias3"]},
        "camelCase": "itemFour",
        "definitionSource": "Source for definition of Item 4",
        "reference": "Reference for Item 4",
        "similarityToSource": "generalization",
        "justification": "Justification for Item 4",
        "proposedChange": "Proposed change for Item 4"
    },
    {
        "s100_RE_Register_id": "1",
        "itemIdentifier": "5",
        "name": "Item 5",
        "definition": "Definition of Item 5",
        "remarks": "Remarks for Item 5",
        "itemStatus": "retired",
        "camelCase": "itemFive",
        "definitionSource": "Source for definition of Item 5",
        "reference": "Reference for Item 5",
        "similarityToSource": "specialization",
        "justification": "Justification for Item 5",
        "proposedChange": "Proposed change for Item 5"
    }
]

management_info_data = [ # 5개
    {
        "s100_RE_RegisterItem_id": "1",
        "proposalType": "addition",
        "submittingOrganisation": "Organization 1",
        "proposedChange": "Proposed change for Item 1",
        "dateAccepted": "2024-02-13",
        "dateProposed": "2024-02-12",
        "dateAmended": "2024-02-14",
        "proposalStatus": "notYetDetermined",
        "controlBodyNotes": {"controlBodyNotes" : ["one", "two", "three"]}
    },
    {
        "s100_RE_RegisterItem_id": "2",
        "proposalType": "clarification",
        "submittingOrganisation": "Organization 2",
        "proposedChange": "Proposed change for Item 2",
        "dateProposed": "2024-02-10",
        "dateAmended": "2024-02-12",
        "proposalStatus": "transferred"
    },
    {
        "s100_RE_RegisterItem_id": "3",
        "proposalType": "supersession",
        "submittingOrganisation": "Organization 3",
        "proposedChange": "Proposed change for Item 3",
        "dateProposed": "2024-02-09",
        "dateAmended": "2024-02-11",
        "proposalStatus": "accepted"
    },
    {
        "s100_RE_RegisterItem_id": "4",
        "proposalType": "retirement",
        "submittingOrganisation": "Organization 4",
        "proposedChange": "Proposed change for Item 4",
        "dateAccepted": "2024-02-11",
        "dateProposed": "2024-02-08",
        "dateAmended": "2024-02-10",
        "proposalStatus": "rejected",
        "controlBodyNotes": {"controlBodyNotes" : ["controlBodyNotes1", "controlBodyNotes2", "controlBodyNotes3", "controlBodyNotes4"]}
    },
    {
        "s100_RE_RegisterItem_id": "5",
        "proposalType": "addition",
        "submittingOrganisation": "Organization 5",
        "proposedChange": "Proposed change for Item 5",
        "dateAccepted": "2024-02-10",
        "dateProposed": "2024-02-07",
        "dateAmended": "2024-02-09",
        "proposalStatus": "withdrawn"
    }
]

reference_source_data = [ # 3개
    {
        "s100_RE_RegisterItem_id": "1",
        "sourceDocument": "Document1",
        "similarity": "identical"
    },
    {
        "s100_RE_RegisterItem_id": "2",
        "referenceIdentifier": "Reference2",
        "sourceDocument": "Document2",
        "similarity": "restyled"
    },
    {
        "s100_RE_RegisterItem_id": "3",
        "referenceIdentifier": "Reference3",
        "sourceDocument": "Document3",
        "similarity": "contextAdded"
    }
]

reference_data = [ # 4개
    {
        "s100_RE_RegisterItem_id": "1",
        "referenceIdentifier": "reference_source_data1",
        "sourceDocument": "Doc11"
    },
    {
        "s100_RE_RegisterItem_id": "2",
        "referenceIdentifier": "reference_source_data32",
        "sourceDocument": "Document28"
    },
    {
        "s100_RE_RegisterItem_id": "3",
        "referenceIdentifier": "reference_source_data5",
        "sourceDocument": "Document334"
    },
    {
        "s100_RE_RegisterItem_id": "2",
        "referenceIdentifier": "reference_source_data556",
        "sourceDocument": "Doc121"
    }
]


register_data = {
    "name": "Sample Register",
    "operatingLanguage": "English",
    "contentSummary": "This is a sample register content summary.",
    "uniformResourceIdentifier": "http://example.com/sample-register",
    "dateOfLastChange": "2024-02-13",
}

item_data = [
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 1,
      "name": "Feature Size Variable",
      "definition": "Percentage of depth that a feature of such size could be detected.",
      "remarks": "Set to zero if the feature detection size does not scale with depth.",
      "camelCase": "featureSizeVariable",
      "itemStatus": "valid",
      "justification": "",
      "proposedChange": "New"
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 2,
      "name": "Source Survey ID",
      "definition": "The survey filename or ID.",
      "camelCase": "sourceSurveyID",
      "itemStatus": "valid"
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 3,
      "name": "CUBE Standard Deviation",
      "camelCase": "CUBEStandardDeviation",
      "definition": "Standard deviation of soundings captured by a CUBE hypothesis (that is, CUBE’s standard output of uncertainty).",
      "remarks": "The Combined Uncertainty and Bathymetric Estimator (CUBE) algorithm makes use of the elevation and associated total propagated uncertainty for each contributing sounding to compute one or many hypotheses for an area of interest. The resulting hypotheses are used to estimate statistical representative depths at each nodal position.",
      "itemStatus": "valid"
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 4,
      "name": "Update Type",
      "camelCase": "updateType",
      "definition": "An action performed when the contents of a dataset are changed.",
      "itemStatus": "valid",
      "definitionSource": "Edition 1.2.0, clause 28.24",
      "similarityToSource": "Identical",
      "justification": "Required doe S-101 (Edition 1.2.0)."
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 5,
      "name": "Insert",
      "camelCase": "Insert",
      "definition": "To put or introduce into the body of something.",
      "itemStatus": "valid",
      "definitionSource": "https://www.merriam-webster.com/dictionary/insert",
      "reference": "Merriam-Webster's Collegiate Dictionary",
      "similarityToSource": "Identical",
      "proposedChange": "Add new Item."
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 6,
      "camelCase": "Modify",
      "name": "Modify",
      "definition": "To make basic or fundamental changes to the characteristics of something, often to give a new orientation to or to serve a new end.",
      "itemStatus": "valid",
      "definitionSource": "https://www.merriam-webster.com/dictionary/modify",
      "reference": "Merriam-Webster's Collegiate Dictionary",
      "similarityToSource": "Identical"
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 7,
      "name": "Optimum Display Scale",
      "camelCase": "optimumDisplayScale",
      "definition": "The largest intended viewing scale for the data.",
      "itemStatus": "valid",
      "definitionSource": "Edition 1.0.0, Clause 28.8",
      "proposedChange": "Add new Item."
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 8,
      "camelCase": "maximum Display Scale",
      "name": "Maximum Display Scale",
      "definition": "The value considered by the Data Producer to be the maximum (largest) scale at which the data is to be displayed before it can be considered to be 'grossly overscaled'.",
      "itemStatus": "valid",
      "definitionSource": "Edition 1.2.0, Clause 28.8",
      "reference": "S-101 IHO Electronic Navigational Chart Product Specification",
      "proposedChange": "Amended definition."
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 9,
      "camelCase": "textRotation",
      "name": "Text Rotation",
      "definition": "A statement that expresses if text associated with a feature is to be rotated in the ECDIS display or not.",
      "itemStatus": "valid",
      "definitionSource": "Edition 1.2.0, Clause 27.178",
      "similarityToSource": "Identical"
    },
    {
      "s100_RE_Register_id": 1,
      "itemIdentifier": 10,
      "camelCase": "textOffsetDistance",
      "name": "Text Offset Distance",
      "definition": "The distance that text associated with a feature is positioned from the feature in an end-user system.",
      "itemStatus": "valid",
      "definitionSource": "Annex A Edition 1.2.0, clause 27.177",
      "proposedChange": "Amended Name and Definition from Text Offset Mm."
    }
]



management_info_data = [
    {
      "s100_RE_RegisterItem_id": 1,
      "proposalType": "addition",
      "submittingOrganisation": "IHO Secretariat",
      "proposedChange": "New",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 2,
      "proposalType": "addition",
      "submittingOrganisation": "IHO Secretariat",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 3,
      "proposalType": "addition",
      "submittingOrganisation": "IHO Secretariat",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 4,
      "proposalType": "addition",
      "submittingOrganisation": "IHO Secretariat",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 5,
      "proposalType": "addition",
      "submittingOrganisation": "IHO Secretariat",
      "proposedChange": "Add new Item.",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 6,
      "proposalType": "addition",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 7,
      "proposalType": "addition",
      "proposedChange": "Add new Item.",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 8,
      "proposalType": "addition",
      "proposedChange": "Amended definition.",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 9,
      "proposalType": "addition",
      "submittingOrganisation": "IHO Secretariat",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    },
    {
      "s100_RE_RegisterItem_id": 10,
      "proposalType": "addition",
      "proposedChange": "Amended Name and Definition from Text Offset Mm.",
      "dateAccepted": "2024-01-23",
      "dateProposed": "2023-10-27",
      "dateAmended": "2024-01-23",
      "proposalStatus": "notYetDetermined"
    }
]



reference_source_data = [
    {
      "s100_RE_RegisterItem_id": 4,
      "referenceIdentifier": "Edition 1.2.0, clause 28.24",
      "sourceDocument": "Edition 1.2.0, clause 28.24",
      "similarity": "Identical"
    },
    {
      "s100_RE_RegisterItem_id": 5,
      "referenceIdentifier": "Merriam-Webster's Collegiate Dictionary",
      "sourceDocument": "Merriam-Webster's Collegiate Dictionary",
      "similarity": "Identical"
    },
    {
      "s100_RE_RegisterItem_id": 6,
      "referenceIdentifier": "Merriam-Webster's Collegiate Dictionary",
      "sourceDocument": "Merriam-Webster's Collegiate Dictionary",
      "similarity": "Identical"
    },
    {
      "s100_RE_RegisterItem_id": 7,
      "referenceIdentifier": "S-101 IHO Electronic Navigational Chart Product Specification",
      "sourceDocument": "IHO S-102 Project Team",
      "similarity": "Unspecified"
    },
    {
      "s100_RE_RegisterItem_id": 8,
      "referenceIdentifier": "Revised modeling of scales (S-101 Edition 1.2.0).",
      "sourceDocument": "S-101 IHO Electronic Navigational Chart Product Specification",
      "similarity": "Unspecified"
    },
    {
      "s100_RE_RegisterItem_id": 9,
      "referenceIdentifier": "Edition 1.2.0, Clause 27.178",
      "sourceDocument": "Edition 1.2.0, Clause 27.178",
      "similarity": "Identical"
    },
    {
      "s100_RE_RegisterItem_id": 10,
      "referenceIdentifier": "S-101PT discussions (S-101PT10). Required for S-101 Edition 1.2.0.",
      "sourceDocument": "Annex A Edition 1.2.0, clause 27.177",
      "similarity": "Unspecified"
    }
]


reference_data = [
    {
      "s100_RE_RegisterItem_id": 1,
      "sourceDocument": "IHO S-102 Project Team"
    },
    {
      "s100_RE_RegisterItem_id": 2,
      "sourceDocument": "IHO S-102 Project Team"
    },
    {
      "s100_RE_RegisterItem_id": 3,
      "sourceDocument": "IHO S-102 Project Team"
    },
    {
      "s100_RE_RegisterItem_id": 4,
      "referenceIdentifier": "Edition 1.2.0, clause 28.24",
      "sourceDocument": ""
    },
    {
      "s100_RE_RegisterItem_id": 5,
      "sourceDocument": "Merriam-Webster's Collegiate Dictionary"
    },
    {
      "s100_RE_RegisterItem_id": 6,
      "referenceIdentifier": "Merriam-Webster's Collegiate Dictionary",
      "sourceDocument": ""
    },
    {
      "s100_RE_RegisterItem_id": 7,
      "sourceDocument": "IHO S-102 Project Team"
    },
    {
      "s100_RE_RegisterItem_id": 8,
      "sourceDocument": "S-101 IHO Electronic Navigational Chart Product Specification"
    },
    {
      "s100_RE_RegisterItem_id": 9,
      "referenceIdentifier": "Edition 1.2.0, Clause 27.178",
      "sourceDocument": ""
    },
    {
      "s100_RE_RegisterItem_id": 10,
      "referenceIdentifier": "Annex A Edition 1.2.0, clause 27.177",
      "sourceDocument": ""
    }
]




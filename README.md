# 





#

S100_RE_Register
+name: CharacterString
+operatingLanguage: RE_Locale 
+contentSummary: CharacterString
+uniformResourceldentifier: Cl_OnlineResource +dateOfLastChange: Date

S100_RE_Registerltem
+itemIdentifier: Integer 
+name: CharacterString
+definition: CharacterString [0..1] 
+remarks: CharacterString [0..1]
+itemStatus: S100_RE_ItemStatus
+alias: CharacterString [0.."]
+camelCase: CharacterString [0..1] 
+definitionSource: CharacterString [0..1] 
+reference: CharacterString [0..1]
+similarityToSource: CharacterString [0..1] 
+justification: CharacterString [0..1] 
+proposedChange: CharacterString [0..1]


S100_RE_Managementinfo
+proposal Type: S100_RE_ProposalType 
+submittingOrganisation: CharacterString 
+proposedChange: CharacterString 
+dateAccepted: Date [0..1]
+dateProposed: Date
+dateAmended: Date
+proposal Status: S100_RE_Proposal Status 
+controlBodyNotes: CharacterString [0..*]

S100_RE_Reference Source
+referenceldentifier: CharacterString [0..1] 
+sourceDocument: CI_Citation
+similarity: S100_RE_SimilarityToSource

S100_RE_Reference
+referenceldentifier: CharacterString [0..1] 
+sourceDocument: CI_Citation


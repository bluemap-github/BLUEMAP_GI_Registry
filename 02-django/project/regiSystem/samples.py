
import os
import json
import django

# Django 프로젝트의 환경 설정을 로드
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "S100Registry.settings")
django.setup()

import json
from regiSystem.models import S100_RE_Register, S100_RE_RegisterItem, S100_RE_ManagementInfo, S100_RE_Reference

# JSON 파일 또는 문자열에서 덤프 데이터 읽기
dump_data = [
    {
      "model": "your_app_name.S100_RE_Register",
      "pk": 1,
      "fields": {
        "name": "Sample Register",
        "operatingLanguage": "English",
        "contentSummary": "This is a sample register content summary.",
        "uniformResourceIdentifier": "http://example.com/sample-register",
        "dateOfLastChange": "2024-02-13"
      }
    },
    {
      "model": "your_app_name.S100_RE_RegisterItem",
      "pk": 1,
      "fields": {
        "s100_RE_Register": 1,
        "itemIdentifier": 1,
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
      }
    },
    {
      "model": "your_app_name.S100_RE_RegisterItem",
      "pk": 2,
      "fields": {
        "s100_RE_Register": 1,
        "itemIdentifier": 2,
        "name": "Item 2",
        "definition": "Definition of Item 2",
        "remarks": "Remarks for Item 2",
        "itemStatus": "valid",
        "alias": [],
        "camelCase": "itemTwo",
        "definitionSource": "Source for definition of Item 2",
        "reference": "Reference for Item 2",
        "similarityToSource": "restyled",
        "justification": "Justification for Item 2",
        "proposedChange": "Proposed change for Item 2"
      }
    },
    
    {
      "model": "your_app_name.S100_RE_ManagementInfo",
      "pk": 1,
      "fields": {
        "s100_RE_RegisterItem": 1,
        "proposalType": "addition",
        "submittingOrganisation": "Organization 1",
        "proposedChange": "Proposed change for Item 1",
        "dateAccepted": "2024-02-13",
        "dateProposed": "2024-02-12",
        "dateAmended": "2024-02-14",
        "proposalStatus": "notYetDetermined",
        "controlBodyNotes": []
      }
    },
    {
      "model": "your_app_name.S100_RE_ManagementInfo",
      "pk": 2,
      "fields": {
        "s100_RE_RegisterItem": 2,
        "proposalType": "clarification",
        "submittingOrganisation": "Organization 2",
        "proposedChange": "Proposed change for Item 2",
        "dateProposed": "2024-02-10",
        "dateAmended": "2024-02-12",
        "proposalStatus": "transferred",
        "controlBodyNotes": []
      }
    },
    
    {
      "model": "your_app_name.S100_RE_Reference",
      "pk": 1,
      "fields": {
        "s100_RE_RegisterItem": 1,
        "referenceldentifier": "Reference1",
        "sourceDocument": "Document1",
        "similarity": "identical"
      }
    },
    {
      "model": "your_app_name.S100_RE_Reference",
      "pk": 2,
      "fields": {
        "s100_RE_RegisterItem": 2,
        "referenceldentifier": "Reference2",
        "sourceDocument": "Document2",
        "similarity": "restyled"
      }
    }
  ]

'''
[
    // 덤프 데이터를 여기에 붙여넣기
]
'''
data = json.loads(dump_data)

# 데이터베이스에 레지스터 정보 저장
for entry in data:
    if entry['model'] == 'regiSystem.S100_RE_Register':
        fields = entry['fields']
        register = S100_RE_Register.objects.create(
            name=fields['name'],
            operatingLanguage=fields['operatingLanguage'],
            contentSummary=fields['contentSummary'],
            uniformResourceIdentifier=fields['uniformResourceIdentifier'],
            dateOfLastChange=fields['dateOfLastChange']
        )
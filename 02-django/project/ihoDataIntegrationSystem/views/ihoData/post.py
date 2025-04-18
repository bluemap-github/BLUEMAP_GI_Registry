### CD > post > concept_item
### CD > post > enumerated_value
### CD > post > simple_attribute
### CD > post > complex_attribute
### CD > post > feature
### CD > post > information_type

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def iho_concept_item():
    return Response({"message": "Concept item created successfully"}, status=201)


@api_view(['POST'])
def iho_concept_management_info():
    return Response({"message": "Concept item created successfully"}, status=201)


@api_view(['POST'])
def iho_concept_reference():
    return Response({"message": "Concept item created successfully"}, status=201)


@api_view(['POST'])
def iho_concept_reference_source():
    return Response({"message": "Concept item created successfully"}, status=201)
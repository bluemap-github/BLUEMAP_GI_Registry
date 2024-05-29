from bson.objectid import ObjectId
from ..models import (
        S100_Concept_Register,
        S100_Concept_Item,
        S100_Concept_ManagementInfo,
        S100_Concept_ReferenceSource,
        S100_Concept_Reference,
        S100_CD_Enumerated_Value
    )
from ..serializers import (
        ConceptSerializer,
        ConceptItemSerializer,
        ConceptManagementInfoSerializer,
        ConceptReferenceSourceSerializer,
        ConceptReferenceSerializer,
        EnumeratedValueSerializer,
        SimpleAttributeSerializer
    )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST


@api_view(['POST'])
def concept_register(request):
    if request.method == 'POST':
        serializer = ConceptSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            S100_Concept_Register.insert_one(validated_data) 
            return Response(serializer.data, status=HTTP_201_CREATED) 
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def concept_item(request):
    serializer = ConceptItemSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(validated_data['concept_id'])
        
        S100_Concept_Item.insert_one(validated_data) 
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def concept_managemant_info(request, I_id):
    serializer = ConceptManagementInfoSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)

        S100_Concept_ManagementInfo.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def concept_reference_source(request, I_id):
    serializer = ConceptReferenceSourceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_ReferenceSource.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def concept_reference(request, I_id):
    serializer = ConceptReferenceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_Reference.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def enumerated_value(request, C_id):
    serializer = EnumeratedValueSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def simple_attribute(request, C_id):
    serializer = SimpleAttributeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)



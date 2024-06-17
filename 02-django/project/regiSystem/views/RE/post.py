from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from regiSystem.models import (
        S100_Concept_Register,
        S100_Concept_Item,
        S100_Concept_ManagementInfo,
        S100_Concept_ReferenceSource,
        S100_Concept_Reference
    )
from regiSystem.serializers.RE import (
        ConceptSerializer,
        ConceptItemSerializer,
        ConceptManagementInfoSerializer,
        ConceptReferenceSourceSerializer,
        ConceptReferenceSerializer,
    )

import json
from regiSystem.InfoSec.encryption import (encrypt, get_encrypted_id, decrypt)

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
def mamagement_info(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    serializer = ConceptManagementInfoSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)

        S100_Concept_ManagementInfo.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reference_source(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    serializer = ConceptReferenceSourceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_ReferenceSource.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reference(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    serializer = ConceptReferenceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_Reference.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)






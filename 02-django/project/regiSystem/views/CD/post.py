from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from regiSystem.models import (
    S100_Concept_Item,
)
# from regiSystem.serializers.RE import (
# )
from regiSystem.serializers.CD import (
        SimpleAttributeSerializer,
        EnumeratedValueSerializer,
        ComplexAttributeSerializer,
        FeatureSerializer,
        InformationSerializer
)

import json
from regiSystem.InfoSec.encryption import (encrypt, get_encrypted_id, decrypt)

@api_view(['POST'])
def enumerated_value(request):
    C_id = request.GET.get('user_serial')
    serializer = EnumeratedValueSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        saved_ = S100_Concept_Item.insert_one(validated_data)
        enumeration_value_id = str(saved_.inserted_id)
        associated_attribute_id = validated_data['associated_arrtibute_id']

        if associated_attribute_id:
            simple_attribute_obj = S100_Concept_Item.find_one({"_id": ObjectId(associated_attribute_id)})
            related_enumeration_value_id_list = simple_attribute_obj['related_enumeration_value_id_list']
            if enumeration_value_id not in related_enumeration_value_id_list:
                related_enumeration_value_id_list.append(enumeration_value_id)
                S100_Concept_Item.update_one({"_id": ObjectId(associated_attribute_id)}, {"$set": {"related_enumeration_value_id_list": related_enumeration_value_id_list}})

        encrypted_id = get_encrypted_id(serializer.data['_id'])        
        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def simple_attribute(request):
    C_id = request.GET.get('user_serial')

    serializer = SimpleAttributeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        saved_ = S100_Concept_Item.insert_one(validated_data)
        simple_attribute_id = str(saved_.inserted_id)
        related_enumeration_value_id_list = validated_data['related_enumeration_value_id_list']
        for get_ev_id in related_enumeration_value_id_list:
            enumeration_value_obj = S100_Concept_Item.find_one({"_id": ObjectId(get_ev_id)})
            enumeration_value_obj['associated_arrtibute_id'] = simple_attribute_id
            S100_Concept_Item.update_one({"_id": ObjectId(get_ev_id)}, {"$set": enumeration_value_obj})
        
        encrypted_id = get_encrypted_id(serializer.data['_id']) 
        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def complex_attribute(request):
    C_id = request.GET.get('user_serial')
    
    serializer = ComplexAttributeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        encrypted_id = get_encrypted_id(serializer.data['_id'])
        return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def feature(request):
    C_id = request.GET.get('user_serial')
    serializer = FeatureSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        encrypted_id = get_encrypted_id(serializer.data['_id'])
        return Response(encrypted_id, status=HTTP_201_CREATED)
    
@api_view(['POST'])
def information(request):
    C_id = request.GET.get('user_serial')
    serializer = InformationSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        encrypted_id = get_encrypted_id(serializer.data['_id'])
        return Response(encrypted_id, status=HTTP_201_CREATED)
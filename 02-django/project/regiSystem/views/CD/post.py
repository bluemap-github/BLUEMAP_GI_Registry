from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from regiSystem.models import (
    S100_Concept_Item,
    S100_CD_AttributeConstraints,
    S100_CD_AttributeUsage,
    RegiModel,
    ListedValue,
    AttributeUsage,
    Distinction
)
from regiSystem.serializers.CD import (
        SimpleAttributeSerializer,
        EnumeratedValueSerializer,
        ComplexAttributeSerializer,
        FeatureSerializer,
        InformationSerializer,
        AttributeConstraintsSerializer,
        AttributeUsageSerializer
)

from regiSystem.serializers.RE import (
        ConceptItemSerializer,
)

import json
from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)
from regiSystem.info_sec.getByURI import uri_to_serial

@api_view(['POST'])
def concept_item(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    serializer = ConceptItemSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)

        S100_Concept_Item.insert_one(validated_data)
        encrypted_id = get_encrypted_id([serializer.data['_id']])
        RegiModel.update_date(C_id)
        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def enumerated_value(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    attributeId = request.data['attributeId'][0]
    serializer = EnumeratedValueSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)

        saved_ = S100_Concept_Item.insert_one(validated_data)

        enumeration_value_id = str(saved_.inserted_id)
        
        ListedValue.insert_listed_value(attributeId, enumeration_value_id)

        encrypted_id = get_encrypted_id([serializer.data['_id']])  
        RegiModel.update_date(C_id)      
        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def simple_attribute(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))

    serializer = SimpleAttributeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        encrypted_id = get_encrypted_id([serializer.data['_id']]) 
        RegiModel.update_date(C_id)
        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def complex_attribute(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    sub_list = request.data['subAttribute']
    serializer = ComplexAttributeSerializer(data=request.data)

    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        saved_ = S100_Concept_Item.insert_one(validated_data)
        new_comp_id = str(saved_.inserted_id)
        for s_id in sub_list:
            AttributeUsage.make_attribute_usage(new_comp_id, s_id)
        RegiModel.update_date(C_id)
        encrypted_id = get_encrypted_id([serializer.data['_id']])
        return Response(encrypted_id, status=HTTP_201_CREATED)
    
         


@api_view(['POST'])
def feature(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    distincted_list = request.data['distinctedFeature']
    serializer = FeatureSerializer(data=request.data)
    
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        saved_ = S100_Concept_Item.insert_one(validated_data)
        new_feature_id = str(saved_.inserted_id)
        
        for f_id in distincted_list:
            Distinction.insert_distinction(new_feature_id, f_id)

        RegiModel.update_date(C_id)
        encrypted_id = get_encrypted_id([serializer.data['_id']]) 
        return Response(encrypted_id, status=HTTP_201_CREATED)
    
@api_view(['POST'])
def information(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    distincted_list = request.data['distinctedInformation']
    serializer = InformationSerializer(data=request.data)
    
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        saved_ = S100_Concept_Item.insert_one(validated_data)
        new_info_id = str(saved_.inserted_id)
        
        for f_id in distincted_list:
            Distinction.insert_distinction(new_info_id, f_id)

        encrypted_id = get_encrypted_id([serializer.data['_id']])
        RegiModel.update_date(C_id)
        return Response(encrypted_id, status=HTTP_201_CREATED)
    
@api_view(['POST'])
def attribute_constraints(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    serializer = AttributeConstraintsSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['simpleAttribute'] = ObjectId(I_id)
        
        S100_CD_AttributeConstraints.insert_one(validated_data)
        encrypted_id = get_encrypted_id([serializer.data['_id']])
        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
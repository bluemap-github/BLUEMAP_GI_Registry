from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

from regiSystem.models.Concept import (
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

def query_concept_item(request, serializer_class, db_class, concept_id=None):
    serializer = serializer_class(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        if concept_id:
            validated_data['concept_id'] = ObjectId(concept_id) if ObjectId.is_valid(concept_id) else concept_id

        inserted = db_class.insert_one(validated_data)

        # inserted_id 추출 (InsertOneResult 객체 or dict 둘 다 처리)
        if hasattr(inserted, "inserted_id"):
            inserted_id = str(inserted.inserted_id)
        elif isinstance(inserted, dict) and "inserted_id" in inserted:
            inserted_id = str(inserted["inserted_id"])
        else:
            return Response({"error": "inserted_id could not be determined"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

        encrypted_id = get_encrypted_id([inserted_id])

        if concept_id and ObjectId.is_valid(concept_id):
            RegiModel.update_date(concept_id)

        return Response(encrypted_id, status=HTTP_201_CREATED)

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def concept_item(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return query_concept_item(
        request=request,
        serializer_class=ConceptItemSerializer,
        db_class=S100_Concept_Item,
        concept_id=C_id
    )

def query_enumerated_value(request, serializer_class, db_class, concept_id=None, listed_value=ListedValue):
    attributeId = request.data['attributeId'][0]

    serializer = serializer_class(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        if concept_id:
            validated_data['concept_id'] = ObjectId(concept_id) if ObjectId.is_valid(concept_id) else concept_id

        saved_ = db_class.insert_one(validated_data)

        if hasattr(saved_, "inserted_id"):
            enumeration_value_id = str(saved_.inserted_id)
        elif isinstance(saved_, dict) and "inserted_id" in saved_:
            enumeration_value_id = str(saved_["inserted_id"])
        else:
            return Response({"error": "inserted_id could not be determined"}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
        listed_value.insert_listed_value(attributeId, enumeration_value_id)

        encrypted_id = get_encrypted_id([enumeration_value_id])

        if concept_id:
            RegiModel.update_date(concept_id)

        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def enumerated_value(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return query_enumerated_value(
        request=request,
        serializer_class=EnumeratedValueSerializer,
        db_class=S100_Concept_Item,
        concept_id=C_id
    )

def query_simple_attribute(request, db_class, concept_id):

    serializer = SimpleAttributeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = concept_id
        
        inserted = db_class.insert_one(validated_data)

        # inserted_id 추출 (InsertOneResult 객체 or dict 둘 다 처리)
        if hasattr(inserted, "inserted_id"):
            inserted_id = str(inserted.inserted_id)
        elif isinstance(inserted, dict) and "inserted_id" in inserted:
            inserted_id = str(inserted["inserted_id"])
        else:
            return Response({"error": "inserted_id could not be determined"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

        encrypted_id = get_encrypted_id([inserted_id])

        if concept_id and ObjectId.is_valid(concept_id):
            RegiModel.update_date(concept_id)
        return Response(encrypted_id, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def simple_attribute(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    return query_simple_attribute(
        request=request,
        db_class=S100_Concept_Item,
        concept_id=ObjectId(C_id)
    )

def query_complex_attribute(request, db_class, concept_id, attribute_usage=AttributeUsage):
    sub_list = request.data['subAttribute']
    serializer = ComplexAttributeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = concept_id
        saved_ = db_class.insert_one(validated_data)

        if hasattr(saved_, "inserted_id"):
            new_comp_id = str(saved_.inserted_id)
        elif isinstance(saved_, dict) and "inserted_id" in saved_:
            new_comp_id = str(saved_["inserted_id"])
        else:
            return Response({"error": "inserted_id could not be determined"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

        for s_id in sub_list:
            attribute_usage.make_attribute_usage(new_comp_id, s_id)

        if concept_id and ObjectId.is_valid(concept_id):
            RegiModel.update_date(concept_id)
        encrypted_id = get_encrypted_id([serializer.data['_id']])
        return Response(encrypted_id, status=HTTP_201_CREATED)

@api_view(['POST'])
def complex_attribute(request):
    C_id = ObjectId(uri_to_serial(request.GET.get('regi_uri')))
    return query_complex_attribute(
        request=request,
        db_class=S100_Concept_Item,
        concept_id=C_id
    )


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
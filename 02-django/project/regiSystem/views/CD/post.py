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

@api_view(['POST'])
def enumerated_value(request, C_id):
    serializer = EnumeratedValueSerializer(data=request.data)

    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        associated_attribute_id = validated_data['associated_arrtibute_id']
        if associated_attribute_id:
            simple_attribute_obj = S100_Concept_Item.find_one({"_id": ObjectId(associated_attribute_id)})
            related_enumeration_value_id_list = simple_attribute_obj['related_enumeration_value_id_list']
            if C_id not in related_enumeration_value_id_list:
                related_enumeration_value_id_list.append(C_id)
                S100_Concept_Item.update_one({"_id": ObjectId(associated_attribute_id)}, {"$set": {"related_enumeration_value_id_list": related_enumeration_value_id_list}})
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

@api_view(['POST'])
def complex_attribute(request, C_id):
    serializer = ComplexAttributeSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)

@api_view(['POST'])
def feature(request, C_id):
    serializer = FeatureSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    
@api_view(['POST'])
def information(request, C_id):
    serializer = InformationSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(C_id)
        
        S100_Concept_Item.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
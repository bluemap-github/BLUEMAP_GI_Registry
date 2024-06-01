from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
        HTTP_400_BAD_REQUEST, 
    )
from regiSystem.models import (
    S100_Concept_Item,
)
from regiSystem.serializers.RE import (
    ConceptItemSerializer,
)
from regiSystem.serializers.CD import (
        SimpleAttributeSerializer,
        EnumeratedValueSerializer,
        ComplexAttributeSerializer,
        FeatureSerializer,
        InformationSerializer
)
itemTypeSet = {
        "EnumeratedValue": EnumeratedValueSerializer,
        "SimpleAttribute": SimpleAttributeSerializer,
        "ComplexAttribute": ComplexAttributeSerializer,
        "Feature": FeatureSerializer,
        "Information": InformationSerializer
    }

def getItemType(itemType, C_id):
    c_item_list = list(S100_Concept_Item.find({"concept_id": ObjectId(C_id), "itemType": itemType}).sort("_id", -1))
    serializer = itemTypeSet[itemType](c_item_list, many=True)
    return serializer

def make_response_data(serializer):
    response_data = {
        'register': "",
        'register_items': serializer.data
    }
    return response_data

@api_view(['GET'])
def enumerated_value_list(request, C_id):
    if request.method == 'GET':
        serializer = getItemType("EnumeratedValue", C_id)
        response_data = make_response_data(serializer)
        return Response(response_data)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def simple_attribute_list(request, C_id):
    if request.method == 'GET':
        serializer = getItemType("SimpleAttribute", C_id)
        response_data = make_response_data(serializer)
        return Response(response_data)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def enumerated_value_one():
    return 

@api_view(['GET'])
def complex_attribute_list(request, C_id):
    if request.method == 'GET':
        serializer = getItemType("ComplexAttribute", C_id)
        response_data = make_response_data(serializer)
        return Response(response_data)
    return

@api_view(['GET'])
def feature_list(request, C_id):
    if request.method == 'GET':
        serializer = getItemType("Feature", C_id)
        response_data = make_response_data(serializer)
        return Response(response_data)
    return

@api_view(['GET'])
def information_list(request, C_id):
    if request.method == 'GET':
        serializer = getItemType("Information", C_id)
        response_data = make_response_data(serializer)
        return Response(response_data)
    return

@api_view(['GET'])
def enumerated_value_one(request, EV_id):
    if request.method == 'GET':
        c_item = S100_Concept_Item.find_one({"_id": ObjectId(EV_id)})
        serializer = EnumeratedValueSerializer(c_item)
        return Response(serializer.data)
    return

@api_view(['GET'])
def simple_attribute_one(request, SA_id):
    if request.method == 'GET':
        c_item = S100_Concept_Item.find_one({"_id": ObjectId(SA_id)})
        serializer = SimpleAttributeSerializer(c_item)
        return Response(serializer.data)
    return

@api_view(['GET'])
def complex_attribute_one(request, CA_id):
    if request.method == 'GET':
        c_item = S100_Concept_Item.find_one({"_id": ObjectId(CA_id)})
        serializer = ComplexAttributeSerializer(c_item)
        return Response(serializer.data)
    return

@api_view(['GET'])
def feature_one(request, F_id):
    if request.method == 'GET':
        c_item = S100_Concept_Item.find_one({"_id": ObjectId(F_id)})
        serializer = FeatureSerializer(c_item)
        return Response(serializer.data)
    return

@api_view(['GET'])
def information_one(request, I_id):
    if request.method == 'GET':
        c_item = S100_Concept_Item.find_one({"_id": ObjectId(I_id)})
        serializer = InformationSerializer(c_item)
        return Response(serializer.data)
    return

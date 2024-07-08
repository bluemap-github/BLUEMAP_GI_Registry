from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.models import (
    S100_Concept_Item,
    S100_CD_AttributeConstraints
)
from regiSystem.serializers.CD import (
        SimpleAttributeSerializer,
        EnumeratedValueSerializer,
        ComplexAttributeSerializer,
        FeatureSerializer,
        InformationSerializer,
        AttributeConstraintsSerializer
)

import json
from regiSystem.InfoSec.encryption import (get_encrypted_id, decrypt)
itemTypeSet = {
        "EnumeratedValue": EnumeratedValueSerializer,
        "SimpleAttribute": SimpleAttributeSerializer,
        "ComplexAttribute": ComplexAttributeSerializer,
        "FeatureType": FeatureSerializer,
        "InformationType": InformationSerializer
}
itemIncryption = {
        "EnumeratedValue": "attributeId",
        "SimpleAttribute": "listedValue",
        "ComplexAttribute": "subAttribute",
        "FeatureType": "distinctedFeature",
        "InformationType": "distinctedInformation"
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
def ddr_item_list(request):
    C_id = request.GET.get('user_serial')
    item_type = request.GET.get('item_type')

    if request.method == 'GET':
        serializer = getItemType(item_type, C_id)
        for item in serializer.data:
            item["_id"] = get_encrypted_id(item["_id"])
        response_data = make_response_data(serializer)
        return Response(response_data)
    return Response(status=400, data={"error": "Invalid request method"})


def one_encrypt_process(id_attribute_set):
    if type(id_attribute_set) == list:
        for i in range(len(id_attribute_set)):
            id_attribute_set[i] = get_encrypted_id(str(id_attribute_set[i]))
        return id_attribute_set
    else:
        return get_encrypted_id(str(id_attribute_set))

@api_view(['GET'])
def ddr_item_one(request):
    
    item_type = request.GET.get('item_type')
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_Item.find_one({"_id": ObjectId(I_id)})
            if c_item is None:
                return Response(status=404, data={"error": "Item not found"})
            
            c_item["_id"] = get_encrypted_id(c_item["_id"])
            serializer = itemTypeSet[item_type](c_item)
            c_item[itemIncryption[item_type]] = one_encrypt_process(c_item[itemIncryption[item_type]])
            return Response(serializer.data)
        
        except Exception as e:
            return Response(status=500, data={"error": str(e)})
    return Response(status=400, data={"error": "Invalid request method"})


@api_view(['GET'])
def attribute_constraints(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_CD_AttributeConstraints.find({'simpleAttribute': ObjectId(I_id)})
            if not c_item:
                Response({"attribute_constraint" : []})
            serializer = AttributeConstraintsSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id(item["_id"])
            return Response({"attribute_constraint" : serializer.data})
        except Exception as e:
            return Response(status=400, data={"error": str(e)})
        
         



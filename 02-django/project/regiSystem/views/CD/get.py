from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.models import S100_Concept_Item
from regiSystem.serializers.CD import (
        SimpleAttributeSerializer,
        EnumeratedValueSerializer,
        ComplexAttributeSerializer,
        FeatureSerializer,
        InformationSerializer
)
import json
from regiSystem.InfoSec.encryption import (encrypt, get_encrypted_id, decrypt)
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
            return Response(serializer.data)
        
        except Exception as e:
            return Response(status=500, data={"error": str(e)})
    return Response(status=400, data={"error": "Invalid request method"})

@api_view(['GET'])
def not_related_enum_list_search(request):
    C_id = request.GET.get('user_serial')
    search_term = request.query_params.get('search_term', '')
    
    if request.method == 'GET':
        query = {
            "concept_id": ObjectId(C_id), 
            "itemType": "EnumeratedValue", 
            "associated_arrtibute_id": ""
        }
        
        if search_term:
            query["name"] = {"$regex": search_term, "$options": "i"}
        
        c_item_list = list(S100_Concept_Item.find(query).sort("_id", -1))

        for item in c_item_list:
            item["_id"] = get_encrypted_id(item["_id"])

        serializer = EnumeratedValueSerializer(c_item_list, many=True)

        return Response(serializer.data, status=200)
    
    return Response(status=400, data={"error": "Invalid request method"})

@api_view(['GET'])
def associated_attribute_list_search(request):
    C_id = request.GET.get('user_serial')
    search_term = request.query_params.get('search_term', '')
    
    if request.method == 'GET':
        query = {
            "concept_id": ObjectId(C_id), 
            "itemType": "ComplexAttribute", 
        }
        
        if search_term:
            query["name"] = {"$regex": search_term, "$options": "i"}
        
        c_item_list = list(S100_Concept_Item.find(query).sort("_id", -1))

        for item in c_item_list:
            item["_id"] = get_encrypted_id(item["_id"])

        serializer = ComplexAttributeSerializer(c_item_list, many=True)

        return Response(serializer.data, status=200)
    
    return Response(status=400, data={"error": "Invalid request method"})


@api_view(['GET'])
def sub_att_list_search(request): # 이 함수는 로직이 아직 완성 안됨
    C_id = request.GET.get('user_serial')
    search_term = request.query_params.get('search_term', '')
    
    if request.method == 'GET':
        query = {
            "concept_id": ObjectId(C_id), 
            "itemType": {"$in": ["SimpleAttribute"]}, 
        }
        if search_term:
            query["name"] = {"$regex": search_term, "$options": "i"}
        c_item_list = list(S100_Concept_Item.find(query).sort("_id", -1))
        simple_attributes = [item for item in c_item_list if item['itemType'] == 'SimpleAttribute']
        simple_attributes_serialized = SimpleAttributeSerializer(simple_attributes, many=True).data
        
        return Response({'simple_attributes': simple_attributes_serialized})
    return Response(status=400, data={"error": "Invalid request method"})


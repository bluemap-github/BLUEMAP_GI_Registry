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
        "FeatureType": FeatureSerializer,
        "InformationType": InformationSerializer
    }

@api_view(['GET'])
def related_item(request):
    C_id = request.GET.get('user_serial')
    search_term = request.query_params.get('search_term', '')
    item_type = list(request.GET.get('item_type').split(','))
    print(item_type)
    
    if request.method == 'GET':
        query = {
            "concept_id": ObjectId(C_id), 
            "itemType": {"$in": item_type}, 
        }
        if search_term:
            query["name"] = {"$regex": search_term, "$options": "i"}
        simple_attributes = list(S100_Concept_Item.find(query).sort("_id", -1))
        attributes_serialized = []

        for attribute in simple_attributes:
            attributes_serialized.append(itemTypeSet[attribute["itemType"]](attribute).data)
        
        return Response({'search_result': attributes_serialized})
    return Response(status=400, data={"error": "Invalid request method"})
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

@api_view(['GET'])
def related_item(request): # 이 함수는 로직이 아직 완성 안됨
    C_id = request.GET.get('user_serial')
    search_term = request.query_params.get('search_term', '')
    item_type = request.GET.get('item_type')
    
    if request.method == 'GET':
        query = {
            "concept_id": ObjectId(C_id), 
            "itemType": {"$in": [item_type]}, 
        }
        if search_term:
            query["name"] = {"$regex": search_term, "$options": "i"}
        c_item_list = list(S100_Concept_Item.find(query).sort("_id", -1))
        simple_attributes = [item for item in c_item_list if item['itemType'] == 'SimpleAttribute']
        simple_attributes_serialized = SimpleAttributeSerializer(simple_attributes, many=True).data
        
        return Response({'simple_attributes': simple_attributes_serialized})
    return Response(status=400, data={"error": "Invalid request method"})
from bson.objectid import ObjectId
from regiSystem.models.Concept import (
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
        ConceptReferenceSerializer
    )
from regiSystem.serializers.CD import (
        SimpleAttributeSerializer,
        EnumeratedValueSerializer,
        ComplexAttributeSerializer,
        FeatureSerializer,
        InformationSerializer,
        AttributeConstraintsSerializer
)
itemTypeSet = {
        "ConceptItem": ConceptItemSerializer,
        "EnumeratedValue": EnumeratedValueSerializer,
        "SimpleAttribute": SimpleAttributeSerializer,
        "ComplexAttribute": ComplexAttributeSerializer,
        "FeatureType": FeatureSerializer,
        "InformationType": InformationSerializer
}
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
import json
from regiSystem.info_sec.encryption import (encrypt, get_encrypted_id, decrypt)

@api_view(['PUT'])
def concept_register(request, C_id):
    try:
        c_register = S100_Concept_Register.find_one({'_id': ObjectId(C_id)})
        if request.method == 'PUT':
            serializer = ConceptSerializer(c_register, data=request.data)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                S100_Concept_Register.update_one({'_id': ObjectId(C_id)}, {'$set': validated_data})
                return Response(serializer.data, status=HTTP_201_CREATED)
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    except Exception as e: 
        return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def concept_item(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    item_type = request.GET.get('item_type')

    c_item = S100_Concept_Item.find_one({'_id': ObjectId(I_id)})
    serializer = itemTypeSet[item_type](c_item, data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_id'] = ObjectId(validated_data['concept_id'])
        S100_Concept_Item.update_one({'_id': ObjectId(I_id)}, {'$set': validated_data})
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        

@api_view(['PUT'])
def concept_managemant_info(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    
    c_management_info = S100_Concept_ManagementInfo.find_one({'_id': ObjectId(I_id)})
    serializer = ConceptManagementInfoSerializer(c_management_info, data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        S100_Concept_ManagementInfo.update_one({'_id': ObjectId(I_id)}, {'$set': validated_data})
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def concept_reference_source(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    c_reference_source = S100_Concept_ReferenceSource.find_one({'_id': ObjectId(I_id)})
    serializer = ConceptReferenceSourceSerializer(c_reference_source, data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        S100_Concept_ReferenceSource.update_one({'_id': ObjectId(I_id)}, {'$set': validated_data})
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def concept_reference(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    
    c_reference = S100_Concept_Reference.find_one({'_id': ObjectId(I_id)})
    serializer = ConceptReferenceSerializer(c_reference, data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        S100_Concept_Reference.update_one({'_id': ObjectId(I_id)}, {'$set': validated_data})
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

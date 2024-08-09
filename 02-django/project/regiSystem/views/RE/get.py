from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
        HTTP_400_BAD_REQUEST, 
        HTTP_404_NOT_FOUND,
        HTTP_405_METHOD_NOT_ALLOWED,
        HTTP_401_UNAUTHORIZED,
        HTTP_200_OK,
        HTTP_500_INTERNAL_SERVER_ERROR
    )
from regiSystem.models import (
    S100_Concept_Register,
    S100_Concept_Item,
    S100_Concept_ManagementInfo,
    S100_Concept_ReferenceSource,
    S100_Concept_Reference,
)
from regiSystem.serializers.RE import (
    ConceptSerializer,
    ConceptItemSerializer,
    ConceptReferenceSerializer,
    ConceptReferenceSourceSerializer,
    ConceptManagementInfoSerializer, 
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
import json
from regiSystem.info_sec.encryption import (encrypt, get_encrypted_id, decrypt)

@api_view(['GET'])
def concept_register_list(request):
    if request.method == 'GET':
        try :
            cursor = S100_Concept_Register.find()
            serializer = ConceptSerializer(cursor, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_register_detail(request):
    C_id = request.GET.get('user_serial')
    if request.method == 'GET':
        try:
            c_register = S100_Concept_Register.find_one({'_id': ObjectId(C_id)})
            if c_register:
                serializer = ConceptSerializer(c_register)
                return Response(serializer.data)
            else:
                return Response({'error': 'Register not found'}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
    return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

def make_response_data(serializer):
    response_data = {
        'register': "",
        'register_items': serializer.data
    }
    return response_data


@api_view(['GET'])
def concept_item_list(request): 
    if request.method == 'GET':
        C_id = request.GET.get('user_serial')
        search_term = request.GET.get('search_term', '')
        status = request.GET.get('status', '')
        category = request.GET.get('category', '')

        try:
            query = {"concept_id": ObjectId(C_id)}
            if status:
                query["itemStatus"] = status
            if search_term:
                if category == "name":
                    query["name"] = {"$regex": search_term, "$options": "i"}
                elif category == "camelCase":
                    query["camelCase"] = {"$regex": search_term, "$options": "i"}
                elif category == "definition":
                    query["definition"] = {"$regex": search_term, "$options": "i"}
            c_item_list = list(S100_Concept_Item.find(query).sort("_id", -1))
            serializer = ConceptItemSerializer(c_item_list, many=True)

            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])

            response_data = make_response_data(serializer)
            return Response(response_data)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_item_one(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    
    if request.method == 'GET':
        try:
            c_item = S100_Concept_Item.find_one({'_id': ObjectId(I_id)})
            if not c_item:
                return Response({'error': 'Concept item not found'}, status=HTTP_400_BAD_REQUEST)
            c_item["_id"] = get_encrypted_id([c_item["_id"]])
            serializer = itemTypeSet[c_item["itemType"]](c_item)
            return Response({'item': serializer.data })
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_managemant_info(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_ManagementInfo.find({'concept_item_id': ObjectId(I_id)})
            if not c_item:
                Response({"management_infos" : []})
            serializer = ConceptManagementInfoSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            return Response({"management_infos" : serializer.data})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def concept_reference_source(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_ReferenceSource.find({'concept_item_id': ObjectId(I_id)})
            if not c_item:
                Response({"reference_sources" : []})
            serializer = ConceptReferenceSourceSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            return Response({"reference_sources" : serializer.data})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def concept_reference(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_Reference.find({'concept_item_id': ObjectId(I_id)})
            if not c_item:
                Response({"references" : []})
            serializer = ConceptReferenceSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            return Response({"references" : serializer.data})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

import jwt
from django.conf import settings
from userSystem.models import UserModel, ParticipationModel
@api_view(['GET'])
def register_info_for_guest(request): ## 0808 이거 문제 있음 수정 필요
    auth_header = request.headers.get('Authorization')
    regi_uri = request.GET.get('regi_uri')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        print("No auth header or token missing")
        return Response({"message": "Guest"}, status=HTTP_200_OK)
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = UserModel.get_user_id_by_email(payload.get('email'))
        if not user_id:
            return Response({"error": "User not found"}, status=HTTP_404_NOT_FOUND)
        s_item = S100_Concept_Register.find_one({'uniformResourceIdentifier': regi_uri})
        if not s_item:
            return Response({"error": "Item not found"}, status=HTTP_404_NOT_FOUND)
        regi_id = s_item["_id"]
        print(user_id, regi_id)
        role = ParticipationModel.get_role(user_id, regi_id)
        if not role:
            return Response({"message": "Guest"}, status=HTTP_200_OK)

        return Response({"message": "You are Owner"}, status=HTTP_200_OK)
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return Response(status=HTTP_400_BAD_REQUEST)
    except jwt.InvalidTokenError:
        print("Invalid token")
        return Response(status=HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("An unexpected error occurred:", str(e))
        return Response({"error": "Internal Server Error"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

            

    
    # if request.method == 'GET':
    #     try:
    #         s_item = S100_Concept_Register.find_one({'uniformResourceIdentifier': regi_uri})
    #         serializer = ConceptSerializer(s_item)
    #         print(serializer.data, "??")
    #         response_data = serializer.data
    #         # response_data = get_encrypted_id([serializer.data["_id"]])
    #         return Response(response_data)

    #     except Exception as e:
    #         return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
    return Response(status=HTTP_400_BAD_REQUEST)



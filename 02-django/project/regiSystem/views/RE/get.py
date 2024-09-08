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
from regiSystem.models.Concept import (
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
from regiSystem.info_sec.getByURI import uri_to_serial

@api_view(['GET'])
def concept_register_list(request):
    search_term = request.query_params.get('search_term', '')
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 10))
    sort_key = request.query_params.get('sort_key', 'name')  # 정렬 기준 (기본값: name)
    sort_direction = request.query_params.get('sort_direction', 'ascending')  # 정렬 방향 (기본값: ascending)

    if request.method == 'GET':
        query = {}
        try:
            if search_term:
                query["name"] = {"$regex": search_term, "$options": "i"}

            total_items = S100_Concept_Register.count_documents(query)
            cursor = S100_Concept_Register.find(query)

            # 정렬 적용
            sort_order = 1 if sort_direction == 'ascending' else -1
            cursor = cursor.sort(sort_key, sort_order)

            # 페이지네이션 적용
            paginated_cursor = cursor.skip((page - 1) * page_size).limit(page_size)
            
            serializer = ConceptSerializer(paginated_cursor, many=True)

            return Response({
                'total_items': total_items,
                'total_pages': (total_items + page_size - 1) // page_size,
                'current_page': page,
                'page_size': page_size,
                'results': serializer.data,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
    return Response({'error': 'Invalid request method'}, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def concept_register_detail(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
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

import math

@api_view(['GET'])
def concept_item_list(request): 
    if request.method == 'GET':
        C_id = uri_to_serial(request.GET.get('regi_uri'))
        search_term = request.GET.get('search_term', '')
        status = request.GET.get('status', '')
        category = request.GET.get('category', '')
        sort_key = request.GET.get('sort_key', '_id')  # 정렬 키 (기본값: _id)
        sort_direction = request.GET.get('sort_direction', 'ascending')  # 정렬 방향 (기본값: ascending)
        page = int(request.GET.get('page', 1))  # 현재 페이지 번호, 기본값은 1
        page_size = int(request.GET.get('page_size', 10))  # 페이지 크기, 기본값은 10

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

            total_items = S100_Concept_Item.count_documents(query)  # 총 항목 수 계산
            sort_order = 1 if sort_direction == 'ascending' else -1

            c_item_list = list(S100_Concept_Item.find(query)
                               .sort(sort_key, sort_order)
                               .skip((page - 1) * page_size)
                               .limit(page_size))

            serializer = ConceptItemSerializer(c_item_list, many=True)

            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])

            total_pages = math.ceil(total_items / page_size)  # 총 페이지 수 계산

            response_data = {
                'total_items': total_items,
                'total_pages': total_pages,
                'current_page': page,
                'page_size': page_size,
                'register_items': serializer.data,  # 데이터 응답
            }

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
def register_info_for_guest(request): 
    auth_header = request.headers.get('Authorization')
    regi_uri = request.GET.get('regi_uri')
    
    if not auth_header or not auth_header.startswith('Bearer '):
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


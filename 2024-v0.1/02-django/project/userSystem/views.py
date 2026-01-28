# userSystem/views.py
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from django.conf import settings
from .models import (UserModel, ParticipationModel)
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from bson.objectid import ObjectId
from drf_yasg.utils import swagger_auto_schema


from .serializers import ParticipationSerializer
from regiSystem.serializers.RE import ConceptSerializer

from .manage_auth.check_auth import get_email_from_jwt

SECRET_KEY = settings.SECRET_KEY

from regiSystem.models.Concept import (S100_Concept_Register, RegiModel)
@csrf_exempt
@api_view(['POST'])
@swagger_auto_schema(auto_schema=None)
def check_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        
        if UserModel.get_user(email):
            return JsonResponse({'exists': True}, status=200)
        return JsonResponse({'exists': False}, status=200)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
@api_view(['POST'])
@swagger_auto_schema(auto_schema=None)
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        UserModel.create_user(email, password, name)
        return JsonResponse({'message': 'User created successfully'}, status=201)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
@api_view(['POST'])
@swagger_auto_schema(auto_schema=None)
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if UserModel.check_password(email, password):
            token = jwt.encode({'email': email}, SECRET_KEY, algorithm='HS256')
            return JsonResponse({'message': 'Login successful', 'token': token}, status=200)
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
@api_view(['GET'])
@swagger_auto_schema(auto_schema=None)
def check_auth(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized: No token provided'}, status=401)

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = payload.get('email')
        
        if email:
            # 데이터베이스에서 사용자 정보를 가져옴
            user = UserModel.get_user(email)
            if user:
                user_info = {
                    'email': user.get('email'),
                    'name': user.get('name'),
                }
                return JsonResponse({'message': 'Authorized', 'user': user_info}, status=200)
            else:
                return JsonResponse({'error': 'Unauthorized: User not found'}, status=401)
        else:
            return JsonResponse({'error': 'Unauthorized: Invalid token'}, status=401)
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Unauthorized: Token has expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Unauthorized: Invalid token'}, status=401)

@csrf_exempt
@api_view(['GET'])
@swagger_auto_schema(auto_schema=None)
def get_registry_list(request):
    if request.method == 'GET':
        email = get_email_from_jwt(request)
        if not email:
            return JsonResponse({"error": "Invalid token"}, status=400)
        user_id = ObjectId(UserModel.get_user_id_by_email(email))
        if not user_id:
            return JsonResponse({"error": "User not found"}, status=400)

        role = request.GET.get('role')
        participations = ParticipationModel.get_participations(user_id, role)
        registries = ConceptSerializer(participations, many=True).data 
        return JsonResponse(registries, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=400)


from datetime import datetime, timedelta, timezone
import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings

def make_role_payload(role):
    return {
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)
    }

@api_view(['GET'])
@swagger_auto_schema(auto_schema=None)
def register_info_for_guest(request): 
    auth_header = request.headers.get('Authorization')
    regi_uri = request.GET.get('regi_uri')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"role" : "guest"}, status=200)
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = UserModel.get_user_id_by_email(payload.get('email'))
        if not user_id:
            return Response({"error": "User not found"}, status=404)
        s_item = S100_Concept_Register.find_one({'uniformResourceIdentifier': regi_uri})
        if not s_item:
            return Response({"error": "Item not found"}, status=404)
        regi_id = s_item["_id"]
        print(user_id, regi_id)
        role = ParticipationModel.get_role(user_id, regi_id)
        if not role:
            return Response({"role" : "guest"}, status=200)


        return Response({"role" : "owner"}, status=200)

    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return Response(status=HTTP_400_BAD_REQUEST)
    except jwt.InvalidTokenError:
        print("Invalid token")
        return Response(status=HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("An unexpected error occurred:", str(e))
        return Response({"error": "Internal Server Error"}, status=500)

@api_view(['GET'])
def get_regi_api_info(request):
    regi_uri = request.GET.get('regiURI')
    regi_item = RegiModel.get_registry(regi_uri)
    if not regi_item:
        return Response({"error": "Item not found"}, status=404)
    regi_obj_id = regi_item["_id"]
    regi_item.pop("_id")
    participate_item = ParticipationModel.get_participation_by_regi_id(regi_obj_id)
    participate_item.pop("_id")
    participate_item.pop("user_id")
    participate_item.pop("registry_id")

    return Response({
        "regi_item": regi_item,
        "participate_item": participate_item
    }, status=200)
# userSystem/views.py
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from django.conf import settings
from .models import UserModel

SECRET_KEY = settings.SECRET_KEY

@csrf_exempt
def check_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        
        if UserModel.get_user(email):
            return JsonResponse({'exists': True}, status=200)
        return JsonResponse({'exists': False}, status=200)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
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
                    # 필요한 추가 정보가 있다면 여기에 추가
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
def logout(request):
    if request.method == 'POST':
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Unauthorized: No token provided'}, status=401)

        token = auth_header.split(' ')[1]
        # 블랙리스트에 토큰 추가
        BlacklistToken.add(token)
        
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request'}, status=400)
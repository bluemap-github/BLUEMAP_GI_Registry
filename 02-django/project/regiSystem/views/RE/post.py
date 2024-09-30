from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
import random
import string

from regiSystem.models.Concept import (
        S100_Concept_Register,
        S100_Concept_Item,
        S100_Concept_ManagementInfo,
        S100_Concept_ReferenceSource,
        S100_Concept_Reference,
        RegiModel
    )
from regiSystem.serializers.RE import (
        ConceptSerializer,
        ConceptItemSerializer,
        ConceptManagementInfoSerializer,
        ConceptReferenceSourceSerializer,
        ConceptReferenceSerializer,
    )

from userSystem.models import (ParticipationModel, UserModel)
from userSystem.manage_auth.check_auth import (get_email_from_jwt)

import json
from regiSystem.info_sec.encryption import (encrypt, get_encrypted_id, decrypt)

def generate_random_string(length=12): 
    all_characters = string.ascii_letters + string.digits + string.punctuation
    exclude_characters = "\"./:;<=>[\]`{|}'(),#+-&"
    allowed_characters = ''.join(c for c in all_characters if c not in exclude_characters)
    random_string = ''.join(random.choice(allowed_characters) for _ in range(length))
    return random_string

@api_view(['POST'])
def concept_register(request):
    if request.method == 'POST':
        serializer = ConceptSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            email = get_email_from_jwt(request)
            if not email:
                return Response({"error": "Invalid token"}, status=HTTP_400_BAD_REQUEST)
            
            user_id = UserModel.get_user_id_by_email(email)
            if not user_id:
                return Response({"error": "User not found"}, status=HTTP_400_BAD_REQUEST)
            
            S100_Concept_Register.insert_one(validated_data)
            registry_id = ObjectId(serializer.data.get("_id"))
            role = "owner"
            serial_key = generate_random_string()
            ParticipationModel.create_participation(user_id, registry_id, role, serial_key)
            RegiModel.update_date(registry_id)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def mamagement_info(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    serializer = ConceptManagementInfoSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)

        S100_Concept_ManagementInfo.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reference_source(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    serializer = ConceptReferenceSourceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_ReferenceSource.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reference(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    serializer = ConceptReferenceSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        validated_data['concept_item_id'] = ObjectId(I_id)
        
        S100_Concept_Reference.insert_one(validated_data)
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)






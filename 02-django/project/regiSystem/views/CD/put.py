from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.info_sec.encryption import decrypt

from openApiSystem.models.registry.item import RE_Register
from openApiSystem.models.dataDictionary.item import (
    CD_EnumeratedValue,
    CD_SimpleAttribute,
    CD_ComplexAttribute,
    CD_Feature,
    CD_Information
)
from openApiSystem.serializers.dataDictionary.item import (
    CD_EnumeratedValueSerializer,
    CD_SimpleAttributeSerializer,
    CD_ComplexAttributeSerializer,
    CD_FeatureSerializer,
    CD_InformationSerializer
)
### 공통함수
def get_params(request):
    item_iv = request.GET.get('item_iv')
    item_id = decrypt(request.GET.get('item_id'), item_iv)

    return item_id


@api_view(['PUT'])
def enumerated_value(request):
    I_id = get_params(request)
    
    enum_serializer = CD_EnumeratedValueSerializer(data=request.data)
    if enum_serializer.is_valid():
        validated_data = enum_serializer.validated_data
        res = CD_EnumeratedValue.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": enum_serializer.errors}, status=400)


@api_view(['PUT'])
def simple_attribute(request):
    I_id = get_params(request)
    
    simple_serializer = CD_SimpleAttributeSerializer(data=request.data)
    if simple_serializer.is_valid():
        validated_data = simple_serializer.validated_data
        res = CD_SimpleAttribute.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": simple_serializer.errors}, status=400)


@api_view(['PUT'])
def complex_attribute(request):
    I_id = get_params(request)
    
    complex_serializer = CD_ComplexAttributeSerializer(data=request.data)
    if complex_serializer.is_valid():
        validated_data = complex_serializer.validated_data
        res = CD_ComplexAttribute.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": complex_serializer.errors}, status=400)



@api_view(['PUT'])
def feature(request):
    I_id = get_params(request)
    
    feature_serializer = CD_FeatureSerializer(data=request.data)
    if feature_serializer.is_valid():
        validated_data = feature_serializer.validated_data
        res = CD_Feature.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": feature_serializer.errors}, status=400)


@api_view(['PUT'])
def information(request):
    I_id = get_params(request)
    
    info_serializer = CD_InformationSerializer(data=request.data)
    if info_serializer.is_valid():
        validated_data = info_serializer.validated_data
        res = CD_Information.update(I_id, validated_data)
        if res.get("status") == "error":
            return Response({"status": "error", "message": res.get("message")}, status=404)
        else:
            return Response({"status": "success", "data": res.get("updated_id")}, status=201)
    else:
        # Serializer 유효성 검사 실패 시 에러 반환
        return Response({"status": "error", "message": info_serializer.errors}, status=400)


@api_view(['PUT'])
def associated_attribute(request):
    is_row_id = request.data.get('is_row_id')
    parent_id = ""
    if is_row_id:
        parent_id = request.data.get('updated_id')
    else:
        parent_id = decrypt(request.data.get('updated_id').get('parent_id'), request.data.get('updated_id').get('parent_iv'))
    child_id = decrypt(request.data.get('child_id').get('encrypted_data'), request.data.get('child_id').get('iv'))
    print(parent_id, child_id)
    
    return Response({"status": "success", "message": "Not implemented yet"}, status=201)


@api_view(['PUT'])
def sub_attribute(request):
    return Response({"status": "success", "message": "Not implemented yet"}, status=201)


@api_view(['PUT'])
def distinction(request):
    return Response({"status": "success", "message": "Not implemented yet"}, status=201)
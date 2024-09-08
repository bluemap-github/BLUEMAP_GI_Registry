from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.models.PR_Visual import (
    SymbolSchemaModel,
)
from regiSystem.serializers.PR import S100_PR_ItemSchemaSerializer

from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)
from regiSystem.info_sec.getByURI import uri_to_serial

@api_view(['GET'])
def get_symbol_schema_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    symbol_schema_data = SymbolSchemaModel.get_list(C_id)  # 이 데이터는 이미 직렬화된 데이터가 아님

    if symbol_schema_data['status'] == 'success':
        serializer = S100_PR_ItemSchemaSerializer(symbol_schema_data['data'], many=True)
        return Response(serializer.data, status=200)  # `.data`를 반환
    else:
        return Response(symbol_schema_data, status=400)


@api_view(['GET'])
def get_symbol_schema(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)
    symbol_schema = SymbolSchemaModel.get(I_id)
    return Response(symbol_schema, status=200)
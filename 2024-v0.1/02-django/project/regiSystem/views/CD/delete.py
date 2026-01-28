from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.info_sec.encryption import decrypt


from regiSystem.models.Concept import ConstraintsModel

@api_view(["DELETE"])
def attribute_constraints(request):
    item_id = request.GET.get('item_id')
    item_iv = request.GET.get('item_iv')
    item_id = decrypt(item_id, item_iv)
    
    result = ConstraintsModel.delete(item_id)
    return Response(result)
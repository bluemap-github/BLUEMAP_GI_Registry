from bson.objectid import ObjectId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from regiSystem.models.Concept import (
    S100_Concept_Item,
    S100_CD_AttributeConstraints,
    ListedValue,
    AttributeUsage,
    Distinction
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
        "EnumeratedValue": EnumeratedValueSerializer,
        "SimpleAttribute": SimpleAttributeSerializer,
        "ComplexAttribute": ComplexAttributeSerializer,
        "FeatureType": FeatureSerializer,
        "InformationType": InformationSerializer
}

from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)



def getItemType(itemType, C_id):
    c_item_list = list(S100_Concept_Item.find({"concept_id": ObjectId(C_id), "itemType": itemType}).sort("_id", -1))
    serializer = itemTypeSet[itemType](c_item_list, many=True)
    return serializer

def make_response_data(serializer):
    response_data = {
        'register': "",
        'register_items': serializer.data
    }
    return response_data

def offer_item_nameNtype(id):
    c_item = S100_Concept_Item.find_one({"_id": ObjectId(id)})
    return c_item["name"], c_item["itemType"]
    
from regiSystem.info_sec.getByURI import uri_to_serial
@api_view(['GET'])
def ddr_item_list(request):
    C_id = uri_to_serial(request.GET.get('regi_uri'))
    item_type = request.GET.get('item_type')
    search_term = request.GET.get('search_term', '')
    status = request.GET.get('status', '')
    category = request.GET.get('category', '')
    enumType = request.GET.get('enum_type', '')
    valueType = request.GET.get('value_type', '')
    sort_key = request.GET.get('sort_key', '_id')  # 기본값 '_id'
    sort_direction = request.GET.get('sort_direction', 'ascending')  # 기본값 'ascending'
    page = int(request.GET.get('page', 1))  # 기본값 1
    page_size = int(request.GET.get('page_size', 10))  # 기본값 10

    if request.method == 'GET':
        query = {"concept_id": ObjectId(C_id), "itemType": item_type}
        if status:
            query["itemStatus"] = status
        if search_term:
            if category == "name":
                query["name"] = {"$regex": search_term, "$options": "i"}
            elif category == "camelCase":
                query["camelCase"] = {"$regex": search_term, "$options": "i"}
            elif category == "definition":
                query["definition"] = {"$regex": search_term, "$options": "i"}
        if item_type == "EnumeratedValue" and enumType != "":
            query["enumType"] = enumType
        elif item_type == "SimpleAttribute" and valueType != "":
            query["valueType"] = valueType

        # 전체 항목 수 계산
        total_items = S100_Concept_Item.count_documents(query)

        # 정렬 및 페이지네이션 적용
        sort_order = 1 if sort_direction == 'ascending' else -1
        c_item_list = list(S100_Concept_Item.find(query)
                           .sort(sort_key, sort_order)
                           .skip((page - 1) * page_size)
                           .limit(page_size))

        serializer = itemTypeSet[item_type](c_item_list, many=True)

        for item in serializer.data:
            item["_id"] = get_encrypted_id([item["_id"]])

        response_data = {
            'register_items': serializer.data,
            'total_items': total_items,
            'total_pages': (total_items + page_size - 1) // page_size,
            'current_page': page,
            'page_size': page_size
        }
        return Response(response_data)

    return Response(status=400, data={"error": "Invalid request method"})





def one_encrypt_process(id_attribute_set):
    if type(id_attribute_set) == list:
        for i in range(len(id_attribute_set)):
            id_attribute_set[i] = get_encrypted_id([str(id_attribute_set[i]), *offer_item_nameNtype(id_attribute_set[i])])
        return id_attribute_set
    elif type(id_attribute_set) == str:
        res = get_encrypted_id([str(id_attribute_set), *offer_item_nameNtype(id_attribute_set)])
        print(res)
        return res

class GetRelatedValues:
    itemIncryption = {
        "EnumeratedValue": "attributeId",
        "SimpleAttribute": "listedValue",
        "ComplexAttribute": "subAttribute",
        "FeatureType": "distinction",
        "InformationType": "distinction"
    }

    def __init__(self, parent_id, data):
        self.parent_id = parent_id
        self.data = data

    def get_listed_value(self):
        self.data["listedValue"] = []
        items = ListedValue.get_listed_value(self.parent_id)
        for item in items:
            self.data["listedValue"].append(item["child_id"])
        return self.data

    def get_attribute_id(self):
        self.data["attributeId"] = []
        parent_id = ListedValue.get_parent_id(self.parent_id)
        self.data["attributeId"].append(parent_id)
        return self.data
    
    def get_sub_attribute_id(self):
        self.data["subAttribute"] = []
        sub_attribute = AttributeUsage.get_sub_attributes(self.parent_id)
        for item in sub_attribute:
            self.data["subAttribute"].append(item["child_id"])
        return self.data
    
    def get_distincted_item(self):
        self.data["distinction"] = []
        items = Distinction.get_distincted_item(self.parent_id)
        for item in items:
            self.data["distinction"].append(item["child_id"])
        return self.data


    
    def call_function(self, key):
        get_related_values_function = {
            "EnumeratedValue": "get_attribute_id",
            "SimpleAttribute": "get_listed_value",
            "ComplexAttribute": "get_sub_attribute_id",
            "FeatureType": "get_distincted_item",
            "InformationType": "get_distincted_item"
        }
        
        function_name = get_related_values_function.get(key)
        
        if function_name:
            return getattr(self, function_name)()
        else:
            raise ValueError(f"Invalid item_type: {key}")

    def get_encryption_key(self, key):
        if key in self.itemIncryption:
            return self.itemIncryption[key]
        else:
            raise ValueError(f"Invalid item_type for encryption: {key}")


@api_view(['GET'])
def ddr_item_one(request):
    item_type = request.GET.get('item_type')
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_Concept_Item.find_one({"_id": ObjectId(I_id)})
            if c_item is None:
                return Response(status=404, data={"error": "Item not found"})
            
            parent_id = str(c_item["_id"])
            c_item["_id"] = get_encrypted_id([c_item["_id"]])
            serializer = itemTypeSet[item_type](c_item)
            data = dict(serializer.data)
            
            related_values = GetRelatedValues(parent_id, data)
            data = related_values.call_function(item_type)
            encryption_key = related_values.get_encryption_key(item_type)
            data[encryption_key] = one_encrypt_process(data[encryption_key])
            
            return Response(data)
        
        except Exception as e:
            return Response(status=500, data={"error": str(e)})
    
    return Response(status=400, data={"error": "Invalid request method"})




@api_view(['GET'])
def attribute_constraints(request):
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = S100_CD_AttributeConstraints.find({'simpleAttribute': ObjectId(I_id)})
            if not c_item:
                Response({"attribute_constraint" : []})
            serializer = AttributeConstraintsSerializer(c_item, many=True)
            for item in serializer.data:
                item["_id"] = get_encrypted_id([item["_id"]])
            return Response({"attribute_constraint" : serializer.data})
        except Exception as e:
            return Response(status=400, data={"error": str(e)})
        
         



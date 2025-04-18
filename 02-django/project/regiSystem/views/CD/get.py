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

def query_ddr_item_list(request, collection, query=None):
    if query is None:
        # 기존 로직 사용
        C_id = uri_to_serial(request.GET.get('regi_uri'))
        item_type = request.GET.get('item_type')
        query = {"concept_id": ObjectId(C_id), "itemType": item_type}
        # 이하 status, search_term 등 조건 추가...
        search_term = request.GET.get('search_term', '')
        status = request.GET.get('status', '')
        category = request.GET.get('category', '')
        enumType = request.GET.get('enum_type', '')
        valueType = request.GET.get('value_type', '')
        if status:
            query["itemStatus"] = status
        if search_term:
            if category == "name":
                query["name"] = {"$regex": search_term, "$options": "i"}
            elif category == "camelCase":
                query["camelCase"] = {"$regex": search_term, "$options": "i"}
            elif category == "definition":
                query["definition"] = {"$regex": search_term, "$options": "i"}
        if item_type == "EnumeratedValue" and enumType:
            query["enumType"] = enumType
        elif item_type == "SimpleAttribute" and valueType:
            query["valueType"] = valueType

    # pagination 공통 처리
    sort_key = request.GET.get('sort_key', '_id')
    sort_direction = request.GET.get('sort_direction', 'ascending')
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 10))

    total_items = collection.count_documents(query)
    sort_order = 1 if sort_direction == 'ascending' else -1
    c_item_list = list(collection.find(query)
                       .sort(sort_key, sort_order)
                       .skip((page - 1) * page_size)
                       .limit(page_size))

    item_type = query.get("itemType")
    serializer = itemTypeSet[item_type](c_item_list, many=True)

    for item in serializer.data:
        item["_id"] = get_encrypted_id([item["_id"]])

    return {
        'register_items': serializer.data,
        'total_items': total_items,
        'total_pages': (total_items + page_size - 1) // page_size,
        'current_page': page,
        'page_size': page_size
    }

from ihoDataIntegrationSystem.models import (
    IHO_Item, IHO_ManagementInfo, IHO_Reference, IHO_ReferenceSource,
)
from regiSystem.info_sec.getByURI import uri_to_serial

@api_view(['GET'])
def ddr_item_list(request):
    if request.method != 'GET':
        return Response(status=400, data={"error": "Invalid request method"})

    response_data = query_ddr_item_list(request, S100_Concept_Item, query=None)
    return Response(response_data)



def one_encrypt_process(id_attribute_set, collection):
    if isinstance(id_attribute_set, list):
        for i in range(len(id_attribute_set)):
            print("?????????", i)
            id_attribute_set[i] = get_encrypted_id(
                [str(id_attribute_set[i]), *fetch_name_type(id_attribute_set[i], collection)]
            )
        return id_attribute_set
    elif isinstance(id_attribute_set, str):
        res = get_encrypted_id(
            [str(id_attribute_set), *fetch_name_type(id_attribute_set, collection)]
        )
        return res

def fetch_name_type(id, collection):
    print("fetch_name_type", id)
    c_item = collection.find_one({"_id": ObjectId(id)})

    print("fetch_name_type", c_item)
    if "numericCode" in c_item:
        return c_item["name"], c_item["itemType"], c_item["numericCode"]
    return c_item["name"], c_item["itemType"]

class GetRelatedValues:
    itemIncryption = {
        "EnumeratedValue": "attributeId",
        "SimpleAttribute": "listedValue",
        "ComplexAttribute": "subAttribute",
        "FeatureType": "distinction",
        "InformationType": "distinction"
    }

    def __init__(self, parent_id, data, class_map=None):
        self.parent_id = parent_id
        self.data = data
        self.class_map = class_map or {
            "ListedValue": ListedValue,
            "AttributeUsage": AttributeUsage,
            "Distinction": Distinction,
        }

    def get_listed_value(self):
        self.data["listedValue"] = []
        items = self.class_map["ListedValue"].get_listed_value(self.parent_id)
        for item in items:
            self.data["listedValue"].append(item["child_id"])
        return self.data

    def get_attribute_id(self):
        self.data["attributeId"] = []
        parent_id = self.class_map["ListedValue"].get_parent_id(self.parent_id)
        self.data["attributeId"].append(parent_id)
        return self.data

    def get_sub_attribute_id(self):
        self.data["subAttribute"] = []
        sub_attribute = self.class_map["AttributeUsage"].get_sub_attributes(self.parent_id)
        for item in sub_attribute:
            self.data["subAttribute"].append(item["child_id"])
        return self.data

    def get_distincted_item(self):
        self.data["distinction"] = []
        items = self.class_map["Distinction"].get_distincted_item(self.parent_id)
        for item in items:
            self.data["distinction"].append(item["child_id"])
        return self.data

    def get_related_data_by_type(self, key):
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

def query_ddr_item_one(request, collection, class_map):
    item_type = request.GET.get('item_type')
    item_iv = request.GET.get('item_iv')
    I_id = decrypt(request.GET.get('item_id'), item_iv)

    if request.method == 'GET':
        try:
            c_item = collection.find_one({"_id": ObjectId(I_id)})
            if c_item is None:
                return {"error": "Item not found", "status": 404}

            parent_id = str(c_item["_id"])
            c_item["_id"] = get_encrypted_id([c_item["_id"]])
            serializer = itemTypeSet[item_type](c_item)
            data = dict(serializer.data)

            related_values = GetRelatedValues(parent_id, data, class_map=class_map)

            data = related_values.get_related_data_by_type(item_type)
            encryption_key = related_values.get_encryption_key(item_type)
            print(data[encryption_key], "!!!!!!!!!!!")
            data[encryption_key] = one_encrypt_process(data[encryption_key], collection)
            return {"data": data, "status": 200}

        except Exception as e:
            return {"error": str(e), "status": 500}

    return {"error": "Invalid request method", "status": 400}



@api_view(['GET'])
def ddr_item_one(request):

    class_map = {
        "ListedValue": ListedValue,
        "AttributeUsage": AttributeUsage,
        "Distinction": Distinction,
    }

    result = query_ddr_item_one(request, S100_Concept_Item, class_map)

    if "error" in result:
        return Response({"error": result["error"]}, status=result["status"])
    return Response(result["data"], status=result["status"])

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
        
         



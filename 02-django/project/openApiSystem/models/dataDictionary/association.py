from bson.objectid import ObjectId
from openApiSystem.models.dbs import (
    S100_CD_AttributeConstraints,
    S100_CD_AttributeUsage,
    S100_DD_associatedAttribute,
    S100_DD_distinction,
)
class Association:
    pass


class CD_AttributeConstraints(Association):
    collection = S100_CD_AttributeConstraints

class CD_AttributeUsage(Association):
    collection = S100_CD_AttributeUsage

class DD_associatedAttribute(Association):
    collection = S100_DD_associatedAttribute

class DD_distinction(Association):
    collection = S100_DD_distinction
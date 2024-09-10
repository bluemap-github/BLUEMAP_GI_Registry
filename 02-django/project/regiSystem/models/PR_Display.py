from mongo_driver import db
from bson.objectid import ObjectId
from regiSystem.info_sec.encryption import (get_encrypted_id, decrypt)
from regiSystem.models.PR_Visual import RegisterItemModel

from regiSystem.serializers.PR import S100_PR_DisplayPlaneSerializer
class DisplayPlaneModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_ViewingGroupSerializer
class ViewingGroupModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_FontSerializer   
class FontModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_ContextParameterSerializer
class ContextParameterModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_DrawingPrioritySerializer
class DrawingPriorityModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass

from regiSystem.serializers.PR import S100_PR_AlertHighlightSerializer
class AlertHighlightModel:
    @classmethod
    def insert():
        pass
    @classmethod
    def get_list():
        pass
    @classmethod
    def get_one():
        pass
# userSystem/models.py

from mongo_driver import db
from django.contrib.auth.hashers import make_password, check_password
from regiSystem.models.Concept import S100_Concept_Register

User = db['User']
Participation = db['Participation']

class UserModel:
    @staticmethod
    def create_user(email, password, name):
        hashed_password = make_password(password)
        user = {
            "email": email,
            "password": hashed_password,
            "name": name
        }
        User.insert_one(user)
    
    @staticmethod
    def get_user(email):
        return User.find_one({"email": email})
    
    @staticmethod
    def check_password(email, password):
        user = UserModel.get_user(email)
        if user and check_password(password, user["password"]):
            return True
        return False
    
    @staticmethod
    def get_user_id_by_email(email):
        user = UserModel.get_user(email)
        if user:
            return user.get('_id')  # 또는 user 객체에서 ID를 가져오는 방식에 맞게 수정
        return None

class ParticipationModel:
    @staticmethod
    def create_participation(user_id, registry_id, role, serial_key):
        participation = {
            "user_id": user_id,
            "registry_id": registry_id,
            "role": role,
            "serial_key": serial_key
        }
        Participation.insert_one(participation)
    
    @staticmethod
    def get_participations(user_id, role):
        participations = Participation.find({"user_id": user_id, "role": role})
        result = []
        for participation in participations:
            registry = S100_Concept_Register.find_one({"_id": participation["registry_id"]})
            result.append(registry)
        return result

    @staticmethod
    def get_participation(user_id, registry_id):
        return Participation.find_one({"user_id": user_id, "registry_id": registry_id})

    @staticmethod
    def delete_participation(user_id, registry_id):
        Participation.delete_one({"user_id": user_id, "registry_id": registry_id})
    
    @staticmethod
    def update_role(user_id, registry_id, role):
        Participation.update_one({"user_id": user_id, "registry_id": registry_id}, {"$set": {"role": role}})

    @staticmethod
    def get_role(user_id, registry_id):
        participation = Participation.find_one({"user_id": user_id, "registry_id": registry_id})
        if participation:
            return participation["role"]
        return None
    
    @classmethod
    def get_participation_by_regi_id(cls, regi_id):
        return Participation.find_one({"registry_id": regi_id})
    
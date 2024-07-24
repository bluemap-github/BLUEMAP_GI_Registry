# userSystem/models.py

from mongo_driver import db
from django.contrib.auth.hashers import make_password, check_password

User = db['User']

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

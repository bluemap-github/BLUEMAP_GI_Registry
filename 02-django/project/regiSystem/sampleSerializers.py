from rest_framework import serializers
from bson import ObjectId

# Serializer field for Django REST Framework to handle MongoDB ObjectId.
class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except:
            raise serializers.ValidationError("Invalid ObjectId")



# Student
class StudentSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    classroom_id = serializers.CharField()  # ObjectId의 문자열 표현
    code = serializers.CharField(max_length=100)
    grade = serializers.CharField(max_length=50)
    name = serializers.CharField(max_length=100)

# Classroom
class ClassroomSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    room = serializers.CharField(max_length=100)
    students = StudentSerializer(many=True, read_only=True)
from rest_framework import serializers
from regiSystem.serializers.RE import (
    ObjectIdField
)

class ParticipationSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    user_id = ObjectIdField(read_only=True)
    registry_id = ObjectIdField(read_only=True)
    role = serializers.CharField()
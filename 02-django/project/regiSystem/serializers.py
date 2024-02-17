from rest_framework import serializers
from .models import (
    S100_RE_Register,
    S100_RE_RegisterItem,
    S100_RE_ManagementInfo,
    S100_RE_Reference,
    S100_RE_ReferenceSource
)
# Registery
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_Register
        fields = '__all__'

# Register Item
class RegisterItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_RegisterItem
        exclude = (
            's100_RE_Register',
        )


# Managemant Info 
class ManagementInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_ManagementInfo
        exclude = (
            's100_RE_RegisterItem',
        )

# Reference Source 
class ReferenceSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_ReferenceSource
        exclude = (
            's100_RE_RegisterItem',
        )

# Reference 
class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = S100_RE_Reference
        exclude = (
            's100_RE_RegisterItem',
        )






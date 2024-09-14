from rest_framework import serializers


class AttributeConstraintsSerializer(serializers.Serializer):
    stringLength = serializers.CharField(allow_blank=True)
    textPattern = serializers.CharField(allow_blank=True)
    ACRange = serializers.CharField(allow_blank=True)
    precision = serializers.CharField(allow_blank=True)

class MultiplicitySerializer(serializers.Serializer):
    lower = serializers.IntegerField()
    upper = serializers.IntegerField()

class AttributeUsageSerializer(MultiplicitySerializer):
    sequential = serializers.BooleanField()

from rest_framework import serializers
from regiSystem.serializers.RE import (
    ConceptItemSerializer,
    ObjectIdField
)
## 작업완료
class S100_PR_NationalLanguageStringSerializer(serializers.Serializer):
    text = serializers.CharField(allow_blank=True, allow_null=True)
    language = serializers.CharField(allow_blank=True, allow_null=True)

class S100_PR_RegisterItemSerializer(ConceptItemSerializer):
    xmlID = serializers.CharField()
    # description을 ListField로 변경하여 여러 NationalLanguageString을 받을 수 있도록 수정
    description = serializers.ListField(
        child=S100_PR_NationalLanguageStringSerializer()
    )

class S100_PR_VisualItemSerializer(S100_PR_RegisterItemSerializer):
    itemDetail = serializers.CharField(allow_blank=True, allow_null=True)
    previewImage = serializers.CharField(allow_blank=True, allow_null=True)
    engineeringImage = serializers.CharField(allow_blank=True, allow_null=True)
    previewType = serializers.CharField(allow_blank=True, allow_null=True)  # Image Type
    engineeringImageType = serializers.CharField(allow_blank=True, allow_null=True)  # Image Type


class S100_PR_ItemSchemaSerializer(S100_PR_RegisterItemSerializer):
    xmlSchema = serializers.CharField()

class S100_PR_ColourTokenSerializer(S100_PR_RegisterItemSerializer):
    token = serializers.CharField()

class S100_PR_CIEValueSerializer(serializers.Serializer):
    x = serializers.CharField(allow_blank=True, allow_null=True)
    y = serializers.CharField(allow_blank=True, allow_null=True)
    L = serializers.CharField(allow_blank=True, allow_null=True)

class S100_PR_SRGBValueSerializer(serializers.Serializer):
    red = serializers.CharField(allow_blank=True, allow_null=True)
    green = serializers.CharField(allow_blank=True, allow_null=True)
    blue = serializers.CharField(allow_blank=True, allow_null=True)

class S100_PR_ColourValueSerializer(serializers.Serializer):
    sRGB = S100_PR_SRGBValueSerializer(allow_null=True, required=False)  # 0~1개
    cie = S100_PR_CIEValueSerializer(allow_null=True, required=False)  # 0~1개

class S100_PR_PaletteItemSerializer(S100_PR_RegisterItemSerializer):
    transparency = serializers.CharField(allow_blank=True, allow_null=True)
    colourValue = S100_PR_ColourValueSerializer(allow_null=True, required=False)

class S100_PR_ColourPalletteSerializer(S100_PR_RegisterItemSerializer):
    pass



class S100_PR_DisplayPlaneSerializer(S100_PR_RegisterItemSerializer):
    order = serializers.CharField()

class S100_PR_DisplayModeSerializer(S100_PR_RegisterItemSerializer):
    pass

class S100_PR_ViewingGroupLayerSerializer(S100_PR_RegisterItemSerializer):
    pass

class S100_PR_ViewingGroupSerializer(S100_PR_RegisterItemSerializer):
    foundationMode = serializers.CharField(allow_blank=True, allow_null=True)

class S100_PR_FontSerializer(S100_PR_RegisterItemSerializer):
    fontFile = serializers.CharField()
    fontType = serializers.CharField()

class S100_PR_ContextParameterSerializer(S100_PR_RegisterItemSerializer):
    parameterType = serializers.CharField()
    defaultValue = serializers.CharField(allow_blank=True, allow_null=True)

class S100_PR_DrawingPrioritySerializer(S100_PR_RegisterItemSerializer):
    priority = serializers.CharField()

class S100_PR_AlertHighlightSerializer(S100_PR_RegisterItemSerializer):
    optional = serializers.CharField(allow_blank=True, allow_null=True)
    style = serializers.CharField(allow_blank=True, allow_null=True)



## 상속안받음
class S100_PR_AlertPrioritySerializer(serializers.Serializer):
    priority = serializers.CharField()
    default = serializers.CharField()
    optional = serializers.CharField(allow_blank=True, allow_null=True)

class S100_PR_AlertInfoSerializer(serializers.Serializer):
    priority = serializers.CharField()




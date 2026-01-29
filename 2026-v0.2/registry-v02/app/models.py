# app/models.py
from __future__ import annotations

from datetime import datetime, date
from typing import Optional, List, Literal, Union, Dict, Any

from pydantic import BaseModel, Field


class TimeMeta(BaseModel):
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


# ---------- 1) Registers ----------
class RE_Locale(BaseModel):
    language: str = Field(..., description="ISO 639 language code")
    country: Optional[str] = Field(None, description="ISO 3166 country code")
    characterEncoding: Optional[str] = Field(None, description="Character encoding")


class CI_OnlineResource(BaseModel):
    linkage: str = Field(..., description="URI/URL")
    protocol: Optional[str] = None
    name: Optional[str] = None


class RegisterCreate(BaseModel):
    name: str
    operatingLanguage: Optional[RE_Locale] = None
    contentSummary: Optional[str] = None
    uniformResourceIdentifier: Optional[CI_OnlineResource] = None
    dateOfLastChange: Optional[datetime] = None


class RegisterOut(TimeMeta):
    id: str = Field(alias="_id")
    name: str
    operatingLanguage: Optional[RE_Locale] = None
    contentSummary: Optional[str] = None
    uniformResourceIdentifier: Optional[CI_OnlineResource] = None
    dateOfLastChange: Optional[datetime] = None


# ---------- 5) Management Info ----------
# ✅ HTML <input type="date"> 호환
DateLike = Union[datetime, date]


class ManagementInfoCreate(BaseModel):
    proposalType: Optional[str] = None
    submittingOrganisation: Optional[str] = None
    proposedChange: Optional[str] = None
    dateProposed: Optional[DateLike] = None
    dateAccepted: Optional[DateLike] = None
    dateAmended: Optional[DateLike] = None
    proposalStatus: Optional[str] = None
    controlBodyNotes: List[str] = Field(default_factory=list)


class ManagementInfoOut(TimeMeta):
    id: str = Field(alias="_id")
    proposalType: Optional[str] = None
    submittingOrganisation: Optional[str] = None
    proposedChange: Optional[str] = None
    dateProposed: Optional[datetime] = None
    dateAccepted: Optional[datetime] = None
    dateAmended: Optional[datetime] = None
    proposalStatus: Optional[str] = None
    controlBodyNotes: List[str] = Field(default_factory=list)


# ---------- 2) Data Dictionary Items (RegisterItem + Concept + Typed) ----------
S100ItemKind = Literal[
    "S100_Concept",
    "S100_CD_Feature",
    "S100_CD_Information",
    "S100_CD_EnumeratedValue",
    "S100_CD_SimpleAttribute",
    "S100_CD_ComplexAttribute",
]

FeatureUseType = Literal["geographic", "meta", "cartographic", "theme"]
AttributeValueType = Literal[
    "boolean",
    "enumeration",
    "integer",
    "real",
    "date",
    "text",
    "time",
    "dateTime",
    "URI",
    "URL",
    "URN",
    "S100_CodeList",
    "S100_TruncatedDate",
]
QuantitySpecification = Literal[
    "angularVelocity",
    "area",
    "density",
    "duration",
    "frequency",
    "length",
    "mass",
    "planeAngle",
    "power",
    "pressure",
    "salinity",
    "speed",
    "temperature",
    "volume",
    "weight",
    "otherQuantity",
]

ObjectIdStr = str  # Mongo ObjectId in API: 24-hex string


class S100_Multiplicity(BaseModel):
    lower: str = "0"
    upper: Optional[str] = None
    infinite: Optional[str] = None  # "true"/"false"


class S100_CD_AttributeUsage(BaseModel):
    attributeId: ObjectIdStr  # ✅ _id reference to SimpleAttribute or ComplexAttribute
    multiplicity: S100_Multiplicity = Field(default_factory=S100_Multiplicity)
    sequential: Optional[str] = "false"  # "true"/"false"


class S100_CD_AttributeConstraints(BaseModel):
    stringLength: Optional[str] = None
    textPattern: Optional[str] = None
    range: Optional[str] = None
    precision: Optional[str] = None


class ConceptCreateInput(BaseModel):
    # itemIdentifier는 시스템이 순차 자동할당 (입력 금지)
    name: str
    definition: Optional[str] = None
    remarks: Optional[str] = None
    itemStatus: str
    alias: List[str] = Field(default_factory=list)
    camelCase: Optional[str] = None
    definitionSource: Optional[str] = None
    reference: Optional[str] = None
    similarityToSource: Optional[str] = None
    justification: Optional[str] = None
    proposedChange: Optional[str] = None


class ConceptStored(ConceptCreateInput):
    # MongoDB에는 string 저장 원칙
    itemIdentifier: str


class RegisterItemCreate(BaseModel):
    registerId: str
    kind: S100ItemKind = "S100_Concept"
    concept: ConceptCreateInput

    # ------------------------
    # type-specific fields
    # ------------------------
    # Feature
    featureUseType: Optional[FeatureUseType] = None
    distinctionIds: List[ObjectIdStr] = Field(default_factory=list)  # ✅ 0..* (Feature/Information 공통)

    # EnumeratedValue
    numericCode: Optional[str] = None
    parentSimpleAttributeId: Optional[ObjectIdStr] = None  # ✅ EnumeratedValue는 반드시 필요 (API에서 강제 추천)

    # SimpleAttribute
    valueType: Optional[AttributeValueType] = None
    quantitySpecification: Optional[QuantitySpecification] = None
    attributeConstraints: Optional[S100_CD_AttributeConstraints] = None  # ✅ 0..1

    # ComplexAttribute
    subAttributes: Optional[List[S100_CD_AttributeUsage]] = None  # ✅ 1..* (API에서 강제)

    # ------------------------
    # management / references
    # ------------------------
    managementInfos: List[ManagementInfoCreate] = Field(min_length=1)
    managementInfoIds: Optional[List[ObjectIdStr]] = None

    referenceIds: List[ObjectIdStr] = Field(default_factory=list)        # ✅ _id references
    referenceSourceId: Optional[ObjectIdStr] = None                      # ✅ _id reference


class RegisterItemPatch(BaseModel):
    concept: Optional[Dict[str, Any]] = None

    # Feature/Information
    featureUseType: Optional[FeatureUseType] = None
    distinctionIds: Optional[List[ObjectIdStr]] = None

    # EnumeratedValue
    numericCode: Optional[str] = None
    parentSimpleAttributeId: Optional[ObjectIdStr] = None

    # SimpleAttribute
    valueType: Optional[AttributeValueType] = None
    quantitySpecification: Optional[QuantitySpecification] = None
    attributeConstraints: Optional[S100_CD_AttributeConstraints] = None

    # ComplexAttribute
    subAttributes: Optional[List[S100_CD_AttributeUsage]] = None

    # relations
    referenceIds: Optional[List[ObjectIdStr]] = None
    referenceSourceId: Optional[ObjectIdStr] = None

    # append-only management info
    managementInfo: ManagementInfoCreate



class ConvertFromConceptPayload(BaseModel):
    kind: Literal[
        "S100_CD_Feature",
        "S100_CD_Information",
        "S100_CD_EnumeratedValue",
        "S100_CD_SimpleAttribute",
        "S100_CD_ComplexAttribute",
    ]

    # Feature/Information
    featureUseType: Optional[FeatureUseType] = None
    distinctionIds: Optional[List[ObjectIdStr]] = None

    # EnumeratedValue
    numericCode: Optional[str] = None
    parentSimpleAttributeId: Optional[ObjectIdStr] = None

    # SimpleAttribute
    valueType: Optional[AttributeValueType] = None
    quantitySpecification: Optional[QuantitySpecification] = None
    attributeConstraints: Optional[S100_CD_AttributeConstraints] = None

    # ComplexAttribute
    subAttributes: Optional[List[S100_CD_AttributeUsage]] = None

    managementInfo: ManagementInfoCreate


# ---------- 2b) Portrayal Register (PR) Items ----------
# PR은 Concept과 무관하며, S100_RE_RegisterItem을 직접 상속받는다고 가정.

PRKind = Literal[
    "S100_PR_Symbol",
    "S100_PR_LineStyle",
    "S100_PR_AreaFill",
    "S100_PR_Pixmap",
    "S100_PR_ItemSchema",
    "S100_PR_DisplayMode",
    "S100_PR_ViewingGroupLayer",
    "S100_PR_ViewingGroup",
    "S100_PR_AlertHighlight",
    "S100_PR_AlertMessage",
    "S100_PR_ColourToken",
    "S100_PR_ColourPalette",
    "S100_PR_Alert",
    "S100_PR_PaletteItem",
    "S100_PR_Font",
    "S100_PR_ContextParameter",
    "S100_PR_DrawingPriority",
    "S100_PR_DisplayPlane",
]


PRParameterType = Literal["boolean", "integer", "double", "string", "date"]
PRImageType = Literal["jpg", "png", "tif"]
PRAlertPriorityType = Literal["alarm", "warning", "caution", "indication"]
PRHighlightStyle = Literal["AlarmHighlight", "CautionHighlight"]


class PR_NationalLanguageString(BaseModel):
    text: str
    language: str


class PRItemCreateInput(BaseModel):
    # itemIdentifier는 시스템이 registerId 단위로 순차 자동할당 (입력 금지)
    name: str
    definition: Optional[str] = None
    remarks: Optional[str] = None
    itemStatus: Optional[str] = None
    alias: List[str] = Field(default_factory=list)
    camelCase: Optional[str] = None
    definitionSource: Optional[str] = None
    reference: Optional[str] = None
    similarityToSource: Optional[str] = None
    justification: Optional[str] = None
    proposedChange: Optional[str] = None


class PRItemStored(PRItemCreateInput):
    itemIdentifier: str  # MongoDB에는 string 저장 원칙


class PRRegisterItemCreate(BaseModel):
    registerId: str
    kind: PRKind
    prItem: PRItemCreateInput

    xmlID: Optional[str] = None
    description: List[PR_NationalLanguageString] = Field(default_factory=list)

    # 공통 연결(일부 kind에서만 의미 있음)
    itemSchema: Optional[ObjectIdStr] = None
    colourToken: List[ObjectIdStr] = Field(default_factory=list)

    # kind별 세부 내용: 그대로 저장 (예: S100_PR_Symbol, S100_PR_ItemSchema 등)
    kindBody: Optional[Dict[str, Any]] = None

    # management / references
    managementInfos: List[ManagementInfoCreate] = Field(min_length=1)
    referenceIds: List[ObjectIdStr] = Field(default_factory=list)


class PRRegisterItemPatch(BaseModel):
    prItem: Optional[Dict[str, Any]] = None
    xmlID: Optional[str] = None
    description: Optional[List[PR_NationalLanguageString]] = None

    itemSchema: Optional[ObjectIdStr] = None
    colourToken: Optional[List[ObjectIdStr]] = None
    kindBody: Optional[Dict[str, Any]] = None
    referenceIds: Optional[List[ObjectIdStr]] = None

    # append-only management info
    managementInfo: ManagementInfoCreate

# ---------- 3) Reference Sources ----------
# (현재 UI/API 호환을 위해 MVP 구조 유지)
class ReferenceSourceCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ReferenceSourceOut(TimeMeta):
    id: str = Field(alias="_id")
    name: str
    description: Optional[str] = None


# ---------- 4) References ----------
class ReferenceCreate(BaseModel):
    title: str
    locator: Optional[str] = None


class ReferenceOut(TimeMeta):
    id: str = Field(alias="_id")
    title: str
    locator: Optional[str] = None

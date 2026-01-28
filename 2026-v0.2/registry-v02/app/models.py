# app/models.py
from __future__ import annotations

from datetime import datetime
from typing import Optional, List, Literal

from pydantic import BaseModel, Field


# ---------- 공통 ----------
class PyObjectId(str):
    """MVP에서는 ObjectId를 그냥 str로 주고받고,
    CRUD에서 bson.ObjectId로 변환하는 방식 추천."""
    pass


class TimeMeta(BaseModel):
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


# ---------- 1) Registers ----------
class RE_Locale(BaseModel):
    language: str = Field(..., description="ISO 639 language code, e.g., 'en'")
    country: Optional[str] = Field(None, description="ISO 3166 country code, e.g., 'GB'")
    characterEncoding: Optional[str] = Field(None, description="e.g., 'utf-8'")


class CI_OnlineResource(BaseModel):
    linkage: str = Field(..., description="URI/URL")
    protocol: Optional[str] = None
    name: Optional[str] = None


class RegisterCreate(BaseModel):
    # S100_RE_Register (MVP)
    name: str
    operatingLanguage: Optional[RE_Locale] = None
    contentSummary: Optional[str] = None
    uniformResourceIdentifier: Optional[CI_OnlineResource] = None
    dateOfLastChange: Optional[datetime.date] = None  # 서버에서 기본값(today) 설정


class RegisterOut(TimeMeta):
    id: PyObjectId = Field(..., alias="_id")
    name: str
    operatingLanguage: Optional[RE_Locale] = None
    contentSummary: Optional[str] = None
    uniformResourceIdentifier: Optional[CI_OnlineResource] = None
    dateOfLastChange: Optional[datetime.date] = None


# ---------- 2) Register Items (베이스) ----------
class RegisterItemCreate(BaseModel):
    registerId: PyObjectId
    kind: Literal["concept", "attribute", "feature", "information", "enumeratedValue", "other"] = "other"

    itemIdentifier: int
    name: str

    definition: Optional[str] = None
    remarks: Optional[str] = None

    itemStatus: str  # 나중에 enum 고정 추천
    alias: List[str] = Field(default_factory=list)
    camelCase: Optional[str] = None

    definitionSource: Optional[str] = None
    reference: Optional[str] = None
    similarityToSource: Optional[str] = None
    justification: Optional[str] = None
    proposedChange: Optional[str] = None

    # 관계(선택)
    managementInfoIds: List[PyObjectId] = Field(default_factory=list)
    referenceIds: List[PyObjectId] = Field(default_factory=list)
    referenceSourceId: Optional[PyObjectId] = None


class RegisterItemUpdate(BaseModel):
    # PATCH 용: 모두 optional
    name: Optional[str] = None
    definition: Optional[str] = None
    remarks: Optional[str] = None
    itemStatus: Optional[str] = None
    alias: Optional[List[str]] = None
    camelCase: Optional[str] = None
    definitionSource: Optional[str] = None
    reference: Optional[str] = None
    similarityToSource: Optional[str] = None
    justification: Optional[str] = None
    proposedChange: Optional[str] = None

    managementInfoIds: Optional[List[PyObjectId]] = None
    referenceIds: Optional[List[PyObjectId]] = None
    referenceSourceId: Optional[PyObjectId] = None


class RegisterItemOut(TimeMeta):
    id: PyObjectId = Field(..., alias="_id")
    registerId: PyObjectId
    kind: str
    itemIdentifier: int
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

    managementInfoIds: List[PyObjectId] = Field(default_factory=list)
    referenceIds: List[PyObjectId] = Field(default_factory=list)
    referenceSourceId: Optional[PyObjectId] = None


# ---------- 3) Reference Sources ----------
class ReferenceSourceCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ReferenceSourceOut(TimeMeta):
    id: PyObjectId = Field(..., alias="_id")
    name: str
    description: Optional[str] = None


# ---------- 4) References ----------
class ReferenceCreate(BaseModel):
    title: str
    locator: Optional[str] = None
    referenceSourceId: Optional[PyObjectId] = None

class ReferenceOut(TimeMeta):
    id: PyObjectId = Field(..., alias="_id")
    title: str
    locator: Optional[str] = None
    referenceSourceId: Optional[PyObjectId] = None


# ---------- 5) Management Info ----------
class ManagementInfoCreate(BaseModel):
    registerItemId: PyObjectId
    note: Optional[str] = None

class ManagementInfoOut(TimeMeta):
    id: PyObjectId = Field(..., alias="_id")
    registerItemId: PyObjectId
    note: Optional[str] = None

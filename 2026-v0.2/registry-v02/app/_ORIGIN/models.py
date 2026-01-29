# app/models.py
from __future__ import annotations

from datetime import datetime, date
from typing import Optional, List, Literal, Union

from pydantic import BaseModel, Field


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
# ✅ date input을 HTML <input type="date">로 받을 수 있게 date|datetime 모두 허용
DateLike = Union[datetime, date]


class ManagementInfoCreate(BaseModel):
    proposalType: Optional[str] = None
    submittingOrganisation: Optional[str] = None
    proposedChange: Optional[str] = None
    dateProposed: Optional[DateLike] = None
    dateAccepted: Optional[DateLike] = None
    proposalStatus: Optional[str] = None
    controlBodyNotes: List[str] = Field(default_factory=list)


class ManagementInfoOut(TimeMeta):
    id: str = Field(alias="_id")
    proposalType: Optional[str] = None
    submittingOrganisation: Optional[str] = None
    proposedChange: Optional[str] = None
    dateProposed: Optional[datetime] = None
    dateAccepted: Optional[datetime] = None
    proposalStatus: Optional[str] = None
    controlBodyNotes: List[str] = Field(default_factory=list)


# ---------- 2) Register Items ----------
class RegisterItemCreate(BaseModel):
    registerId: str
    kind: Literal["concept", "attribute", "feature", "information", "enumeratedValue", "other"] = "other"
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

    # ✅ 1..* 규칙을 “입력 방식”으로 강제: ids 대신 infos를 최소 1개 받게
    managementInfos: List[ManagementInfoCreate] = Field(min_length=1)

    # (서버가 채울 예정이므로 optional)
    managementInfoIds: Optional[List[str]] = None

    referenceIds: List[str] = Field(default_factory=list)
    referenceSourceId: Optional[str] = None


# ✅ PATCH(Update) 정책:
# - Item 내용은 부분 수정 가능
# - ManagementInfo는 "수정"이 아니라 항상 "새로 생성"해서 누적(append)해야 함
class RegisterItemPatch(BaseModel):
    # item fields (partial)
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

    # relations (optional)
    referenceIds: Optional[List[str]] = None
    referenceSourceId: Optional[str] = None

    # ✅ 반드시 새 mgmt 레코드를 1개 포함 (append)
    managementInfo: ManagementInfoCreate


class RegisterItemOut(TimeMeta):
    id: str = Field(alias="_id")
    registerId: str
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

    managementInfoIds: List[str] = Field(default_factory=list)
    referenceIds: List[str] = Field(default_factory=list)
    referenceSourceId: Optional[str] = None


# ---------- 3) Reference Sources ----------
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
    # ✅ 규칙상 Reference는 RegisterItem을 모르고, ReferenceSource도 굳이 몰라도 됨 (단순 독립 문서)


class ReferenceOut(TimeMeta):
    id: str = Field(alias="_id")
    title: str
    locator: Optional[str] = None

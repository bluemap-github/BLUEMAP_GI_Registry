# app/api.py
from __future__ import annotations

from datetime import datetime, timezone, date, time
from typing import Any, Dict, Optional, List

from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from pymongo import ReturnDocument

from .db import (
    COLL_MGMT_INFO,
    COLL_COUNTERS,
    get_db,
    COLL_REGISTERS,
    COLL_ITEMS,
    COLL_PR_ITEMS,
    COLL_REF_SOURCES,
    COLL_REFERENCES,
)
from .models import (
    RegisterCreate,
    RegisterItemCreate,
    RegisterItemPatch,
    ConvertFromConceptPayload,
    ReferenceCreate,
    ReferenceSourceCreate,
    PRRegisterItemCreate,
    PRRegisterItemPatch,
)

UTC = timezone.utc
router = APIRouter()


@router.get("/ping")
async def ping():
    return {"ok": True}


@router.post("/echo")
async def echo(payload: dict):
    return {"echo": payload}


# -------------------------
# Helpers
# -------------------------
def _now() -> datetime:
    return datetime.now(UTC).replace(microsecond=0)


def _oid(s: str) -> ObjectId:
    try:
        return ObjectId(s)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid ObjectId: {s}")


def _as_utc_dt(v):
    """date/datetime/str(YYYY-MM-DD) -> datetime(UTC)."""
    if v is None:
        return None
    if isinstance(v, datetime):
        if v.tzinfo is None:
            return v.replace(tzinfo=UTC)
        return v.astimezone(UTC)
    if isinstance(v, date):
        return datetime.combine(v, time.min, tzinfo=UTC)
    if isinstance(v, str) and v.strip():
        # HTML date input: 'YYYY-MM-DD'
        try:
            d = date.fromisoformat(v.strip())
            return datetime.combine(d, time.min, tzinfo=UTC)
        except Exception:
            return v
    return v


async def _next_item_identifier(db, register_oid: ObjectId) -> str:
    """registerId 단위로 itemIdentifier를 순차 증가시키고, string으로 반환."""
    now = _now()
    key = {"registerId": register_oid, "name": "itemIdentifier"}
    doc = await db[COLL_COUNTERS].find_one_and_update(
        key,
        {"$inc": {"seq": 1}, "$setOnInsert": {"createdAt": now}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    seq = doc.get("seq") if isinstance(doc, dict) else None
    if not seq:
        # fallback (매우 드문 케이스)
        doc2 = await db[COLL_COUNTERS].find_one(key)
        seq = (doc2 or {}).get("seq") or 1
    return str(seq)


def _stringify_oid_any(x):
    if isinstance(x, ObjectId):
        return str(x)
    if isinstance(x, list):
        return [_stringify_oid_any(v) for v in x]
    if isinstance(x, dict):
        return {k: _stringify_oid_any(v) for k, v in x.items()}
    return x


def _dump_doc(doc: dict) -> dict:
    """Convert Mongo doc to JSON-safe dict (ObjectId -> str, recursive)."""
    if not doc:
        return doc
    return _stringify_oid_any(dict(doc))


def _sort_field(sort_by: str, allowed: set[str], default: str) -> str:
    if not sort_by:
        return default
    return sort_by if sort_by in allowed else default


# -------------------------
# Registers
# -------------------------
@router.get("/registers")
async def list_registers(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    q: Optional[str] = None,
    sortBy: str = "name",
    sortOrder: str = "asc",
):
    db = get_db()
    flt: Dict[str, Any] = {}
    if q:
        flt["name"] = {"$regex": q, "$options": "i"}

    allowed = {"name", "dateOfLastChange", "updatedAt", "createdAt"}
    sort_by = _sort_field(sortBy, allowed, "name")
    sort_dir = 1 if sortOrder.lower() == "asc" else -1

    total = await db[COLL_REGISTERS].count_documents(flt)
    cursor = (
        db[COLL_REGISTERS]
        .find(flt)
        .sort(sort_by, sort_dir)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = [_dump_doc(x) async for x in cursor]
    return {"items": items, "total": total}


@router.post("/registers", status_code=201)
async def create_register(payload: RegisterCreate):
    db = get_db()
    now = _now()

    doc = payload.model_dump(by_alias=True)
    if not doc.get("dateOfLastChange"):
        doc["dateOfLastChange"] = date.today()

    dolc = doc.get("dateOfLastChange")
    if isinstance(dolc, date) and not isinstance(dolc, datetime):
        doc["dateOfLastChange"] = datetime.combine(dolc, time.min, tzinfo=timezone.utc)

    doc["createdAt"] = now
    doc["updatedAt"] = now

    try:
        res = await db[COLL_REGISTERS].insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    created = await db[COLL_REGISTERS].find_one({"_id": res.inserted_id})
    return _dump_doc(created)


@router.get("/registers/{register_id}")
async def get_register(register_id: str):
    db = get_db()
    doc = await db[COLL_REGISTERS].find_one({"_id": _oid(register_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Register not found")
    return _dump_doc(doc)


# -------------------------
# DD Items (S-100 Part 2a 스타일: kind + concept + (typed body))
# -------------------------

_KIND_ALIASES: Dict[str, str] = {
    "concept": "S100_Concept",
    "s100_concept": "S100_Concept",
    "feature": "S100_CD_Feature",
    "information": "S100_CD_Information",
    "enumeratedvalue": "S100_CD_EnumeratedValue",
    "enumeratedValue": "S100_CD_EnumeratedValue",
    "simpleattribute": "S100_CD_SimpleAttribute",
    "simpleAttribute": "S100_CD_SimpleAttribute",
    "complexattribute": "S100_CD_ComplexAttribute",
    "complexAttribute": "S100_CD_ComplexAttribute",
}


def _normalize_kind(v: Optional[str]) -> Optional[str]:
    if not v:
        return None
    vv = v.strip()
    if not vv:
        return None
    return _KIND_ALIASES.get(vv, _KIND_ALIASES.get(vv.lower(), vv))


# -------------------------
# PR kind normalize (MVP)
# -------------------------
_PR_KIND_ALIASES: Dict[str, str] = {
    "symbol": "S100_PR_Symbol",
    "linestyle": "S100_PR_LineStyle",
    "areafill": "S100_PR_AreaFill",
    "pixmap": "S100_PR_Pixmap",
    "itemschema": "S100_PR_ItemSchema",
    "displaymode": "S100_PR_DisplayMode",
    "viewinggrouplayer": "S100_PR_ViewingGroupLayer",
    "viewinggroup": "S100_PR_ViewingGroup",
    "alerthighlight": "S100_PR_AlertHighlight",
    "alertmessage": "S100_PR_AlertMessage",
    "colourtoken": "S100_PR_ColourToken",
    "colorutoken": "S100_PR_ColourToken",
    "colourpalette": "S100_PR_ColourPalette",
    "alert": "S100_PR_Alert",
    "paletteitem": "S100_PR_PaletteItem",
    "font": "S100_PR_Font",
    "contextparameter": "S100_PR_ContextParameter",
    "drawingpriority": "S100_PR_DrawingPriority",
    "displayplane": "S100_PR_DisplayPlane",
}


def _normalize_pr_kind(v: Optional[str]) -> Optional[str]:
    if not v:
        return None
    vv = v.strip()
    if not vv:
        return None
    return _PR_KIND_ALIASES.get(vv, _PR_KIND_ALIASES.get(vv.lower(), vv))


def _build_typed_body(kind: str, payload: dict) -> Dict[str, Any]:
    """kind에 따라 typed body를 구성.

    ⚠️ 모든 참조는 _id(ObjectId) 기반으로 저장한다.
    - Feature/Information: distinctionIds: [ObjectId]
    - EnumeratedValue: parentSimpleAttributeId: ObjectId (필수, 서버 검증)
    - ComplexAttribute: subAttributes[].attributeId: ObjectId
    """
    if kind == "S100_CD_Feature":
        return {
            "featureUseType": payload.get("featureUseType") or "meta",
            "distinctionIds": [_oid(str(x)) for x in (payload.get("distinctionIds") or [])],
        }

    if kind == "S100_CD_Information":
        return {
            "distinctionIds": [_oid(str(x)) for x in (payload.get("distinctionIds") or [])],
        }

    if kind == "S100_CD_EnumeratedValue":
        parent = payload.get("parentSimpleAttributeId")
        return {
            "numericCode": payload.get("numericCode") or "",
            "parentSimpleAttributeId": _oid(str(parent)) if parent else None,
        }

    if kind == "S100_CD_SimpleAttribute":
        return {
            "valueType": payload.get("valueType") or "text",
            "quantitySpecification": payload.get("quantitySpecification"),
            "attributeConstraints": payload.get("attributeConstraints"),
        }

    if kind == "S100_CD_ComplexAttribute":
        subs_in = payload.get("subAttributes") or []
        subs_out: List[dict] = []
        for s in subs_in:
            if not isinstance(s, dict):
                continue
            aid = s.get("attributeId")
            mult = s.get("multiplicity") or {}
            subs_out.append(
                {
                    "attributeId": _oid(str(aid)) if aid else None,
                    "multiplicity": mult,
                    "sequential": s.get("sequential", "false"),
                }
            )
        return {"subAttributes": subs_out}

    # concept에는 body 없음
    return {}


async def _validate_typed_relations(db, kind: str, body: dict, *, partial: bool = False) -> None:
    """kind별 연관관계 규칙 검증.

    partial=True이면, payload에 포함된 필드만 선택적으로 검증한다(패치용).
    """
    # Feature / Information: distinctionIds 0..*
    if kind in {"S100_CD_Feature", "S100_CD_Information"}:
        if (not partial) or ("distinctionIds" in body):
            ids = body.get("distinctionIds") or []
            if ids:
                oids = [_oid(str(x)) for x in ids]
                docs = await db[COLL_ITEMS].find({"_id": {"$in": oids}}).to_list(length=len(oids))
                if len({str(d["_id"]) for d in docs}) != len({str(o) for o in oids}):
                    raise HTTPException(status_code=422, detail="distinctionIds contains missing items")
                wrong = [str(d["_id"]) for d in docs if d.get("kind") != kind]
                if wrong:
                    raise HTTPException(status_code=422, detail=f"distinctionIds must reference same kind ({kind})")

    # EnumeratedValue: 반드시 1개의 SimpleAttribute에 종속
    if kind == "S100_CD_EnumeratedValue":
        if (not partial) or ("parentSimpleAttributeId" in body):
            parent = body.get("parentSimpleAttributeId")
            if not parent:
                raise HTTPException(status_code=422, detail="parentSimpleAttributeId is required for S100_CD_EnumeratedValue")
            parent_doc = await db[COLL_ITEMS].find_one({"_id": _oid(str(parent))})
            if not parent_doc:
                raise HTTPException(status_code=422, detail="parentSimpleAttributeId not found")
            if parent_doc.get("kind") != "S100_CD_SimpleAttribute":
                raise HTTPException(status_code=422, detail="parentSimpleAttributeId must reference S100_CD_SimpleAttribute")
            vt = ((parent_doc.get("S100_CD_SimpleAttribute") or {}).get("valueType")) or ""
            if vt not in {"enumeration", "S100_CodeList"}:
                raise HTTPException(
                    status_code=422,
                    detail="parent SimpleAttribute valueType must be 'enumeration' or 'S100_CodeList'",
                )

    # ComplexAttribute: subAttributes 1..* (SimpleAttribute or ComplexAttribute)
    if kind == "S100_CD_ComplexAttribute":
        if (not partial) or ("subAttributes" in body):
            subs = body.get("subAttributes")
            if not subs or not isinstance(subs, list) or len(subs) < 1:
                raise HTTPException(status_code=422, detail="subAttributes must have at least 1 item for S100_CD_ComplexAttribute")

            attr_oids: List[ObjectId] = []
            for s in subs:
                if not isinstance(s, dict):
                    raise HTTPException(status_code=422, detail="subAttributes items must be objects")
                aid = s.get("attributeId")
                if not aid:
                    raise HTTPException(status_code=422, detail="subAttributes.attributeId is required")
                attr_oids.append(_oid(str(aid)))

                # multiplicity logical check (best-effort)
                mult = s.get("multiplicity") or {}
                lower = mult.get("lower")
                upper = mult.get("upper")
                infinite = mult.get("infinite")
                try:
                    if lower is not None and upper is not None and str(upper).isdigit() and str(lower).isdigit():
                        if int(lower) > int(upper):
                            raise HTTPException(status_code=422, detail="multiplicity.lower must be <= multiplicity.upper")
                except HTTPException:
                    raise
                except Exception:
                    # 느슨하게: 숫자 변환 실패는 여기서 막지 않음
                    pass

                if infinite is not None and str(infinite).lower() == "true":
                    # infinite=true면 upper는 보통 null/미사용 (강제는 API에서 하지 않음)
                    pass

            docs = await db[COLL_ITEMS].find({"_id": {"$in": attr_oids}}).to_list(length=len(attr_oids))
            if len({str(d["_id"]) for d in docs}) != len({str(o) for o in attr_oids}):
                raise HTTPException(status_code=422, detail="subAttributes contains missing attribute items")

            for d in docs:
                if d.get("kind") not in {"S100_CD_SimpleAttribute", "S100_CD_ComplexAttribute"}:
                    raise HTTPException(status_code=422, detail="subAttributes.attributeId must reference SimpleAttribute or ComplexAttribute")

def _normalize_kinds(kind: Optional[str]) -> list[str]:
    if not kind:
        return []
    parts = [k.strip() for k in kind.split(",") if k.strip()]
    out = []
    for p in parts:
        nk = _normalize_kind(p)
        if nk:
            out.append(nk)
    return out


@router.get("/dd/items")
async def list_dd_items(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    q: Optional[str] = None,
    searchBy: str = "name",  # name|itemIdentifier
    kind: Optional[str] = None,
    status: Optional[str] = None,
    registerId: Optional[str] = None,
    sortBy: str = "updatedAt",
    sortOrder: str = "desc",
):
    db = get_db()

    flt: Dict[str, Any] = {}
    if registerId:
        flt["registerId"] = _oid(registerId)

    # 기본: Data Dictionary 목록에서는 Concept-only 제외
    kinds = _normalize_kinds(kind)
    if kinds:
        flt["kind"] = {"$in": kinds} if len(kinds) > 1 else kinds[0]
    else:
        flt["kind"] = {"$ne": "S100_Concept"}

    if status:
        flt["concept.itemStatus"] = status

    if q:
        if searchBy == "itemIdentifier":
            flt["concept.itemIdentifier"] = str(q).strip()
        else:
            flt["concept.name"] = {"$regex": q, "$options": "i"}

    # sortBy 호환
    sort_map = {
        "itemIdentifier": "concept.itemIdentifier",
        "name": "concept.name",
        "itemStatus": "concept.itemStatus",
        "kind": "kind",
        "createdAt": "createdAt",
        "updatedAt": "updatedAt",
    }
    sort_field = sort_map.get(sortBy, sortBy)
    allowed = {"concept.itemIdentifier", "concept.name", "concept.itemStatus", "kind", "createdAt", "updatedAt"}
    sort_by = _sort_field(sort_field, allowed, "updatedAt")
    sort_dir = 1 if sortOrder.lower() == "asc" else -1

    total = await db[COLL_ITEMS].count_documents(flt)
    cursor = (
        db[COLL_ITEMS]
        .find(flt)
        .sort(sort_by, sort_dir)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = [_dump_doc(x) async for x in cursor]
    return {"items": items, "total": total}


@router.post("/dd/items", status_code=201)
async def create_dd_item(payload: RegisterItemCreate):
    """신규 RegisterItem 생성.

    - itemIdentifier는 서버가 registerId 단위로 순차 자동할당
    - doc 형태: {kind, concept{...}, <typed body>, managementInfoIds, referenceIds, referenceSourceId}
    """
    db = get_db()
    now = _now()

    body = payload.model_dump(by_alias=True, exclude_none=True)
    register_oid = _oid(str(body["registerId"]))

    # 1) managementInfos -> managementInfoIds
    mgmt_infos = body.pop("managementInfos", [])
    if not mgmt_infos:
        raise HTTPException(status_code=422, detail="managementInfos must have at least 1 item")

    mgmt_docs: List[dict] = []
    for mi in mgmt_infos:
        mi["createdAt"] = now
        mi["updatedAt"] = now
        mi["dateProposed"] = _as_utc_dt(mi.get("dateProposed"))
        mi["dateAccepted"] = _as_utc_dt(mi.get("dateAccepted"))
        mi["dateAmended"] = _as_utc_dt(mi.get("dateAmended"))
        mgmt_docs.append(mi)

    res_mgmt = await db[COLL_MGMT_INFO].insert_many(mgmt_docs)
    mgmt_ids = res_mgmt.inserted_ids

    # 2) itemIdentifier 자동 할당
    item_identifier = await _next_item_identifier(db, register_oid)

    # 3) concept 구성
    concept_in = body.get("concept") or {}
    concept_doc = dict(concept_in)
    concept_doc["itemIdentifier"] = item_identifier

    # 4) typed body
    kind_val = _normalize_kind(body.get("kind")) or "S100_Concept"

    # ✅ kind별 연관관계/종속 규칙 검증
    await _validate_typed_relations(db, kind_val, body, partial=False)

    typed_body = _build_typed_body(kind_val, body)

    doc: Dict[str, Any] = {
        "registerId": register_oid,
        "kind": kind_val,
        "concept": concept_doc,
        "createdAt": now,
        "updatedAt": now,
        "managementInfoIds": mgmt_ids,
        "referenceIds": [_oid(str(x)) for x in body.get("referenceIds", [])],
        "referenceSourceId": _oid(str(body["referenceSourceId"])) if body.get("referenceSourceId") else None,
    }

    # typed body는 kind 이름 그대로 key로 넣는다 (요청 스키마)
    if kind_val != "S100_Concept":
        doc[kind_val] = typed_body

    # None 정리
    if doc.get("referenceSourceId") is None:
        doc.pop("referenceSourceId", None)

    try:
        res = await db[COLL_ITEMS].insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    created = await db[COLL_ITEMS].find_one({"_id": res.inserted_id})
    return _dump_doc(created)


@router.get("/dd/items/{item_id}")
async def get_dd_item(item_id: str):
    db = get_db()
    doc = await db[COLL_ITEMS].find_one({"_id": _oid(item_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Item not found")
    return _dump_doc(doc)


@router.patch("/dd/items/{item_id}")
async def patch_dd_item(item_id: str, payload: RegisterItemPatch):
    """부분 수정 + managementInfo 1개 누적.

    주의:
    - itemIdentifier는 수정 불가
    - kind 변경은 별도 convert API로만 허용
    """
    db = get_db()
    now = _now()

    existing = await db[COLL_ITEMS].find_one({"_id": _oid(item_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Item not found")

    body = payload.model_dump(by_alias=True, exclude_none=True)
    mgmt = body.pop("managementInfo", None)
    if not mgmt:
        raise HTTPException(status_code=422, detail="managementInfo is required")

    mgmt["createdAt"] = now
    mgmt["updatedAt"] = now
    mgmt["dateProposed"] = _as_utc_dt(mgmt.get("dateProposed"))
    mgmt["dateAccepted"] = _as_utc_dt(mgmt.get("dateAccepted"))
    mgmt["dateAmended"] = _as_utc_dt(mgmt.get("dateAmended"))
    res_mgmt = await db[COLL_MGMT_INFO].insert_one(mgmt)
    new_mgmt_id = res_mgmt.inserted_id

    updates: Dict[str, Any] = {"updatedAt": now}

    # concept patch (dict로 받음)
    if "concept" in body:
        cpatch = body.get("concept") or {}
        for k, v in cpatch.items():
            if k == "itemIdentifier":
                continue
            updates[f"concept.{k}"] = v

    # relations
    if "referenceIds" in body:
        updates["referenceIds"] = [_oid(str(x)) for x in (body.get("referenceIds") or [])]
    if "referenceSourceId" in body:
        updates["referenceSourceId"] = _oid(str(body["referenceSourceId"])) if body.get("referenceSourceId") else None

    # typed patch (kind에 맞는 subdoc에만 기록)
    kind_val = existing.get("kind")
    if kind_val and kind_val != "S100_Concept":
        # ✅ kind별 연관관계/종속 규칙 검증 (partial)
        await _validate_typed_relations(db, kind_val, body, partial=True)

        if kind_val == "S100_CD_Feature":
            if "featureUseType" in body:
                updates[f"{kind_val}.featureUseType"] = body.get("featureUseType")
            if "distinctionIds" in body:
                updates[f"{kind_val}.distinctionIds"] = [_oid(str(x)) for x in (body.get("distinctionIds") or [])]

        elif kind_val == "S100_CD_Information":
            if "distinctionIds" in body:
                updates[f"{kind_val}.distinctionIds"] = [_oid(str(x)) for x in (body.get("distinctionIds") or [])]

        elif kind_val == "S100_CD_EnumeratedValue":
            if "numericCode" in body:
                updates[f"{kind_val}.numericCode"] = body.get("numericCode")
            if "parentSimpleAttributeId" in body:
                updates[f"{kind_val}.parentSimpleAttributeId"] = _oid(str(body.get("parentSimpleAttributeId")))

        elif kind_val == "S100_CD_SimpleAttribute":
            if "valueType" in body:
                updates[f"{kind_val}.valueType"] = body.get("valueType")
            if "quantitySpecification" in body:
                updates[f"{kind_val}.quantitySpecification"] = body.get("quantitySpecification")
            if "attributeConstraints" in body:
                updates[f"{kind_val}.attributeConstraints"] = body.get("attributeConstraints")

        elif kind_val == "S100_CD_ComplexAttribute":
            if "subAttributes" in body:
                subs_in = body.get("subAttributes") or []
                subs_out: List[dict] = []
                for s in subs_in:
                    if not isinstance(s, dict):
                        continue
                    aid = s.get("attributeId")
                    subs_out.append(
                        {
                            "attributeId": _oid(str(aid)) if aid else None,
                            "multiplicity": s.get("multiplicity") or {},
                            "sequential": s.get("sequential", "false"),
                        }
                    )
                updates[f"{kind_val}.subAttributes"] = subs_out

    update_doc = {"$set": updates, "$push": {"managementInfoIds": new_mgmt_id}}

    updated = await db[COLL_ITEMS].find_one_and_update(
        {"_id": _oid(item_id)},
        update_doc,
        return_document=ReturnDocument.AFTER,
    )
    return _dump_doc(updated)


@router.patch("/dd/items/{item_id}/convert")
async def convert_concept_to_typed(item_id: str, payload: ConvertFromConceptPayload):
    """S100_Concept -> typed(kind 변경 + typed body 추가)"""
    db = get_db()
    now = _now()

    existing = await db[COLL_ITEMS].find_one({"_id": _oid(item_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Item not found")
    if existing.get("kind") != "S100_Concept":
        raise HTTPException(status_code=400, detail="Only S100_Concept can be converted")

    body = payload.model_dump(by_alias=True, exclude_none=True)
    kind_val = body.get("kind")

    # ✅ kind별 연관관계/종속 규칙 검증
    await _validate_typed_relations(db, kind_val, body, partial=False)

    # 관리이력 추가
    mgmt = body.get("managementInfo") or {}
    mgmt["createdAt"] = now
    mgmt["updatedAt"] = now
    mgmt["dateProposed"] = _as_utc_dt(mgmt.get("dateProposed"))
    mgmt["dateAccepted"] = _as_utc_dt(mgmt.get("dateAccepted"))
    mgmt["dateAmended"] = _as_utc_dt(mgmt.get("dateAmended"))
    res_mgmt = await db[COLL_MGMT_INFO].insert_one(mgmt)

    typed_body = _build_typed_body(kind_val, body)

    update = {
        "$set": {
            "kind": kind_val,
            kind_val: typed_body,
            "updatedAt": now,
        },
        "$push": {"managementInfoIds": res_mgmt.inserted_id},
    }

    updated = await db[COLL_ITEMS].find_one_and_update(
        {"_id": _oid(item_id)},
        update,
        return_document=ReturnDocument.AFTER,
    )
    return _dump_doc(updated)


# -------------------------
# PR Items
# -------------------------

@router.get("/pr/items")
async def list_pr_items(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    q: Optional[str] = None,
    searchBy: str = "name",  # name|itemIdentifier
    kind: Optional[str] = None,
    status: Optional[str] = None,
    registerId: Optional[str] = None,
    sortBy: str = "updatedAt",
    sortOrder: str = "desc",
):
    db = get_db()

    flt: Dict[str, Any] = {}
    if registerId:
        flt["registerId"] = _oid(registerId)

    kinds = _normalize_kinds(_normalize_pr_kind(kind) if kind and "," not in kind else kind)
    if kinds:
        # _normalize_kinds는 DD용이지만 "S100_PR_*"도 그대로 통과
        flt["kind"] = {"$in": kinds} if len(kinds) > 1 else kinds[0]

    if status:
        flt["prItem.itemStatus"] = status

    if q:
        if searchBy == "itemIdentifier":
            flt["prItem.itemIdentifier"] = str(q).strip()
        else:
            flt["prItem.name"] = {"$regex": q, "$options": "i"}

    sort_map = {
        "itemIdentifier": "prItem.itemIdentifier",
        "name": "prItem.name",
        "itemStatus": "prItem.itemStatus",
        "kind": "kind",
        "createdAt": "createdAt",
        "updatedAt": "updatedAt",
    }
    sort_field = sort_map.get(sortBy, sortBy)
    allowed = {"prItem.itemIdentifier", "prItem.name", "prItem.itemStatus", "kind", "createdAt", "updatedAt"}
    sort_by = _sort_field(sort_field, allowed, "updatedAt")
    sort_dir = 1 if sortOrder.lower() == "asc" else -1

    total = await db[COLL_PR_ITEMS].count_documents(flt)
    cursor = (
        db[COLL_PR_ITEMS]
        .find(flt)
        .sort(sort_by, sort_dir)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = [_dump_doc(x) async for x in cursor]
    return {"items": items, "total": total}


@router.post("/pr/items", status_code=201)
async def create_pr_item(payload: PRRegisterItemCreate):
    """신규 PR 항목 생성 (MVP).

    - itemIdentifier는 서버가 registerId 단위로 순차 자동할당 (string 저장)
    - managementInfos는 1개 이상 필수, 저장 후 managementInfoIds로 연결
    - kindBody는 kind 이름 key로 subdoc에 저장
    """
    db = get_db()
    now = _now()

    body = payload.model_dump(by_alias=True, exclude_none=True)
    register_oid = _oid(str(body["registerId"]))

    # 1) managementInfos -> managementInfoIds
    mgmt_infos = body.pop("managementInfos", [])
    if not mgmt_infos:
        raise HTTPException(status_code=422, detail="managementInfos must have at least 1 item")

    mgmt_docs: List[dict] = []
    for mi in mgmt_infos:
        mi["createdAt"] = now
        mi["updatedAt"] = now
        mi["dateProposed"] = _as_utc_dt(mi.get("dateProposed"))
        mi["dateAccepted"] = _as_utc_dt(mi.get("dateAccepted"))
        mi["dateAmended"] = _as_utc_dt(mi.get("dateAmended"))
        mgmt_docs.append(mi)
    res_mgmt = await db[COLL_MGMT_INFO].insert_many(mgmt_docs)
    mgmt_ids = res_mgmt.inserted_ids

    # 2) itemIdentifier 자동 할당
    item_identifier = await _next_item_identifier(db, register_oid)

    # 3) core doc
    kind_val = _normalize_pr_kind(body.get("kind")) or body.get("kind")
    pr_item = body.get("prItem") or {}
    pr_item["itemIdentifier"] = item_identifier

    doc: Dict[str, Any] = {
        "registerId": register_oid,
        "kind": kind_val,
        "prItem": pr_item,
        "xmlID": body.get("xmlID"),
        "description": body.get("description") or [],
        "createdAt": now,
        "updatedAt": now,
        "managementInfoIds": mgmt_ids,
        "referenceIds": [_oid(str(x)) for x in (body.get("referenceIds") or [])],
    }

    # optional shared relations
    if body.get("itemSchema"):
        doc["itemSchema"] = _oid(str(body.get("itemSchema")))
    if body.get("colourToken"):
        doc["colourToken"] = [_oid(str(x)) for x in (body.get("colourToken") or [])]

    # Kind별 연관관계 필드 저장 (top-level)
    # S100_PR_LineStyle, S100_PR_AreaFill: symbol [0..1]
    if body.get("symbol"):
        doc["symbol"] = _oid(str(body.get("symbol")))

    # S100_PR_ViewingGroupLayer: displayMode [0..*]
    if body.get("displayMode"):
        doc["displayMode"] = [_oid(str(x)) for x in (body.get("displayMode") or [])]

    # S100_PR_ViewingGroup, S100_PR_AlertHighlight: viewingGroup [0..*]
    if body.get("viewingGroup"):
        doc["viewingGroup"] = [_oid(str(x)) for x in (body.get("viewingGroup") or [])]

    # S100_PR_AlertHighlight: msg [0..1]
    if body.get("msg"):
        doc["msg"] = _oid(str(body.get("msg")))

    # S100_PR_AlertMessage: icon [0..1]
    if body.get("icon"):
        doc["icon"] = _oid(str(body.get("icon")))

    # S100_PR_ColourToken: value [0..1]
    if body.get("value"):
        doc["value"] = _oid(str(body.get("value")))

    # S100_PR_PaletteItem: palette [0..*]
    if body.get("palette"):
        doc["palette"] = [_oid(str(x)) for x in (body.get("palette") or [])]

    # kindBody -> subdoc
    kind_body = body.get("kindBody") or None
    if kind_body is not None:
        doc[kind_val] = kind_body

    # clean None
    if doc.get("xmlID") is None:
        doc.pop("xmlID", None)

    try:
        res = await db[COLL_PR_ITEMS].insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    created = await db[COLL_PR_ITEMS].find_one({"_id": res.inserted_id})
    return _dump_doc(created)


@router.get("/pr/items/{item_id}")
async def get_pr_item(item_id: str):
    db = get_db()
    doc = await db[COLL_PR_ITEMS].find_one({"_id": _oid(item_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="PR item not found")
    return _dump_doc(doc)


@router.patch("/pr/items/{item_id}")
async def patch_pr_item(item_id: str, payload: PRRegisterItemPatch):
    """PR 항목 부분 수정 + managementInfo 1개 누적."""
    db = get_db()
    now = _now()

    existing = await db[COLL_PR_ITEMS].find_one({"_id": _oid(item_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="PR item not found")

    body = payload.model_dump(by_alias=True, exclude_none=True)
    mgmt = body.pop("managementInfo", None)
    if not mgmt:
        raise HTTPException(status_code=422, detail="managementInfo is required")

    mgmt["createdAt"] = now
    mgmt["updatedAt"] = now
    mgmt["dateProposed"] = _as_utc_dt(mgmt.get("dateProposed"))
    mgmt["dateAccepted"] = _as_utc_dt(mgmt.get("dateAccepted"))
    mgmt["dateAmended"] = _as_utc_dt(mgmt.get("dateAmended"))
    res_mgmt = await db[COLL_MGMT_INFO].insert_one(mgmt)
    new_mgmt_id = res_mgmt.inserted_id

    updates: Dict[str, Any] = {"updatedAt": now}

    if "prItem" in body:
        ppatch = body.get("prItem") or {}
        for k, v in ppatch.items():
            if k == "itemIdentifier":
                continue
            updates[f"prItem.{k}"] = v

    if "xmlID" in body:
        updates["xmlID"] = body.get("xmlID")
    if "description" in body:
        updates["description"] = body.get("description") or []

    if "referenceIds" in body:
        updates["referenceIds"] = [_oid(str(x)) for x in (body.get("referenceIds") or [])]

    if "itemSchema" in body:
        updates["itemSchema"] = _oid(str(body.get("itemSchema"))) if body.get("itemSchema") else None
    if "colourToken" in body:
        updates["colourToken"] = [_oid(str(x)) for x in (body.get("colourToken") or [])]

    # Kind별 연관관계 필드 패치
    if "symbol" in body:
        updates["symbol"] = _oid(str(body.get("symbol"))) if body.get("symbol") else None
    if "displayMode" in body:
        updates["displayMode"] = [_oid(str(x)) for x in (body.get("displayMode") or [])]
    if "viewingGroup" in body:
        updates["viewingGroup"] = [_oid(str(x)) for x in (body.get("viewingGroup") or [])]
    if "msg" in body:
        updates["msg"] = _oid(str(body.get("msg"))) if body.get("msg") else None
    if "icon" in body:
        updates["icon"] = _oid(str(body.get("icon"))) if body.get("icon") else None
    if "value" in body:
        updates["value"] = _oid(str(body.get("value"))) if body.get("value") else None
    if "palette" in body:
        updates["palette"] = [_oid(str(x)) for x in (body.get("palette") or [])]

    # kindBody: existing.kind 하위로 저장
    if "kindBody" in body:
        kind_val = existing.get("kind")
        if kind_val:
            updates[kind_val] = body.get("kindBody") or {}

    update_doc = {"$set": updates, "$push": {"managementInfoIds": new_mgmt_id}}

    updated = await db[COLL_PR_ITEMS].find_one_and_update(
        {"_id": _oid(item_id)},
        update_doc,
        return_document=ReturnDocument.AFTER,
    )
    return _dump_doc(updated)

# -------------------------
# Reference Sources
# -------------------------
@router.get("/reference-sources")
async def list_reference_sources(
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    sortBy: str = "name",
    sortOrder: str = "asc",
):
    db = get_db()
    flt: Dict[str, Any] = {}
    if q:
        flt["name"] = {"$regex": q, "$options": "i"}

    allowed = {"name", "updatedAt", "createdAt"}
    sort_by = _sort_field(sortBy, allowed, "name")
    sort_dir = 1 if sortOrder.lower() == "asc" else -1

    total = await db[COLL_REF_SOURCES].count_documents(flt)
    cursor = (
        db[COLL_REF_SOURCES]
        .find(flt)
        .sort(sort_by, sort_dir)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = [_dump_doc(x) async for x in cursor]
    return {"items": items, "total": total}


@router.post("/reference-sources", status_code=201)
async def create_reference_source(payload: ReferenceSourceCreate):
    db = get_db()
    now = _now()
    doc = payload.model_dump(exclude_none=True)
    doc["createdAt"] = now
    doc["updatedAt"] = now
    try:
        res = await db[COLL_REF_SOURCES].insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    created = await db[COLL_REF_SOURCES].find_one({"_id": res.inserted_id})
    return _dump_doc(created)


@router.get("/reference-sources/{source_id}")
async def get_reference_source(source_id: str):
    db = get_db()
    doc = await db[COLL_REF_SOURCES].find_one({"_id": _oid(source_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="ReferenceSource not found")
    return _dump_doc(doc)


# -------------------------
# References
# -------------------------
@router.get("/references")
async def list_references(
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    sortBy: str = "updatedAt",
    sortOrder: str = "desc",
):
    db = get_db()
    flt: Dict[str, Any] = {}
    if q:
        flt["title"] = {"$regex": q, "$options": "i"}

    allowed = {"title", "updatedAt", "createdAt"}
    sort_by = _sort_field(sortBy, allowed, "updatedAt")
    sort_dir = 1 if sortOrder.lower() == "asc" else -1

    total = await db[COLL_REFERENCES].count_documents(flt)
    cursor = (
        db[COLL_REFERENCES]
        .find(flt)
        .sort(sort_by, sort_dir)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = [_dump_doc(x) async for x in cursor]
    return {"items": items, "total": total}


@router.post("/references", status_code=201)
async def create_reference(payload: ReferenceCreate):
    db = get_db()
    now = _now()
    doc = payload.model_dump(exclude_none=True)
    doc["createdAt"] = now
    doc["updatedAt"] = now
    try:
        res = await db[COLL_REFERENCES].insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    created = await db[COLL_REFERENCES].find_one({"_id": res.inserted_id})
    return _dump_doc(created)


@router.get("/references/{ref_id}")
async def get_reference(ref_id: str):
    db = get_db()
    doc = await db[COLL_REFERENCES].find_one({"_id": _oid(ref_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Reference not found")
    return _dump_doc(doc)

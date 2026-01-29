# app/api.py
from __future__ import annotations

from datetime import datetime, timezone, date, time
from typing import Any, Dict, Optional, List

from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId

from .db import COLL_MGMT_INFO, get_db, COLL_REGISTERS, COLL_ITEMS, COLL_REF_SOURCES, COLL_REFERENCES
from .models import (
    RegisterCreate,
    RegisterItemCreate,
    RegisterItemPatch,
    ReferenceCreate,
    ReferenceSourceCreate,
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


def _dump_doc(doc: dict) -> dict:
    """Convert Mongo doc to JSON-safe dict (ObjectId -> str)."""
    if not doc:
        return doc
    out = dict(doc)
    if isinstance(out.get("_id"), ObjectId):
        out["_id"] = str(out["_id"])
    if isinstance(out.get("registerId"), ObjectId):
        out["registerId"] = str(out["registerId"])
    for k in ["managementInfoIds", "referenceIds"]:
        if k in out and isinstance(out[k], list):
            out[k] = [str(x) if isinstance(x, ObjectId) else x for x in out[k]]
    if isinstance(out.get("referenceSourceId"), ObjectId):
        out["referenceSourceId"] = str(out["referenceSourceId"])
    return out


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
# DD Items
# -------------------------
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
    if kind:
        flt["kind"] = kind
    if status:
        flt["itemStatus"] = status
    if q:
        if searchBy == "itemIdentifier":
            try:
                flt["itemIdentifier"] = int(q)
            except Exception:
                flt["itemIdentifier"] = -999999999
        else:
            flt["name"] = {"$regex": q, "$options": "i"}

    allowed = {"updatedAt", "createdAt", "name", "itemIdentifier", "itemStatus", "kind"}
    sort_by = _sort_field(sortBy, allowed, "updatedAt")
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
    """Create item + (필수) managementInfos 1..* 먼저 insert 후, 그 id들을 item에 연결."""
    db = get_db()
    now = _now()

    doc = payload.model_dump(by_alias=True, exclude_none=True)

    # registerId -> ObjectId
    doc["registerId"] = _oid(str(doc["registerId"]))

    # 1) ✅ managementInfos 먼저 저장해서 ids 만들기
    mgmt_infos = doc.pop("managementInfos", [])
    mgmt_docs = []
    for mi in mgmt_infos:
        mi["createdAt"] = now
        mi["updatedAt"] = now
        # date coercion
        mi["dateProposed"] = _as_utc_dt(mi.get("dateProposed"))
        mi["dateAccepted"] = _as_utc_dt(mi.get("dateAccepted"))
        mgmt_docs.append(mi)

    if not mgmt_docs:
        raise HTTPException(status_code=422, detail="managementInfos must have at least 1 item")

    res_mgmt = await db[COLL_MGMT_INFO].insert_many(mgmt_docs)
    doc["managementInfoIds"] = res_mgmt.inserted_ids  # ObjectId list

    # 2) relations ids -> ObjectId list
    doc["referenceIds"] = [_oid(str(x)) for x in doc.get("referenceIds", [])]
    if doc.get("referenceSourceId"):
        doc["referenceSourceId"] = _oid(str(doc["referenceSourceId"]))

    doc["createdAt"] = now
    doc["updatedAt"] = now

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
    """
    ✅ Update policy (MVP):
    - item 필드들은 부분 수정 가능
    - managementInfo는 기존 레코드를 수정하지 않고, 항상 '새 레코드'를 생성하여 managementInfoIds에 append
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

    res_mgmt = await db[COLL_MGMT_INFO].insert_one(mgmt)
    new_mgmt_id = res_mgmt.inserted_id

    updates: Dict[str, Any] = {}

    # relations
    if "referenceIds" in body:
        updates["referenceIds"] = [_oid(str(x)) for x in (body.get("referenceIds") or [])]
    if "referenceSourceId" in body:
        updates["referenceSourceId"] = _oid(str(body["referenceSourceId"])) if body.get("referenceSourceId") else None

    # item fields
    for k in [
        "name",
        "definition",
        "remarks",
        "itemStatus",
        "alias",
        "camelCase",
        "definitionSource",
        "reference",
        "similarityToSource",
        "justification",
        "proposedChange",
    ]:
        if k in body:
            updates[k] = body[k]

    updates["updatedAt"] = now

    update_doc = {
        "$set": updates,
        "$push": {"managementInfoIds": new_mgmt_id},
    }

    updated = await db[COLL_ITEMS].find_one_and_update(
        {"_id": _oid(item_id)},
        update_doc,
        return_document=True,
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

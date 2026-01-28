# app/api.py
from __future__ import annotations

from datetime import datetime, timezone, date, time
from typing import Any, Dict, Optional, List, Tuple

from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId

from .db import get_db, COLL_REGISTERS, COLL_ITEMS
from .models import RegisterCreate, RegisterOut, RegisterItemCreate, RegisterItemOut

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


def _dump_doc(doc: dict) -> dict:
    """Convert Mongo doc to JSON-safe dict (ObjectId -> str)."""
    if not doc:
        return doc
    out = dict(doc)
    if isinstance(out.get("_id"), ObjectId):
        out["_id"] = str(out["_id"])
    # registerId / reference ids may be ObjectId
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
    # dateOfLastChange default: today
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
        # duplicate key etc.
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
    db = get_db()
    now = _now()
    doc = payload.model_dump(by_alias=True)

    # registerId -> ObjectId
    doc["registerId"] = _oid(str(doc["registerId"]))
    # relation ids -> ObjectId list
    doc["managementInfoIds"] = [_oid(str(x)) for x in doc.get("managementInfoIds", [])]
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

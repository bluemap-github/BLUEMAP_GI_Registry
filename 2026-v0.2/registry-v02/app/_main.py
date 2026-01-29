# app/main.py
from __future__ import annotations

import json
from typing import Any, Dict

from pathlib import Path as FsPath
from fastapi import FastAPI, Path as ApiPath, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder

from bson import ObjectId
from .db import attach_db, get_db, COLL_ITEMS, COLL_MGMT_INFO, COLL_REF_SOURCES, COLL_REFERENCES
from .api import router as api_router

BASE_DIR = FsPath(__file__).resolve().parent  # .../app

app = FastAPI(title="FastAPI Registry MVP")

# DB 연결 + Index 초기화
attach_db(app)

# API
app.include_router(api_router, prefix="/api")

# Static / Templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


# ------------------------
# Helpers
# ------------------------
def _is_objectid_hex(s: str) -> bool:
    return len(s) == 24 and all(c in "0123456789abcdefABCDEF" for c in s)


def _normalize_item(doc: dict) -> dict:
    """Jinja/JS에서 사용하기 편하도록 ObjectId들을 문자열로 변환."""
    if not doc:
        return doc

    if isinstance(doc.get("_id"), ObjectId):
        doc["_id"] = str(doc["_id"])

    for k in ["registerId", "referenceSourceId"]:
        if isinstance(doc.get(k), ObjectId):
            doc[k] = str(doc[k])

    for k in ["managementInfoIds", "referenceIds"]:
        if isinstance(doc.get(k), list):
            doc[k] = [str(x) if isinstance(x, ObjectId) else x for x in doc[k]]

    return doc


async def _resolve_item_doc(item_id: str) -> dict:
    """
    item_id는 아래 둘 다 허용:
    - Mongo _id(ObjectId 24hex)
    - itemIdentifier(숫자)  ※ 여러 건이면 모호하므로 409
    """
    db = get_db()
    coll = db[COLL_ITEMS]

    if _is_objectid_hex(item_id):
        doc = await coll.find_one({"_id": ObjectId(item_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Item not found")
        return doc

    if item_id.isdigit():
        # ✅ concept.itemIdentifier는 string으로 저장
        docs = await coll.find({"concept.itemIdentifier": str(item_id)}).limit(2).to_list(length=2)
        if not docs:
            raise HTTPException(status_code=404, detail="Item not found")
        if len(docs) > 1:
            raise HTTPException(
                status_code=409,
                detail="itemIdentifier is ambiguous across registers. Use Mongo _id in URL.",
            )
        return docs[0]

    raise HTTPException(status_code=400, detail="Invalid item id")


# ------------------------
# UI pages
# ------------------------
@app.get("/", response_class=HTMLResponse)
async def ui_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "message": ""})


# Registers
@app.get("/ui/registers", response_class=HTMLResponse)
async def ui_register_list(request: Request):
    return templates.TemplateResponse("register_list.html", {"request": request})


@app.get("/ui/registers/new", response_class=HTMLResponse)
async def ui_register_new(request: Request):
    return templates.TemplateResponse("register_new.html", {"request": request})


# Data Dictionary Items (UI용)
KIND_KEYS = ["feature", "information", "attribute", "enumeratedValue", "concept"]


@app.get("/ui/dd", response_class=HTMLResponse)
async def ui_dd_list(request: Request):
    """MVP: 초기 로딩을 빠르게 하려고 서버에서 initial_items + initial_stats를 만들어 dd_list.html에 주입"""
    db = get_db()
    coll = db[COLL_ITEMS]

    page = 1
    limit = 20
    sort_by = "updatedAt"
    sort_order = -1  # desc

    # ✅ Data Dictionary 목록: Concept-only 제외
    flt: Dict[str, Any] = {"kind": {"$ne": "S100_Concept"}}

    total = await coll.count_documents(flt)

    cursor = (
        coll.find(flt)
        .sort(sort_by, sort_order)
        .skip((page - 1) * limit)
        .limit(limit)
    )

    items = []
    async for doc in cursor:
        items.append(_normalize_item(doc))

    # ✅ 타입별 카운트는 kind 기준
    initial_stats = {
        "feature": await coll.count_documents({"kind": "S100_CD_Feature"}),
        "information": await coll.count_documents({"kind": "S100_CD_Information"}),
        "enumeratedValue": await coll.count_documents({"kind": "S100_CD_EnumeratedValue"}),
        "simpleAttribute": await coll.count_documents({"kind": "S100_CD_SimpleAttribute"}),
        "complexAttribute": await coll.count_documents({"kind": "S100_CD_ComplexAttribute"}),
        "concept": await coll.count_documents({"kind": "S100_Concept"}),
    }

    initial_items_json = json.dumps(items, ensure_ascii=False, default=str)
    initial_stats_json = json.dumps(initial_stats, ensure_ascii=False)

    return templates.TemplateResponse(
        "dd_list.html",
        {
            "request": request,
            "initial_total": total,
            "initial_items_json": initial_items_json,
            "initial_stats": initial_stats,
            "initial_stats_json": initial_stats_json,
        },
    )


# ------------------------
# Concept Register UI
# ------------------------
@app.get("/ui/concepts", response_class=HTMLResponse)
async def ui_concept_list(request: Request):
    """Concept Register 리스트."""
    db = get_db()
    coll = db[COLL_ITEMS]

    page = 1
    limit = 20
    sort_by = "updatedAt"
    sort_order = -1

    # ✅ Concept-only 문서만
    flt: Dict[str, Any] = {"kind": "S100_Concept"}
    total = await coll.count_documents(flt)

    cursor = (
        coll.find(flt)
        .sort(sort_by, sort_order)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = []
    async for doc in cursor:
        items.append(_normalize_item(doc))

    # 타입별 카운트 (참고용)
    binding_stats = {
        "concept": await coll.count_documents({"kind": "S100_Concept"}),
        "feature": await coll.count_documents({"kind": "S100_CD_Feature"}),
        "information": await coll.count_documents({"kind": "S100_CD_Information"}),
        "enumeratedValue": await coll.count_documents({"kind": "S100_CD_EnumeratedValue"}),
        "simpleAttribute": await coll.count_documents({"kind": "S100_CD_SimpleAttribute"}),
        "complexAttribute": await coll.count_documents({"kind": "S100_CD_ComplexAttribute"}),
    }

    return templates.TemplateResponse(
        "concept_list.html",
        {
            "request": request,
            "initial_total": total,
            "initial_items_json": json.dumps(items, ensure_ascii=False, default=str),
            "binding_stats": binding_stats,
            "binding_stats_json": json.dumps(binding_stats, ensure_ascii=False),
        },
    )


@app.get("/ui/dd/new", response_class=HTMLResponse)
async def ui_dd_new(request: Request, fromConceptId: str = ""):
    # fromConceptId가 있으면 convert 모드
    return templates.TemplateResponse(
        "dd_new.html",
        {"request": request, "fromConceptId": fromConceptId},
    )


@app.get("/ui/dd/{item_id}/edit", response_class=HTMLResponse)
async def ui_dd_edit(request: Request, item_id: str):
    doc = await _resolve_item_doc(item_id)
    doc = _normalize_item(doc)
    doc = jsonable_encoder(doc)

    return templates.TemplateResponse(
        "dd_update.html",
        {"request": request, "item_id": item_id, "item": doc},
    )

def _stringify_oid_any(x):
    if isinstance(x, ObjectId):
        return str(x)
    if isinstance(x, list):
        return [_stringify_oid_any(v) for v in x]
    if isinstance(x, dict):
        return {k: _stringify_oid_any(v) for k, v in x.items()}
    return x

@app.get("/ui/dd/{item_id}", response_class=HTMLResponse)
async def ui_dd_detail(request: Request, item_id: str, type: str = ""):
    db = get_db()

    doc = await _resolve_item_doc(item_id)  # doc 안에는 ObjectId들이 그대로 있음

    # ✅ 연결 문서 조회 (ObjectId 그대로 사용 가능)
    mgmt_infos = []
    if doc.get("managementInfoIds"):
        mgmt_cursor = db[COLL_MGMT_INFO].find({"_id": {"$in": doc["managementInfoIds"]}}).sort("createdAt", 1)
        mgmt_infos = [x async for x in mgmt_cursor]

    reference_source = None
    if doc.get("referenceSourceId"):
        reference_source = await db[COLL_REF_SOURCES].find_one({"_id": doc["referenceSourceId"]})

    references = []
    if doc.get("referenceIds"):
        ref_list = [x async for x in db[COLL_REFERENCES].find({"_id": {"$in": doc["referenceIds"]}})]
        # ✅ 순서 보존
        by_id = {str(x["_id"]): x for x in ref_list}
        references = [by_id.get(str(rid)) for rid in doc["referenceIds"] if by_id.get(str(rid))]

    # item normalize + JSON safe
    doc = _normalize_item(doc)
    doc = jsonable_encoder(doc)
    mgmt_infos = jsonable_encoder(_stringify_oid_any(mgmt_infos))
    reference_source = jsonable_encoder(_stringify_oid_any(reference_source))
    references = jsonable_encoder(_stringify_oid_any(references))

    return templates.TemplateResponse(
        "dd_detail.html",
        {
            "request": request,
            "item_id": item_id,
            "dd_type": type,
            "item": doc,
            "mgmt_infos": mgmt_infos,
            "reference_source": reference_source,
            "references": references,
        },
    )


@app.get("/ui/concepts/{item_id}", response_class=HTMLResponse)
async def ui_concept_detail(request: Request, item_id: str):
    """Concept 상세 + Convert 버튼 제공."""
    db = get_db()

    doc = await _resolve_item_doc(item_id)

    mgmt_infos = []
    if doc.get("managementInfoIds"):
        mgmt_cursor = db[COLL_MGMT_INFO].find({"_id": {"$in": doc["managementInfoIds"]}}).sort("createdAt", 1)
        mgmt_infos = [x async for x in mgmt_cursor]

    reference_source = None
    if doc.get("referenceSourceId"):
        reference_source = await db[COLL_REF_SOURCES].find_one({"_id": doc["referenceSourceId"]})

    references = []
    if doc.get("referenceIds"):
        ref_list = [x async for x in db[COLL_REFERENCES].find({"_id": {"$in": doc["referenceIds"]}})]
        by_id = {str(x["_id"]): x for x in ref_list}
        references = [by_id.get(str(rid)) for rid in doc["referenceIds"] if by_id.get(str(rid))]

    # ✅ 신규 스키마: concept-only(kind=S100_Concept)만 여기서 주로 조회
    current_kind = doc.get("kind")

    doc = _normalize_item(doc)
    doc = jsonable_encoder(doc)
    mgmt_infos = jsonable_encoder(_stringify_oid_any(mgmt_infos))
    reference_source = jsonable_encoder(_stringify_oid_any(reference_source))
    references = jsonable_encoder(_stringify_oid_any(references))

    return templates.TemplateResponse(
        "concept_detail.html",
        {
            "request": request,
            "item_id": item_id,
            "item": doc,
            "current_kind": current_kind,
            "mgmt_infos": mgmt_infos,
            "reference_source": reference_source,
            "references": references,
        },
    )
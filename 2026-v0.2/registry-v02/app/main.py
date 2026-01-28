# app/main.py
from __future__ import annotations

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder

from bson import ObjectId

from .db import attach_db, get_db, COLL_ITEMS
from .api import router as api_router

app = FastAPI(title="FastAPI Registry MVP")

# DB 연결 + Index 초기화
attach_db(app)

# API
app.include_router(api_router, prefix="/api")

# Static / Templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


# ------------------------
# Helpers
# ------------------------
def _is_objectid_hex(s: str) -> bool:
    return len(s) == 24 and all(c in "0123456789abcdefABCDEF" for c in s)


def _normalize_item(doc: dict) -> dict:
    """
    Jinja/JS에서 사용하기 편하도록 ObjectId들을 문자열로 변환.
    (문서 구조는 그대로 유지)
    """
    if not doc:
        return doc

    # _id
    if isinstance(doc.get("_id"), ObjectId):
        doc["_id"] = str(doc["_id"])

    # 단일 ObjectId 필드들
    for k in ["registerId", "referenceSourceId"]:
        if isinstance(doc.get(k), ObjectId):
            doc[k] = str(doc[k])

    # 배열 ObjectId 필드들
    for k in ["managementInfoIds", "referenceIds"]:
        if isinstance(doc.get(k), list):
            doc[k] = [str(x) if isinstance(x, ObjectId) else x for x in doc[k]]

    return doc


# ------------------------
# UI pages
# ------------------------
@app.get("/", response_class=HTMLResponse)
async def ui_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "message": ""})


@app.post("/submit", response_class=HTMLResponse)
async def ui_submit(request: Request):
    form = await request.form()
    name = form.get("name", "")
    return templates.TemplateResponse("index.html", {"request": request, "message": f"받음: {name}"})


# Registers
@app.get("/ui/registers", response_class=HTMLResponse)
async def ui_register_list(request: Request):
    return templates.TemplateResponse("register_list.html", {"request": request})


@app.get("/ui/registers/new", response_class=HTMLResponse)
async def ui_register_new(request: Request):
    return templates.TemplateResponse("register_new.html", {"request": request})


# Data Dictionary Items
@app.get("/ui/dd", response_class=HTMLResponse)
async def ui_dd_list(request: Request):
    return templates.TemplateResponse("dd_list.html", {"request": request})


@app.get("/ui/dd/new", response_class=HTMLResponse)
async def ui_dd_new(request: Request):
    return templates.TemplateResponse("dd_new.html", {"request": request})


@app.get("/ui/dd/{item_id}", response_class=HTMLResponse)
async def ui_dd_detail(request: Request, item_id: str):
    """
    item_id는 아래 둘 다 허용:
    - Mongo _id(ObjectId 24hex)
    - itemIdentifier(숫자)
    """
    db = get_db()
    coll = db[COLL_ITEMS]

    # 조회 쿼리 결정
    if _is_objectid_hex(item_id):
        query = {"_id": ObjectId(item_id)}
    elif item_id.isdigit():
        query = {"itemIdentifier": int(item_id)}
    else:
        raise HTTPException(status_code=400, detail="Invalid item id")

    doc = await coll.find_one(query)
    if not doc:
        raise HTTPException(status_code=404, detail="Item not found")

    doc = _normalize_item(doc)
    doc = jsonable_encoder(doc)  # datetime/ObjectId 등의 직렬화 안전 처리

    # dd_detail.html에서 item.<field> 로 쓰면 됨
    return templates.TemplateResponse(
        "dd_detail.html",
        {
            "request": request,
            "item_id": item_id,
            "item": doc,
        },
    )

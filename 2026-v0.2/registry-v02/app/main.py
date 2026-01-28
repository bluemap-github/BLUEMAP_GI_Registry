# app/main.py
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .db import attach_db
from .api import router as api_router

app = FastAPI(title="FastAPI Registry MVP")

# DB 연결 + Index 초기화
attach_db(app)

# API
app.include_router(api_router, prefix="/api")

# Static / Templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# ---------- UI pages ----------
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
async def ui_dd_detail(request: Request, item_id: int):
    return templates.TemplateResponse("dd_detail.html", {"request": request, "item_id": item_id})

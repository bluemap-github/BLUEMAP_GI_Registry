# app/main.py
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI(title="FastAPI Registry MVP")

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# ---------- UI pages (정적 HTML처럼 보이게) ----------
@app.get("/ui/dd", response_class=HTMLResponse)
async def ui_dd_list(request: Request):
    return templates.TemplateResponse("dd_list.html", {"request": request})

@app.get("/ui/dd/new", response_class=HTMLResponse)
async def ui_dd_new(request: Request):
    return templates.TemplateResponse("dd_new.html", {"request": request})

@app.get("/ui/dd/{item_id}", response_class=HTMLResponse)
async def ui_dd_detail(request: Request, item_id: int):
    # 템플릿에 item_id만 꽂아주고, 실제 데이터는 JS가 /api에서 fetch
    return templates.TemplateResponse("dd_detail.html", {"request": request, "item_id": item_id})

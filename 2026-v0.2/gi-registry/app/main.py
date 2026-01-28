from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI(title="FastAPI Mini (GET/POST + Jinja)")

# 정적 파일 / 템플릿 설정
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


# ✅ GET: 템플릿 렌더링
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "message": "Hello FastAPI + Jinja!"}
    )


# ✅ GET: 아주 간단한 API
@app.get("/api/ping")
async def ping():
    return {"ok": True, "message": "pong"}


# ✅ POST: JSON body 받기
@app.post("/api/echo")
async def echo(payload: dict):
    return {"received": payload}


# ✅ POST: 폼(form) 받기 (템플릿에서 submit)
@app.post("/submit", response_class=HTMLResponse)
async def submit(request: Request, name: str = Form(...)):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "message": f"안녕, {name}!"}
    )

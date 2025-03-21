from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

router = FastAPI()

templates = Jinja2Templates(directory="./templates")

@router.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "title" : "Laboratório de Inteligência Artificial"})

from fastapi import APIRouter
from openai import OpenAI
import os
from dotenv import load_dotenv

#instance - object
load_dotenv()
router = APIRouter()
client = OpenAI()
client.api_key = os.getenv('OPENAI_API_KEY')

@router.post('/api/image/generation')
async def imagegeneration(prompt_img: str):
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt_img,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    return response.data[0].url
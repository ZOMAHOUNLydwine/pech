from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/resources", tags=["resources"])

@router.get("/")
async def get_resources():
    return {"resources": []}

"""
Lessons and units endpoints
Protected: Requires authentication and verified account
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from ..schemas import Lesson, Unit, LanguageCode
from ..mock_data import LESSONS, UNITS
from ..models import User
from ..database import get_db
from ..security import get_current_user, require_verified

router = APIRouter(prefix="/lessons", tags=["Lessons"])
units_router = APIRouter(prefix="/units", tags=["Units"])


@router.get("/", response_model=List[Lesson])
async def get_lessons(
    language: Optional[LanguageCode] = None,
    unit_id: Optional[str] = None,
    current_user: User = Depends(require_verified),
    db: Session = Depends(get_db)
):
    """
    Get available lessons
    Filtered by language and/or unit
    Requires: Authenticated + verified account
    """
    results = LESSONS
    if language:
        results = [l for l in results if l['language'] == language]
    if unit_id:
        results = [l for l in results if l['unitId'] == unit_id]
    return results


@router.get("/{lesson_id}", response_model=Lesson)
async def get_lesson(
    lesson_id: str,
    current_user: User = Depends(require_verified),
    db: Session = Depends(get_db)
):
    """
    Get specific lesson by ID
    Requires: Authenticated + verified account
    """
    lesson = next((l for l in LESSONS if l['id'] == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@units_router.get("/", response_model=List[Unit])
async def get_units(
    current_user: User = Depends(require_verified),
    db: Session = Depends(get_db)
):
    """
    Get all units
    Requires: Authenticated + verified account
    """
    return UNITS


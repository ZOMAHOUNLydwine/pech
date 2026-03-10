from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/programs", response_model=List[schemas.CategoryResponse])
def get_programs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    categories = db.query(models.Category).all()
    
    # Enrich lessons with user progress
    for cat in categories:
        for level in cat.levels:
            for unit in level.units:
                for lesson in unit.lessons:
                    progress = db.query(models.UserLessonProgress).filter(
                        models.UserLessonProgress.user_id == current_user.id,
                        models.UserLessonProgress.lesson_id == lesson.id
                    ).first()
                    
                    if progress:
                        lesson.status = progress.status
                        lesson.stars = progress.stars
                    else:
                        lesson.status = "available" if not level.is_locked else "locked"
                        lesson.stars = 0
                        
    return categories

@router.post("/lessons/{lesson_id}/complete", response_model=schemas.UserResponse)
def complete_lesson(
    lesson_id: int,
    data: schemas.LessonComplete,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    progress = db.query(models.UserLessonProgress).filter(
        models.UserLessonProgress.user_id == current_user.id,
        models.UserLessonProgress.lesson_id == lesson_id
    ).first()

    if not progress:
        progress = models.UserLessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            status="completed",
            stars=data.stars
        )
        db.add(progress)
    else:
        progress.status = "completed"
        progress.stars = max(progress.stars, data.stars)

    # Update User XP
    current_user.xp += lesson.xp_reward
    
    db.commit()
    db.refresh(current_user)
    return current_user

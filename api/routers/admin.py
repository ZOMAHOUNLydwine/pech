from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from typing import List
from database import get_db
import models, schemas
from routers.auth import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats", response_model=schemas.AdminStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin_user)
):
    """Get global statistics for the admin dashboard."""
    
    # 1. Total Users
    total_users = db.query(models.User).count()
    
    # 2. New Users (Last 30 Days)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    new_users_30d = db.query(models.User).filter(models.User.created_at >= thirty_days_ago).count()
    
    # Mock data for missing metrics
    # In a real scenario, these would come from an analytics table, subscription table, etc.
    total_visits = total_users * 18  # Mock calculation
    monthly_revenue = db.query(models.User).filter(models.User.is_premium == True).count() * 9.99
    retention_rate = 78.5 # Mock percentage
    
    # Mock Chart Data
    chart_data = [
        {"name": "Lun", "utilisateurs": 400, "sessions": 240},
        {"name": "Mar", "utilisateurs": 300, "sessions": 139},
        {"name": "Mer", "utilisateurs": 200, "sessions": 980},
        {"name": "Jeu", "utilisateurs": 278, "sessions": 390},
        {"name": "Ven", "utilisateurs": 189, "sessions": 480},
        {"name": "Sam", "utilisateurs": 239, "sessions": 380},
        {"name": "Dim", "utilisateurs": 349, "sessions": 430},
    ]

    return schemas.AdminStatsResponse(
        total_users=total_users,
        new_users_30d=new_users_30d,
        total_visits=total_visits,
        monthly_revenue=monthly_revenue,
        retention_rate=retention_rate,
        chart_data=chart_data
    )

@router.get("/users", response_model=List[schemas.AdminUserListItem])
def get_users_list(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin_user)
):
    """Get a list of users for the admin table."""
    users = db.query(models.User).order_by(models.User.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for user in users:
        result.append(schemas.AdminUserListItem(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role.value,
            is_active=user.is_active,
            xp=user.xp,
            created_at=user.created_at if user.created_at else datetime.now(timezone.utc)
        ))
    return result

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin_user)
):
    """Delete a user. Only admins can do this."""
    if admin_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cant delete yourself")
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# ---------------------------------------------------------------------------
# Content Management (Courses)
# ---------------------------------------------------------------------------

# Programs (Categories)
@router.get("/programs", response_model=List[schemas.CategoryResponse])
def get_programs(db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    return db.query(models.Category).all()

@router.post("/programs", response_model=schemas.CategoryResponse)
def create_program(data: schemas.CategoryCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    new_cat = models.Category(**data.model_dump())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.put("/programs/{program_id}", response_model=schemas.CategoryResponse)
def update_program(program_id: int, data: schemas.CategoryCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    cat = db.query(models.Category).filter(models.Category.id == program_id).first()
    if not cat: raise HTTPException(status_code=404, detail="Program not found")
    for key, value in data.model_dump().items():
        setattr(cat, key, value)
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/programs/{program_id}")
def delete_program(program_id: int, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    cat = db.query(models.Category).filter(models.Category.id == program_id).first()
    if not cat: raise HTTPException(status_code=404, detail="Program not found")
    db.delete(cat)
    db.commit()
    return {"message": "Program deleted"}

# Levels
@router.post("/programs/{program_id}/levels", response_model=schemas.LevelResponse)
def create_level(program_id: int, data: schemas.LevelCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    cat = db.query(models.Category).filter(models.Category.id == program_id).first()
    if not cat: raise HTTPException(status_code=404, detail="Program not found")
    new_lvl = models.Level(**data.model_dump(), category_id=program_id)
    db.add(new_lvl)
    db.commit()
    db.refresh(new_lvl)
    return new_lvl

@router.put("/levels/{level_id}", response_model=schemas.LevelResponse)
def update_level(level_id: int, data: schemas.LevelCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    lvl = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not lvl: raise HTTPException(status_code=404, detail="Level not found")
    for key, value in data.model_dump().items():
        setattr(lvl, key, value)
    db.commit()
    db.refresh(lvl)
    return lvl

@router.delete("/levels/{level_id}")
def delete_level(level_id: int, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    lvl = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not lvl: raise HTTPException(status_code=404, detail="Level not found")
    db.delete(lvl)
    db.commit()
    return {"message": "Level deleted"}

# Units
@router.post("/levels/{level_id}/units", response_model=schemas.UnitResponse)
def create_unit(level_id: int, data: schemas.UnitCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    lvl = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not lvl: raise HTTPException(status_code=404, detail="Level not found")
    new_unit = models.Unit(**data.model_dump(), level_id=level_id)
    db.add(new_unit)
    db.commit()
    db.refresh(new_unit)
    return new_unit

@router.put("/units/{unit_id}", response_model=schemas.UnitResponse)
def update_unit(unit_id: int, data: schemas.UnitCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    unit = db.query(models.Unit).filter(models.Unit.id == unit_id).first()
    if not unit: raise HTTPException(status_code=404, detail="Unit not found")
    for key, value in data.model_dump().items():
        setattr(unit, key, value)
    db.commit()
    db.refresh(unit)
    return unit

@router.delete("/units/{unit_id}")
def delete_unit(unit_id: int, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    unit = db.query(models.Unit).filter(models.Unit.id == unit_id).first()
    if not unit: raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(unit)
    db.commit()
    return {"message": "Unit deleted"}

# Lessons
@router.post("/units/{unit_id}/lessons", response_model=schemas.LessonResponse)
def create_lesson(unit_id: int, data: schemas.LessonCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    unit = db.query(models.Unit).filter(models.Unit.id == unit_id).first()
    if not unit: raise HTTPException(status_code=404, detail="Unit not found")
    new_lesson = models.Lesson(**data.model_dump(), unit_id=unit_id)
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson

@router.put("/lessons/{lesson_id}", response_model=schemas.LessonResponse)
def update_lesson(lesson_id: int, data: schemas.LessonCreate, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson: raise HTTPException(status_code=404, detail="Lesson not found")
    for key, value in data.model_dump().items():
        setattr(lesson, key, value)
    db.commit()
    db.refresh(lesson)
    return lesson

@router.delete("/lessons/{lesson_id}")
def delete_lesson(lesson_id: int, db: Session = Depends(get_db), admin_user: models.User = Depends(get_current_admin_user)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson: raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted"}

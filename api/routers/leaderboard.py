from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/", response_model=List[schemas.LeaderboardEntry])
def get_leaderboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    users = db.query(models.User).order_by(models.User.xp.desc()).limit(50).all()
    
    result = []
    for user in users:
        result.append(schemas.LeaderboardEntry(
            id=user.id,
            name=user.name,
            xp=user.xp,
            avatar=user.avatar,
            is_user=(user.id == current_user.id)
        ))
        
    return result

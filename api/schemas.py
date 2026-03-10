from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    target_language: Optional[str] = None
    learning_goal: Optional[str] = None
    learning_type: Optional[str] = None
    daily_goal: Optional[int] = None
    is_premium: Optional[bool] = None
    notifications: Optional[bool] = None
    reminders: Optional[bool] = None
    reminder_time: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    
    avatar: Optional[str] = None
    target_language: Optional[str] = None
    learning_goal: Optional[str] = None
    learning_type: Optional[str] = None
    streak: int = 0
    xp: int = 0
    daily_goal: Optional[int] = None
    is_premium: bool = False
    is_verified: bool = False
    subscription_expiry: Optional[datetime] = None
    notifications: bool = True
    reminders: bool = True
    reminder_time: str = "20:00"
    badges: str = "[]"
    completed_quests: str = "[]"

    class Config:
        from_attributes = True

class OTPVerify(BaseModel):
    email: EmailStr
    otp_code: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Content Schemas
class LessonBase(BaseModel):
    title: str
    lesson_type: str
    xp_reward: int = 10
    audio_url: Optional[str] = None
    audio_duration: Optional[str] = None
    order: int = 0

class LessonResponse(LessonBase):
    id: int
    status: str = "locked" # From UserLessonProgress
    stars: int = 0

    class Config:
        from_attributes = True

class UnitBase(BaseModel):
    title: str
    description: Optional[str] = None
    color: Optional[str] = None
    order: int = 0

class UnitResponse(UnitBase):
    id: int
    lessons: List[LessonResponse]

    class Config:
        from_attributes = True

class LevelBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    color: Optional[str] = None
    order: int = 0
    is_locked: bool = True

class LevelResponse(LevelBase):
    id: int
    units: List[UnitResponse]

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    title: str
    source_lang: str
    target_lang: str

class CategoryResponse(CategoryBase):
    id: int
    levels: List[LevelResponse]

    class Config:
        from_attributes = True

# Add Creation schemas for Content Management
class CategoryCreate(CategoryBase):
    pass

class LevelCreate(LevelBase):
    pass

class UnitCreate(UnitBase):
    pass

class LessonCreate(LessonBase):
    pass

# Progress Schemas
class LessonComplete(BaseModel):
    stars: int

class LeaderboardEntry(BaseModel):
    id: int
    name: str
    xp: int
    avatar: Optional[str] = None
    is_user: bool = False

# Admin Schemas
class AdminStatsResponse(BaseModel):
    total_users: int
    new_users_30d: int
    total_visits: int
    monthly_revenue: float
    retention_rate: float
    chart_data: List[dict] # Will hold generic chart points

class AdminUserListItem(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    xp: int
    created_at: datetime
    
    class Config:
        from_attributes = True


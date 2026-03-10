from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    # Language progress and profile info
    avatar = Column(String, nullable=True)
    known_languages = Column(String, nullable=True) # JSON or comma separated
    target_language = Column(String, nullable=True)
    learning_goal = Column(String, nullable=True)
    learning_type = Column(String, nullable=True)
    streak = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    daily_goal = Column(Integer, nullable=True)
    is_premium = Column(Boolean, default=False)
    subscription_expiry = Column(DateTime(timezone=True), nullable=True)
    
    # Settings
    notifications = Column(Boolean, default=True)
    reminders = Column(Boolean, default=True)
    reminder_time = Column(String, default="20:00")

    # Extra Progress
    badges = Column(Text, default="[]") # JSON string
    completed_quests = Column(Text, default="[]") # JSON string
    
    # OTP verification
    is_verified = Column(Boolean, default=False)
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    progress = relationship("UserLessonProgress", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False) # e.g. "Français -> Fon"
    source_lang = Column(String, nullable=False)
    target_lang = Column(String, nullable=False)
    
    levels = relationship("Level", back_populates="category", cascade="all, delete-orphan")

class Level(Base):
    __tablename__ = "levels"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    title = Column(String, nullable=False) # e.g. "Niveau 0"
    subtitle = Column(String) # e.g. "Immersion Orale"
    color = Column(String) # Tailwind class
    order = Column(Integer, default=0)
    is_locked = Column(Boolean, default=True)

    category = relationship("Category", back_populates="levels")
    units = relationship("Unit", back_populates="level", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True, index=True)
    level_id = Column(Integer, ForeignKey("levels.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    color = Column(String)
    order = Column(Integer, default=0)

    level = relationship("Level", back_populates="units")
    lessons = relationship("Lesson", back_populates="unit", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String, nullable=False)
    lesson_type = Column(String) # vocab, practice, quiz...
    xp_reward = Column(Integer, default=10)
    audio_url = Column(String, nullable=True)
    audio_duration = Column(String, nullable=True)
    order = Column(Integer, default=0)

    unit = relationship("Unit", back_populates="lessons")
    user_progress = relationship("UserLessonProgress", back_populates="lesson")

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    status = Column(String, default="available") # completed, available, locked
    stars = Column(Integer, default=0)
    last_played = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="user_progress")

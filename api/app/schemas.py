from typing import List, Optional, Literal
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime

# ============================================
# USER & AUTH SCHEMAS
# ============================================

class UserRegister(BaseModel):
    """
    User registration schema with validation
    - Email: valid email format
    - Password: minimum 8 chars, must contain uppercase, lowercase, number
    - Full name: required
    """
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(
        ..., 
        min_length=8, 
        description="At least 8 characters, must include uppercase, lowercase, and number"
    )
    full_name: str = Field(..., min_length=1, max_length=255, description="User's full name")
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v):
        """Enforce password complexity"""
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v


class UserLogin(BaseModel):
    """Login credentials"""
    email: EmailStr
    password: str = Field(..., min_length=1)


class OTPVerify(BaseModel):
    """OTP verification for account activation"""
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class UserResponse(BaseModel):
    """Safe user response (no password)"""
    id: str
    email: str
    full_name: Optional[str]
    role: str
    is_premium: bool
    is_verified: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response"""
    access_token: str = Field(..., description="JWT access token (expires in 15 min)")
    refresh_token: str = Field(..., description="JWT refresh token (expires in 7 days)")
    token_type: str = Field(default="bearer")
    user: UserResponse = Field(..., description="Current user data")


class TokenRefresh(BaseModel):
    """Refresh token request"""
    refresh_token: str


class PasswordReset(BaseModel):
    """Password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation"""
    token: str
    new_password: str = Field(...)
    
    @field_validator('new_password')
    @classmethod
    def validate_password_strength(cls, v):
        """Enforce password complexity"""
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v


# ============================================
# LESSONS SCHEMAS (Existing)
# ============================================

LanguageCode = Literal[
    'fr', 'en', 'de', 'es', 'zh', 'pt', 'ar', 'ja', 'it', 'hi', 'ru', 'sw',
    'fon', 'yoruba', 'adja', 'goun', 'bariba', 'dendi', 'ditammari',
    'anii', 'fulfulde', 'mahi', 'idaatcha', 'ife', 'waama', 'tem', 'mina'
]

SkillType = Literal['speaking', 'listening', 'reading', 'vocabulary']
DifficultyLevel = Literal['Débutant', 'Intermédiaire', 'Avancé']
ExerciseType = Literal['learn', 'quiz', 'speak', 'listen']

class LessonItem(BaseModel):
    id: str
    type: ExerciseType
    question: str
    answer: str
    options: Optional[List[str]] = None
    pronunciation: Optional[str] = None
    audioUrl: Optional[str] = None
    explanation: Optional[str] = None

class Unit(BaseModel):
    id: str
    title: str
    description: str
    color: str
    order: int

class Lesson(BaseModel):
    id: str
    unitId: str
    title: str
    description: str
    language: LanguageCode
    difficulty: DifficultyLevel
    items: List[LessonItem]
    xpReward: int
    focusSkill: SkillType


# ============================================
# PAYMENT SCHEMAS
# ============================================

class PaymentCreateOrder(BaseModel):
    """Create PayPal payment order"""
    amount: float = Field(..., gt=0, description="Amount in currency (e.g., 2000 XOF)")
    currency: str = Field(default="XOF", description="ISO 4217 currency code")
    plan: Literal["monthly", "annual"] = Field(default="monthly")


class PaymentCaptureOrder(BaseModel):
    """Capture PayPal payment order"""
    order_id: str = Field(..., description="PayPal order ID")


class TransactionResponse(BaseModel):
    """Transaction details (safe response)"""
    id: str
    user_id: str
    paypal_order_id: str
    amount: int
    currency: str
    status: str
    webhook_verified: bool
    created_at: datetime
    verified_at: Optional[datetime]
    
    class Config:
        from_attributes = True


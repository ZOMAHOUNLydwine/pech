"""
Security utilities for Noukpikplon API
- Password hashing and verification
- JWT creation and validation
- OTP generation
- Rate limiting helpers
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import secrets
import string
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from .config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, BCRYPT_ROUNDS, OTP_LENGTH

# ============================================
# PASSWORD HASHING (BCRYPT)
# ============================================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=BCRYPT_ROUNDS)

def hash_password(password: str) -> str:
    """Hash password using bcrypt with cost factor 12"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash"""
    return pwd_context.verify(plain_password, hashed_password)


# ============================================
# JWT TOKEN MANAGEMENT
# ============================================

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token
    - Default expiration: 15 minutes
    - Type: "access"
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT refresh token
    - Default expiration: 7 days
    - Type: "refresh"
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    })
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str, token_type: str = "access") -> Dict[str, Any]:
    """
    Decode and verify JWT token
    - Validates signature
    - Validates expiration
    - Validates token type
    
    Raises HTTPException 401 if invalid
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        
        # Verify token type
        if payload.get("type") != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token type. Expected {token_type}",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ============================================
# OTP GENERATION & VERIFICATION
# ============================================

def generate_otp(length: int = OTP_LENGTH) -> str:
    """Generate random numeric OTP"""
    return ''.join(secrets.choice(string.digits) for _ in range(length))


def generate_otp_expiration() -> datetime:
    """Generate OTP expiration time (10 minutes from now)"""
    from .config import OTP_EXPIRATION_MINUTES
    return datetime.utcnow() + timedelta(minutes=OTP_EXPIRATION_MINUTES)


def is_otp_valid(otp: Optional[str], otp_expires_at: Optional[datetime]) -> bool:
    """Check if OTP is still valid"""
    if not otp or not otp_expires_at:
        return False
    
    return datetime.utcnow() < otp_expires_at


def verify_otp(provided_otp: str, stored_otp: Optional[str], otp_expires_at: Optional[datetime]) -> bool:
    """Verify OTP matches and hasn't expired"""
    if not is_otp_valid(stored_otp, otp_expires_at):
        return False
    
    return provided_otp == stored_otp


# ============================================
# SECURE ERROR RESPONSES
# ============================================

def create_error_response(detail: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> Dict[str, Any]:
    """
    Create safe error response
    - Never expose sensitive information
    - Use generic messages for security issues
    """
    return {
        "error": detail,
        "status_code": status_code
    }


# ============================================
# PASSWORD RESET TOKEN
# ============================================

def create_password_reset_token(data: Dict[str, Any], expires_minutes: int = 30) -> str:
    """Create password reset token (1 hour expiration)"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    
    to_encode.update({
        "exp": expire,
        "type": "password_reset",
        "iat": datetime.now(timezone.utc)
    })
    
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_password_reset_token(token: str) -> Dict[str, Any]:
    """Decode password reset token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        
        if payload.get("type") != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )

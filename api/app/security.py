"""
Authentication and authorization middleware for Noukpikplon API
- JWT token verification
- Role-based access control (RBAC)
- Request logging and security headers
"""

from typing import Optional, Callable, List
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .models import User, TokenBlacklist
from .utils import decode_token
from .config import DEBUG

# ============================================
# HTTP BEARER TOKEN
# ============================================

security = HTTPBearer()


# ============================================
# GET CURRENT USER
# ============================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Extract and verify JWT token, return current authenticated user
    
    Raises:
    - 401 if token is invalid, expired, or not provided
    - 401 if token is blacklisted
    - 404 if user not found in database
    """
    token = credentials.credentials
    
    # Decode token and verify it's an access token
    payload = decode_token(token, token_type="access")
    user_id: str = payload.get("sub")
    
    # Check if token is blacklisted (logout)
    blacklisted = db.query(TokenBlacklist).filter(
        TokenBlacklist.token == token
    ).first()
    
    if blacklisted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    
    return user


# ============================================
# ROLE-BASED ACCESS CONTROL (RBAC)
# ============================================

def require_role(allowed_roles: List[str]) -> Callable:
    """
    Decorator to check if user has one of the allowed roles
    
    Usage:
        @router.get("/admin")
        async def admin_only(user: User = Depends(require_role(["admin"]))):
            ...
    """
    async def role_checker(
        user: User = Depends(get_current_user)
    ) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return user
    
    return role_checker


def require_verified(user: User = Depends(get_current_user)) -> User:
    """Require user to be verified (OTP confirmed)"""
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. Please verify your email with OTP.",
        )
    return user


def require_admin(user: User = Depends(require_role(["admin"]))) -> User:
    """Shortcut: require admin role"""
    return user


def require_premium(user: User = Depends(get_current_user)) -> User:
    """Require premium subscription"""
    if not user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium subscription required",
        )
    return user


# ============================================
# OPTIONAL AUTHENTICATION
# ============================================

def get_optional_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Try to get current user, but don't fail if not authenticated
    Useful for public endpoints that have additional features for logged-in users
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = decode_token(token, token_type="access")
        user_id: str = payload.get("sub")
        
        # Check blacklist
        blacklisted = db.query(TokenBlacklist).filter(
            TokenBlacklist.token == token
        ).first()
        
        if blacklisted:
            return None
        
        user = db.query(User).filter(User.id == user_id).first()
        return user if user and user.is_active else None
        
    except HTTPException:
        return None

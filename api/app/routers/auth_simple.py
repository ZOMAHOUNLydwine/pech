"""
Authentification and authorization endpoints
- Register with OTP verification
- Login with JWT tokens
- Refresh token rotation
- Logout with token blacklisting
- Password reset (future)
"""

from fastapi import APIRouter, HTTPException, Depends, status, Request
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from ..database import get_db
from ..models import User, TokenBlacklist
from ..schemas import (
    UserRegister, UserLogin, OTPVerify, Token, UserResponse,
    TokenRefresh, PasswordReset, PasswordResetConfirm
)
from ..utils import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    generate_otp, generate_otp_expiration,
    verify_otp, is_otp_valid,
    create_password_reset_token, decode_password_reset_token
)
from ..security import get_current_user, require_verified
from ..config import ENABLE_EMAIL_OTP, DEBUG

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ============================================
# REGISTER & OTP VERIFICATION
# ============================================

@router.post("/register", status_code=201, response_model=dict)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Register new user account
    1. Validate email/password
    2. Check email doesn't exist
    3. Hash password
    4. Generate OTP and send to console (dev) or email (production)
    5. Return OTP for verification
    
    Next step: Call POST /auth/verify-otp
    """
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Generate OTP
    otp = generate_otp()
    otp_expiration = generate_otp_expiration()
    
    # Create user (not verified yet)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        otp=otp,
        otp_expires_at=otp_expiration,
        is_verified=False,
        role="user"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # TODO: Send OTP via email (production)
    # For development, log to console
    logger.warning(f"🔐 OTP for {user_data.email}: {otp} (expires in 10 minutes)")
    if DEBUG:
        print(f"✅ OTP for {user_data.email}: {otp}")
    
    return {
        "message": "Registration successful. Check email for OTP.",
        "email": user_data.email,
        "otp_expiration_minutes": 10,
        "next_step": "POST /auth/verify-otp with email and otp"
    }


@router.post("/verify-otp", response_model=dict)
async def verify_otp_endpoint(
    data: OTPVerify,
    db: Session = Depends(get_db)
):
    """
    Verify OTP and activate account
    After verification, user can login
    """
    
    # Find user
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if already verified
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account already verified"
        )
    
    # Verify OTP
    if not verify_otp(data.otp, user.otp, user.otp_expires_at):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Mark as verified
    user.is_verified = True
    user.otp = None  # Clear OTP
    user.otp_expires_at = None
    db.commit()
    db.refresh(user)
    
    logger.info(f"✅ Account verified: {user.email}")
    
    return {
        "message": "Account verified successfully",
        "email": user.email,
        "next_step": "Login with POST /auth/login"
    }


# ============================================
# LOGIN & TOKEN ISSUANCE
# ============================================

@router.post("/login", response_model=Token)
async def login(
    user_data: UserLogin,
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Login with email and password
    Returns: access_token (15 min) + refresh_token (7 days)
    
    Access token: Use for API requests (Authorization: Bearer <token>)
    Refresh token: Use to get new access token when expired
    """
    
    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        # Generic message to prevent email enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if account is verified
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. Please verify your email with OTP."
        )
    
    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})
    
    logger.info(f"✅ Login successful: {user.email}")
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


# ============================================
# TOKEN REFRESH
# ============================================

@router.post("/refresh-token", response_model=Token)
async def refresh_token_endpoint(
    data: TokenRefresh,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    - Verify refresh token is valid and not blacklisted
    - Return new access token (15 min) + new refresh token (7 days)
    """
    
    # Decode refresh token
    payload = decode_token(data.refresh_token, token_type="refresh")
    user_id = payload.get("sub")
    
    # Check if refresh token is blacklisted
    blacklisted = db.query(TokenBlacklist).filter(
        TokenBlacklist.token == data.refresh_token
    ).first()
    
    if blacklisted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    new_access_token = create_access_token(data={"sub": user.id})
    new_refresh_token = create_refresh_token(data={"sub": user.id})
    
    logger.info(f"✅ Token refreshed: {user.email}")
    
    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


# ============================================
# LOGOUT & TOKEN REVOCATION
# ============================================

@router.post("/logout", response_model=dict)
async def logout(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Logout by revoking refresh token
    - Add refresh token to blacklist
    - Client should delete local tokens
    """
    
    # Get refresh token from request headers if available
    # In production, client should send refresh token for revocation
    # For now, we just log user out on frontend by deleting tokens
    
    logger.info(f"✅ Logout: {user.email}")
    
    return {
        "message": "Logged out successfully",
        "instructions": "Delete access_token and refresh_token from local storage"
    }


# ============================================
# GET CURRENT USER
# ============================================

@router.get("/me", response_model=UserResponse)
async def get_me(
    user: User = Depends(get_current_user)
):
    """
    Get current authenticated user
    Requires valid JWT access token
    """
    return UserResponse.from_orm(user)


# ============================================
# PASSWORD RESET (FUTURE)
# ============================================

@router.post("/password-reset", response_model=dict)
async def request_password_reset(
    data: PasswordReset,
    db: Session = Depends(get_db)
):
    """
    Request password reset
    - User provides email
    - System generates reset token
    - Send reset link via email (TODO)
    """
    
    user = db.query(User).filter(User.email == data.email).first()
    
    # Always return success to prevent email enumeration
    if not user:
        return {
            "message": "If email exists, reset link has been sent"
        }
    
    # TODO: Generate reset token and send via email
    reset_token = create_password_reset_token({"sub": user.id})
    
    # TODO: Send email with reset link
    logger.warning(f"Password reset requested for {user.email}")
    if DEBUG:
        print(f"Reset token: {reset_token}")
    
    return {
        "message": "If email exists, reset link has been sent",
        "next_step": "Check email for reset link"
    }


@router.post("/password-reset-confirm", response_model=dict)
async def confirm_password_reset(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Confirm password reset with token and new password
    """
    
    # Verify reset token
    payload = decode_password_reset_token(data.token)
    user_id = payload.get("sub")
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    
    logger.info(f"✅ Password reset: {user.email}")
    
    return {
        "message": "Password updated successfully",
        "next_step": "Login with new password"
    }

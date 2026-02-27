from sqlalchemy import Column, String, Boolean, Integer, DateTime, Enum
from datetime import datetime
import uuid
from .database import Base

class User(Base):
    """
    User model with security-first design
    - Passwords are bcrypt hashed
    - OTP with expiration TTL
    - Role-based access control (RBAC)
    - Audit timestamps
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)  # bcrypt hash
    full_name = Column(String(255), nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False, index=True)
    
    # OTP verification
    otp = Column(String(10), nullable=True)  # Random 6-digit OTP
    otp_expires_at = Column(DateTime, nullable=True)  # OTP expires after 10 minutes
    
    # Role-based access control
    role = Column(String(20), default="user", index=True)  # "user" or "admin"
    
    # Premium subscription
    is_premium = Column(Boolean, default=False)
    subscription_expires_at = Column(DateTime, nullable=True)
    
    # Audit fields
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"


class TokenBlacklist(Base):
    """
    Token blacklist for logout functionality
    Stores revoked refresh tokens to prevent reuse
    """
    __tablename__ = "token_blacklist"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    token = Column(String(500), unique=True, index=True, nullable=False)
    blacklisted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)  # Match token expiration
    
    def __repr__(self):
        return f"<TokenBlacklist(token={self.token[:20]}..., expires={self.expires_at})>"


class Transaction(Base):
    """
    Payment transaction log for auditing and reconciliation
    All payments must be verified via this table before granting access
    """
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)  # Foreign key to User
    paypal_order_id = Column(String(255), unique=True, nullable=False)
    amount = Column(Integer, nullable=False)  # Amount in cents
    currency = Column(String(3), default="XOF")  # West African Franc or other
    status = Column(String(50), index=True)  # "pending", "completed", "failed", "refunded"
    
    # Webhook details
    webhook_verified = Column(Boolean, default=False)  # Must be True for trust
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    verified_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<Transaction(id={self.id}, user_id={self.user_id}, status={self.status})>"

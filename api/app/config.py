"""
Configuration and security constants for Noukpikplon API
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

# 🔐 JWT CONFIGURATION
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # 15 minutes
REFRESH_TOKEN_EXPIRE_DAYS = 7     # 7 days

# If running in production, enforce strong secret
if os.getenv("ENVIRONMENT") == "production":
    if JWT_SECRET_KEY == "your-super-secret-key-change-in-production":
        raise ValueError(
            "⚠️ CRITICAL: JWT_SECRET_KEY must be set in production environment variables!"
        )

# 🔐 PASSWORD HASHING
BCRYPT_ROUNDS = 12  # Cost factor for bcrypt (higher = slower but more secure)

# 🔐 RATE LIMITING
RATE_LIMIT_ENABLED = True
LOGIN_RATE_LIMIT = "5/15minutes"  # 5 attempts per 15 minutes per IP
REGISTER_RATE_LIMIT = "10/1day"   # 10 registrations per day per IP

# 📧 OTP CONFIGURATION
OTP_LENGTH = 6
OTP_EXPIRATION_MINUTES = 10  # OTP valid for 10 minutes

# 🛡️ CORS CONFIGURATION
CORS_ORIGINS = [
    "http://localhost:5173",   # Dev frontend
    "http://localhost:3000",   # Dev admin panel
    "http://localhost:8000",   # API docs
]

# Add production origins if needed
PRODUCTION_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else []
if PRODUCTION_ORIGINS and PRODUCTION_ORIGINS != [""]:
    CORS_ORIGINS.extend(PRODUCTION_ORIGINS)

# 🗄️ DATABASE
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./noukpikplon.db")

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = ENVIRONMENT == "development"

# 💳 PAYPAL CONFIGURATION
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox or live

# 📧 EMAIL CONFIGURATION (for OTP - disabled in dev, uses console)
ENABLE_EMAIL_OTP = os.getenv("ENABLE_EMAIL_OTP", "false").lower() == "true"
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@noukpikplon.com")

# 🔐 SECURITY HEADERS
SECURE_COOKIES = ENVIRONMENT == "production"
COOKIE_SAMESITE = "strict"
COOKIE_DOMAIN = os.getenv("COOKIE_DOMAIN", None)

# API DOCUMENTATION
DOCS_ENABLED = ENVIRONMENT == "development"
REDOC_ENABLED = ENVIRONMENT == "development"

print(f"[CONFIG] Environment: {ENVIRONMENT}")
print(f"[CONFIG] DEBUG: {DEBUG}")
print(f"[CONFIG] CORS Origins: {CORS_ORIGINS}")
print(f"[CONFIG] Rate Limiting: {RATE_LIMIT_ENABLED}")

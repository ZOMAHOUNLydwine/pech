from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

from .routers import lessons, auth_simple, users, admin, payment
from .config import CORS_ORIGINS, DEBUG, ENVIRONMENT, DOCS_ENABLED, REDOC_ENABLED, RATE_LIMIT_ENABLED

# ============================================
# LOGGING SETUP
# ============================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================
# APP INITIALIZATION
# ============================================
app = FastAPI(
    title="Noukpikplon API",
    description="Secure Backend API for the Noukpikplon language learning platform",
    version="2.0.0",
    docs_url="/docs" if DOCS_ENABLED else None,
    redoc_url="/redoc" if REDOC_ENABLED else None,
    openapi_url="/openapi.json" if DOCS_ENABLED else None,
)

# ============================================
# RATE LIMITING
# ============================================
if RATE_LIMIT_ENABLED:
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, lambda request, exc: JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={"detail": "Too many requests. Please try again later."}
    ))
    logger.info("✅ Rate limiting enabled")

# ============================================
# MIDDLEWARE: CORS (Secure)
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,  # Explicit whitelist, never "*"
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
    expose_headers=["X-Total-Count"],
    max_age=3600,
)
logger.info(f"✅ CORS configured: {CORS_ORIGINS}")

# ============================================
# MIDDLEWARE: Trusted Host (Security)
# ============================================
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1"] if DEBUG else ["app.noukpikplon.com", "api.noukpikplon.com"]
)
logger.info("✅ Trusted host middleware enabled")

# ============================================
# MIDDLEWARE: Security Headers
# ============================================
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Prevent clickjacking
    response.headers["X-Frame-Options"] = "DENY"
    
    # Prevent MIME type sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"
    
    # Enable XSS filter in older browsers
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    # Strict Transport Security (HTTPS only in production)
    if not DEBUG:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    # Content Security Policy
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    
    return response

# ============================================
# EXCEPTION HANDLERS
# ============================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors securely
    - Don't expose internal database/system info
    - Provide helpful feedback for client
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Invalid request. Please check your input.",
            "errors": [
                {
                    "field": error.get("loc", [])[-1],
                    "message": error.get("msg", "")
                }
                for error in exc.errors()
            ] if DEBUG else []
        }
    )


# ============================================
# ROUTES
# ============================================

app.include_router(auth_simple.router)
app.include_router(users.router)
app.include_router(lessons.router)
app.include_router(lessons.units_router)
app.include_router(admin.router)
app.include_router(payment.router)

# ============================================
# HEALTH CHECK
# ============================================

@app.get("/health")
async def health_check():
    """Simple health check for monitoring"""
    return {
        "status": "ok",
        "environment": ENVIRONMENT,
        "version": "2.0.0"
    }


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to Noukpikplon API v2",
        "status": "running",
        "documentation": "/docs" if DOCS_ENABLED else "Documentation disabled in production",
        "version": "2.0.0"
    }


# ============================================
# STARTUP & SHUTDOWN
# ============================================

@app.on_event("startup")
async def startup_event():
    logger.info(f"🚀 Noukpikplon API starting (environment: {ENVIRONMENT})")
    logger.info(f"📚 Documentation: /docs" if DOCS_ENABLED else "📚 Documentation disabled")
    logger.info("✅ All middleware and security measures active")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Noukpikplon API shutting down")


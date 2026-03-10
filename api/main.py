from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import engine, Base
from routers import auth, users, content, leaderboard, admin

import logging
import traceback

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("\n" + "!" * 60, flush=True)
print("!!! PECH API IS RUNNING - VERSION: OTP_AND_LOGS_ENABLED !!!", flush=True)
print("!" * 60 + "\n", flush=True)

# Create database tables (Alembic will manage this in production, but this is a good safety for dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pech API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"\n>>> [MIDDLEWARE] Reçu {request.method} {request.url}", flush=True)
    try:
        response = await call_next(request)
        print(f">>> [MIDDLEWARE] Réponse {response.status_code}", flush=True)
        return response
    except Exception as e:
        print(f">>> [MIDDLEWARE] ERROR: {str(e)}", flush=True)
        print(traceback.format_exc(), flush=True)
        raise e

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"\n!!! GLOBAL EXCEPTION HANDLER !!!: {str(exc)}", flush=True)
    print(traceback.format_exc(), flush=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "message": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/test")
async def test_endpoint():
    print(">>> GET /test - OK", flush=True)
    return {"status": "ok", "message": "Backend is reachable"}

from routers import auth, users, content, leaderboard, admin

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(content.router)
app.include_router(leaderboard.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Pech API"}

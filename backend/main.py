from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import clients, references, finance


def create_app() -> FastAPI:
    app = FastAPI(
        title="Banking System API",
        description="API for Coursework Banking System",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # For development; strict in prod
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include Routers
    app.include_router(references.router, prefix="/api/v1")
    app.include_router(clients.router, prefix="/api/v1")
    app.include_router(finance.router, prefix="/api/v1")

    @app.get("/health", tags=["Health"])
    def health():
        return {"status": "ok"}

    return app


app = create_app()

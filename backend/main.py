from fastapi import FastAPI


def create_app() -> FastAPI:
    app = FastAPI(
        title="Coursework API",
        description="API для работы с БД в курсовой",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

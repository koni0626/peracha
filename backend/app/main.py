from datetime import datetime, timezone
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .diagnosis_service import should_suggest_board_for_diagnosis
from .rate_limits import (
    api_rate_windows,
    message_post_rate_windows,
    websocket_typing_windows,
)
from .routers.api_clients import router as api_clients_router
from .routers.auth import router as auth_router
from .routers.assist import router as assist_router
from .routers.boards import router as boards_router
from .routers.diagnoses import router as diagnoses_router
from .routers.external_api import router as external_api_router
from .routers.invitations import router as invitations_router
from .routers.messages import router as messages_router
from .routers.room_files import router as room_files_router
from .routers.rooms import router as rooms_router
from .routers.stamps import router as stamps_router
from .routers.tasks import router as tasks_router
from .routers.users import router as users_router
from .routers.websockets import router as websockets_router
from .routers.wiki import router as wiki_router
from .routers.work_tables import router as work_tables_router
from .schemas import HealthOut
from .schema_maintenance import ensure_runtime_schema
from .websocket_manager import manager


if settings.auto_create_tables:
    Base.metadata.create_all(bind=engine)
    ensure_runtime_schema(engine)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    await manager.start()
    try:
        yield
    finally:
        await manager.stop()


app = FastAPI(title="ペラチャ API", lifespan=lifespan)

allowed_frontend_origins = list(
    dict.fromkeys(
        [
            settings.frontend_origin,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(assist_router)
app.include_router(api_clients_router)
app.include_router(boards_router)
app.include_router(diagnoses_router)
app.include_router(external_api_router)
app.include_router(users_router)
app.include_router(rooms_router)
app.include_router(invitations_router)
app.include_router(messages_router)
app.include_router(room_files_router)
app.include_router(stamps_router)
app.include_router(tasks_router)
app.include_router(websockets_router)
app.include_router(wiki_router)
app.include_router(work_tables_router)


def health_payload() -> HealthOut:
    return HealthOut(status="ok", service="peracha-api", timestamp=datetime.now(timezone.utc))


@app.get("/health", response_model=HealthOut)
def health() -> HealthOut:
    return health_payload()


@app.get("/api/health", response_model=HealthOut)
def api_health() -> HealthOut:
    return health_payload()

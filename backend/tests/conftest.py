import os
import shutil
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


test_db_path = Path(tempfile.gettempdir()) / "sapiens_chat_pytest.db"
test_upload_path = Path(tempfile.gettempdir()) / "sapiens_chat_pytest_uploads"
os.environ["DATABASE_URL"] = f"sqlite:///{test_db_path.as_posix()}"
os.environ["AUTO_CREATE_TABLES"] = "true"
os.environ["FRONTEND_ORIGIN"] = "http://localhost:3000"
os.environ["SESSION_SECRET"] = "test-session-secret"
os.environ["INVITATION_TOKEN_SECRET"] = "test-invitation-secret"
os.environ["API_TOKEN_SECRET"] = "test-api-token-secret"
os.environ["WEBHOOK_SIGNING_SECRET"] = "test-webhook-secret"
os.environ["REDIS_URL"] = ""
os.environ["UPLOAD_DIR"] = str(test_upload_path)

from app.database import Base, engine  # noqa: E402
from app.main import api_rate_windows, app, message_post_rate_windows, websocket_typing_windows  # noqa: E402


@pytest.fixture(autouse=True)
def reset_database():
    shutil.rmtree(test_upload_path, ignore_errors=True)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    api_rate_windows.clear()
    message_post_rate_windows.clear()
    websocket_typing_windows.clear()
    yield
    api_rate_windows.clear()
    message_post_rate_windows.clear()
    websocket_typing_windows.clear()
    Base.metadata.drop_all(bind=engine)
    shutil.rmtree(test_upload_path, ignore_errors=True)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def registered_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test-user@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()
    room = client.post(
        "/api/rooms",
        json={"name": "test-room", "description": "Test room"},
    )
    assert room.status_code == 200, room.text
    data["rooms"] = [room.json()]
    return data

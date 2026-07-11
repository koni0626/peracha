from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str | None = None
    openai_model: str = "gpt-5.2"
    openai_image_model: str = "gpt-image-2"
    openai_image_timeout_seconds: float = 180.0
    database_url: str = "sqlite:///./sapiens_chat.db"
    session_secret: str = "dev-session-secret"
    invitation_token_secret: str = "dev-invitation-secret"
    api_token_secret: str = "dev-api-token-secret"
    webhook_signing_secret: str = "dev-webhook-secret"
    frontend_origin: str = "http://localhost:3000"
    redis_url: str | None = None
    auto_create_tables: bool = True
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from: str | None = None
    smtp_use_tls: bool = True
    api_rate_limit_per_minute: int = 120
    message_post_rate_limit_per_minute: int = 30
    websocket_max_connections_per_room: int = 200
    websocket_max_connections_per_user: int = 5
    websocket_typing_rate_limit_per_minute: int = 60
    upload_dir: str = "./uploads"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()

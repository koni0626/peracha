import json

from .models import ApiClient, ApiToken, AuditLog, WebhookEndpoint
from .api_integration_schemas import ApiClientOut, ApiTokenOut, AuditLogOut, WebhookOut
from .serializer_utils import json_list


def api_client_out(client: ApiClient) -> ApiClientOut:
    return ApiClientOut(
        id=client.id,
        room_id=client.room_id,
        name=client.name,
        client_type=client.client_type,
        scopes=json_list(client.scopes_json),
        active=client.active == "true",
        created_at=client.created_at,
        updated_at=client.updated_at,
    )


def api_token_out(token: ApiToken, plain_token: str | None = None) -> ApiTokenOut:
    return ApiTokenOut(
        id=token.id,
        api_client_id=token.api_client_id,
        name=token.name,
        token=plain_token,
        last_used_at=token.last_used_at,
        expires_at=token.expires_at,
        revoked_at=token.revoked_at,
        created_at=token.created_at,
    )


def audit_log_out(log: AuditLog) -> AuditLogOut:
    return AuditLogOut(
        id=log.id,
        api_client_id=log.api_client_id,
        api_token_id=log.api_token_id,
        room_id=log.room_id,
        actor_type=log.actor_type,
        action=log.action,
        method=log.method,
        path=log.path,
        resource_type=log.resource_type,
        resource_id=log.resource_id,
        status=log.status,
        metadata=json.loads(log.metadata_json) if log.metadata_json else None,
        created_at=log.created_at,
    )


def webhook_out(webhook: WebhookEndpoint) -> WebhookOut:
    return WebhookOut(
        id=webhook.id,
        room_id=webhook.room_id,
        url=webhook.url,
        events=json_list(webhook.events_json),
        active=webhook.active == "true",
        created_at=webhook.created_at,
    )

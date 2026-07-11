import io
import struct
import zipfile
import zlib

import pytest


def make_docx_bytes(text: str) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        archive.writestr(
            "word/document.xml",
            f"""<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body><w:p><w:r><w:t>{text}</w:t></w:r></w:p></w:body>
</w:document>""",
        )
    return buffer.getvalue()


def make_reference_png_bytes(width: int = 128, height: int = 128) -> bytes:
    def chunk(tag: bytes, data: bytes) -> bytes:
        checksum = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", checksum)

    rows = []
    for y in range(height):
        row = bytearray([0])
        for x in range(width):
            if (x - width // 2) ** 2 + (y - height // 2) ** 2 < (min(width, height) // 3) ** 2:
                row.extend([30, 120, 230])
            else:
                row.extend([255, 255, 255])
        rows.append(bytes(row))

    raw = b"".join(rows)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw))
        + chunk(b"IEND", b"")
    )


def test_health_endpoint(client):
    for path in ("/health", "/api/health"):
        response = client.get(path)
        assert response.status_code == 200, response.text
        payload = response.json()
        assert payload["status"] == "ok"
        assert payload["service"] == "peracha-api"
        assert payload["timestamp"]


def test_register_starts_without_default_room(client):
    response = client.post(
        "/api/auth/register",
        json={"name": "No General", "email": "no-general@example.com", "password": "password123"},
    )
    assert response.status_code == 200, response.text
    assert response.json()["rooms"] == []


def test_auth_invitation_and_logout(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    invitation = client.post(
        f"/api/rooms/{room_id}/invitations",
        json={"email": "guest@example.com", "role": "member"},
    )
    assert invitation.status_code == 200, invitation.text
    invitation_payload = invitation.json()
    assert invitation_payload["token"]
    assert invitation_payload["accept_url"].startswith("http://localhost:3000/?invite_token=")
    assert invitation_payload["email_sent"] is False
    assert invitation_payload["email_error"] is None

    invitations = client.get(f"/api/rooms/{room_id}/invitations")
    assert invitations.status_code == 200, invitations.text
    invitation_items = invitations.json()["items"]
    assert invitation_items[0]["id"] == invitation_payload["id"]
    assert invitation_items[0]["token"] is None
    assert invitation_items[0]["status"] == "pending"

    revoked = client.delete(f"/api/rooms/{room_id}/invitations/{invitation_payload['id']}")
    assert revoked.status_code == 200, revoked.text
    assert revoked.json()["status"] == "revoked"

    accept_revoked = client.post(f"/api/invitations/{invitation_payload['token']}/accept")
    assert accept_revoked.status_code == 400

    assert client.get("/api/auth/me").status_code == 200
    logout = client.post("/api/auth/logout")
    assert logout.status_code == 200, logout.text
    assert client.get("/api/auth/me").status_code == 401


def test_room_members_include_invited_existing_user(client, registered_user):
    from fastapi.testclient import TestClient

    from app.main import app

    room_id = registered_user["rooms"][0]["id"]

    with TestClient(app) as guest_client:
        guest = guest_client.post(
            "/api/auth/register",
            json={"name": "Guest User", "email": "guest-member@example.com", "password": "password123"},
        )
    assert guest.status_code == 200, guest.text

    search = client.get(f"/api/users/search?q=guest&exclude_room_id={room_id}")
    assert search.status_code == 200, search.text
    search_items = search.json()["items"]
    assert any(item["email"] == "guest-member@example.com" for item in search_items)
    guest_user = next(item for item in search_items if item["email"] == "guest-member@example.com")

    added_member = client.post(
        f"/api/rooms/{room_id}/members",
        json={"user_id": guest_user["id"], "role": "member"},
    )
    assert added_member.status_code == 200, added_member.text
    assert added_member.json()["user"]["email"] == "guest-member@example.com"

    search_after_add = client.get(f"/api/users/search?q=guest&exclude_room_id={room_id}")
    assert search_after_add.status_code == 200, search_after_add.text
    assert all(item["email"] != "guest-member@example.com" for item in search_after_add.json()["items"])

    members = client.get(f"/api/rooms/{room_id}/members")
    assert members.status_code == 200, members.text
    member_items = members.json()["items"]
    member_emails = {item["user"]["email"] for item in member_items}
    assert {"test-user@example.com", "guest-member@example.com"}.issubset(member_emails)

    guest_member = next(item for item in member_items if item["user"]["email"] == "guest-member@example.com")
    updated = client.patch(f"/api/rooms/{room_id}/members/{guest_member['id']}", json={"role": "admin"})
    assert updated.status_code == 200, updated.text
    assert updated.json()["role"] == "admin"

    owner_member = next(item for item in member_items if item["user"]["email"] == "test-user@example.com")
    demote_last_owner = client.patch(f"/api/rooms/{room_id}/members/{owner_member['id']}", json={"role": "member"})
    assert demote_last_owner.status_code == 400, demote_last_owner.text

    removed = client.delete(f"/api/rooms/{room_id}/members/{guest_member['id']}")
    assert removed.status_code == 200, removed.text
    assert removed.json()["user"]["email"] == "guest-member@example.com"

    members_after_remove = client.get(f"/api/rooms/{room_id}/members")
    assert members_after_remove.status_code == 200, members_after_remove.text
    member_emails_after_remove = {item["user"]["email"] for item in members_after_remove.json()["items"]}
    assert "guest-member@example.com" not in member_emails_after_remove


def test_room_delete_requires_owner_and_removes_room(client, registered_user):
    from fastapi.testclient import TestClient

    from app.main import app

    room_id = registered_user["rooms"][0]["id"]
    with TestClient(app) as guest_client:
        guest = guest_client.post(
            "/api/auth/register",
            json={"name": "Delete Guest", "email": "delete-guest@example.com", "password": "password123"},
        )
        assert guest.status_code == 200, guest.text
        guest_user_id = guest.json()["user"]["id"]

        added = client.post(
            f"/api/rooms/{room_id}/members",
            json={"user_id": guest_user_id, "role": "member"},
        )
        assert added.status_code == 200, added.text

        guest_delete = guest_client.delete(f"/api/rooms/{room_id}")
        assert guest_delete.status_code == 403, guest_delete.text

    created_message = client.post(
        f"/api/rooms/{room_id}/messages",
        json={"body": "delete target message", "diagnose_after_post": False},
    )
    assert created_message.status_code == 200, created_message.text

    deleted = client.delete(f"/api/rooms/{room_id}")
    assert deleted.status_code == 200, deleted.text
    assert deleted.json()["id"] == room_id

    me = client.get("/api/auth/me")
    assert me.status_code == 200, me.text
    assert all(room["id"] != room_id for room in me.json()["rooms"])
    assert client.get(f"/api/rooms/{room_id}/messages").status_code == 403


def test_room_update_renames_room_for_admins(client, registered_user):
    from fastapi.testclient import TestClient

    from app.main import app

    room_id = registered_user["rooms"][0]["id"]
    updated = client.patch(f"/api/rooms/{room_id}", json={"name": "Renamed Room"})
    assert updated.status_code == 200, updated.text
    assert updated.json()["name"] == "Renamed Room"

    with TestClient(app) as guest_client:
        guest = guest_client.post(
            "/api/auth/register",
            json={"name": "Rename Guest", "email": "rename-guest@example.com", "password": "password123"},
        )
        assert guest.status_code == 200, guest.text
        guest_user_id = guest.json()["user"]["id"]

        added = client.post(
            f"/api/rooms/{room_id}/members",
            json={"user_id": guest_user_id, "role": "member"},
        )
        assert added.status_code == 200, added.text

        denied = guest_client.patch(f"/api/rooms/{room_id}", json={"name": "Member Rename"})
        assert denied.status_code == 403, denied.text

    me = client.get("/api/auth/me")
    assert me.status_code == 200, me.text
    assert any(room["id"] == room_id and room["name"] == "Renamed Room" for room in me.json()["rooms"])


def test_work_table_create_columns_records_and_update_cell(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    created = client.post(f"/api/rooms/{room_id}/work-tables", json={"name": "開発タスク"})
    assert created.status_code == 200, created.text
    table = created.json()
    assert table["name"] == "開発タスク"
    assert table["description_markdown"] is None
    assert [column["name"] for column in table["columns"]] == ["タイトル", "状態", "進捗率", "開始日", "終了日", "説明"]

    updated_table = client.patch(
        f"/api/work-tables/{table['id']}",
        json={"description_markdown": "## 管理対象\n- 開発タスク\n- 不具合"},
    )
    assert updated_table.status_code == 200, updated_table.text
    assert updated_table.json()["description_markdown"] == "## 管理対象\n- 開発タスク\n- 不具合"

    duplicate = client.post(f"/api/rooms/{room_id}/work-tables", json={"name": "開発タスク"})
    assert duplicate.status_code == 400

    second_table = client.post(f"/api/rooms/{room_id}/work-tables", json={"name": "障害一覧"})
    assert second_table.status_code == 200, second_table.text
    second_table_payload = second_table.json()

    table_order = client.patch(
        f"/api/rooms/{room_id}/work-tables/order",
        json={"table_ids": [second_table_payload["id"], table["id"]]},
    )
    assert table_order.status_code == 200, table_order.text
    assert [item["id"] for item in table_order.json()["items"][:2]] == [second_table_payload["id"], table["id"]]

    added_column = client.post(
        f"/api/work-tables/{table['id']}/columns",
        json={"name": "見積", "field_type": "number", "options": []},
    )
    assert added_column.status_code == 200, added_column.text
    estimate_column = added_column.json()
    assert estimate_column["field_type"] == "number"

    updated_column = client.patch(
        f"/api/work-tables/{table['id']}/columns/{estimate_column['id']}",
        json={"name": "見積工数", "field_type": "select", "options": ["1", "3", "5"]},
    )
    assert updated_column.status_code == 200, updated_column.text
    estimate_column = updated_column.json()
    assert estimate_column["name"] == "見積工数"
    assert estimate_column["field_type"] == "select"
    assert estimate_column["options"] == ["1", "3", "5"]

    title_column = next(column for column in table["columns"] if column["name"] == "タイトル")
    created_record = client.post(
        f"/api/work-tables/{table['id']}/records",
        json={"values": {title_column["id"]: "ログイン修正", estimate_column["id"]: 3}},
    )
    assert created_record.status_code == 200, created_record.text
    record = created_record.json()
    assert record["values"][title_column["id"]] == "ログイン修正"
    assert record["values"][estimate_column["id"]] == 3

    updated_record = client.patch(
        f"/api/work-tables/{table['id']}/records/{record['id']}",
        json={"values": {estimate_column["id"]: 5}},
    )
    assert updated_record.status_code == 200, updated_record.text
    assert updated_record.json()["values"][estimate_column["id"]] == 5

    file_column = client.post(
        f"/api/work-tables/{table['id']}/columns",
        json={"name": "File", "field_type": "file", "options": []},
    )
    assert file_column.status_code == 200, file_column.text
    file_column_payload = file_column.json()
    file_value = {
        "kind": "file",
        "file": {
            "id": "file_sample",
            "room_id": room_id,
            "original_name": "sample.pdf",
            "content_type": "application/pdf",
            "size_bytes": 123,
            "download_url": f"/api/rooms/{room_id}/files/file_sample/download",
            "preview_url": f"/api/rooms/{room_id}/files/file_sample/download",
            "preview_kind": "pdf",
            "created_at": "2026-01-01T00:00:00Z",
        },
    }
    file_record = client.patch(
        f"/api/work-tables/{table['id']}/records/{record['id']}",
        json={"values": {file_column_payload["id"]: file_value}},
    )
    assert file_record.status_code == 200, file_record.text
    assert file_record.json()["values"][file_column_payload["id"]]["file"]["original_name"] == "sample.pdf"

    second_record = client.post(
        f"/api/work-tables/{table['id']}/records",
        json={"values": {title_column["id"]: "画面修正", estimate_column["id"]: 1}},
    )
    assert second_record.status_code == 200, second_record.text
    second_record_payload = second_record.json()

    record_order = client.patch(
        f"/api/work-tables/{table['id']}/records/order",
        json={"record_ids": [second_record_payload["id"], record["id"]]},
    )
    assert record_order.status_code == 200, record_order.text
    assert [item["id"] for item in record_order.json()["records"][:2]] == [second_record_payload["id"], record["id"]]

    history = client.post(f"/api/work-tables/{table['id']}/records/{record['id']}/histories")
    assert history.status_code == 200, history.text
    history_payload = history.json()
    history_record = next(item for item in history_payload["records"] if item["parent_record_id"] == record["id"])
    assert history_record["values"][title_column["id"]] == "ログイン修正"
    assert history_record["values"][estimate_column["id"]] == 5

    edit_history = client.patch(
        f"/api/work-tables/{table['id']}/records/{history_record['id']}",
        json={"values": {estimate_column["id"]: 1}},
    )
    assert edit_history.status_code == 400

    reordered = client.patch(
        f"/api/work-tables/{table['id']}/columns/order",
        json={"column_ids": [estimate_column["id"], *[column["id"] for column in table["columns"]]]},
    )
    assert reordered.status_code == 200, reordered.text
    assert reordered.json()["columns"][0]["id"] == estimate_column["id"]

    deleted = client.delete(f"/api/work-tables/{table['id']}/columns/{estimate_column['id']}")
    assert deleted.status_code == 200, deleted.text
    deleted_table = deleted.json()
    assert all(column["id"] != estimate_column["id"] for column in deleted_table["columns"])
    assert estimate_column["id"] not in deleted_table["records"][0]["values"]

    listed = client.get(f"/api/rooms/{room_id}/work-tables")
    assert listed.status_code == 200, listed.text
    listed_table = next(item for item in listed.json()["items"] if item["id"] == table["id"])
    assert listed_table["description_markdown"] == "## 管理対象\n- 開発タスク\n- 不具合"
    assert all(column["id"] != estimate_column["id"] for column in listed_table["columns"])

    deleted_table_response = client.delete(f"/api/work-tables/{table['id']}")
    assert deleted_table_response.status_code == 200, deleted_table_response.text
    assert deleted_table_response.json()["id"] == table["id"]

    listed_after_delete = client.get(f"/api/rooms/{room_id}/work-tables")
    assert listed_after_delete.status_code == 200, listed_after_delete.text
    assert all(item["id"] != table["id"] for item in listed_after_delete.json()["items"])

    recreated = client.post(f"/api/rooms/{room_id}/work-tables", json={"name": "開発タスク"})
    assert recreated.status_code == 200, recreated.text


def test_room_wiki_articles_crud(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    created = client.post(
        f"/api/rooms/{room_id}/wiki-articles",
        json={"title": "Release Notes", "body_markdown": "# Release\n- First draft"},
    )
    assert created.status_code == 200, created.text
    article = created.json()
    assert article["title"] == "Release Notes"
    assert article["body_markdown"] == "# Release\n- First draft"

    listed = client.get(f"/api/rooms/{room_id}/wiki-articles")
    assert listed.status_code == 200, listed.text
    assert any(item["id"] == article["id"] for item in listed.json()["items"])

    updated = client.patch(
        f"/api/wiki-articles/{article['id']}",
        json={"title": "Release Notes v2", "body_markdown": "## Updated"},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["title"] == "Release Notes v2"
    assert updated.json()["body_markdown"] == "## Updated"

    deleted = client.delete(f"/api/wiki-articles/{article['id']}")
    assert deleted.status_code == 200, deleted.text

    listed_after_delete = client.get(f"/api/rooms/{room_id}/wiki-articles")
    assert listed_after_delete.status_code == 200, listed_after_delete.text
    assert all(item["id"] != article["id"] for item in listed_after_delete.json()["items"])


def test_message_attachments_idempotency_and_history(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    attachment = {
        "title": "proposal-v2.pdf",
        "url": "https://example.com/proposal-v2.pdf",
        "content_type": "application/pdf",
        "size_bytes": 12345,
        "description": "Executive proposal",
    }

    first = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "message-attachment-001"},
        json={
            "body": "Please review the attached proposal.",
            "attachments": [attachment],
            "diagnose_after_post": False,
        },
    )
    assert first.status_code == 200, first.text
    first_payload = first.json()
    assert first_payload["attachments"][0]["title"] == "proposal-v2.pdf"
    assert first_payload["metadata"]["attachments"][0]["url"] == attachment["url"]

    second = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "message-attachment-001"},
        json={"body": "Duplicate send should not create a new row.", "diagnose_after_post": False},
    )
    assert second.status_code == 200, second.text
    assert second.json()["id"] == first_payload["id"]

    history = client.get(f"/api/rooms/{room_id}/messages")
    assert history.status_code == 200, history.text
    items = history.json()["items"]
    assert len(items) == 1
    assert items[0]["attachments"][0]["title"] == "proposal-v2.pdf"


def test_room_file_upload_list_download_and_preview(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    pdf_upload = client.post(
        f"/api/rooms/{room_id}/files",
        files={"file": ("proposal.pdf", b"%PDF-1.4\nsample", "application/pdf")},
    )
    assert pdf_upload.status_code == 200, pdf_upload.text
    pdf_payload = pdf_upload.json()
    assert pdf_payload["original_name"] == "proposal.pdf"
    assert pdf_payload["preview_kind"] == "pdf"
    assert pdf_payload["download_url"].endswith(f"/files/{pdf_payload['id']}/download")

    download = client.get(f"/api/rooms/{room_id}/files/{pdf_payload['id']}/download")
    assert download.status_code == 200, download.text
    assert download.content.startswith(b"%PDF-1.4")

    docx_upload = client.post(
        f"/api/rooms/{room_id}/files",
        files={"file": ("notes.docx", make_docx_bytes("重要な会話の要点"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )
    assert docx_upload.status_code == 200, docx_upload.text
    docx_payload = docx_upload.json()
    assert docx_payload["preview_kind"] == "docx"

    preview = client.get(f"/api/rooms/{room_id}/files/{docx_payload['id']}/preview")
    assert preview.status_code == 200, preview.text
    assert "重要な会話の要点" in preview.json()["text"]

    files = client.get(f"/api/rooms/{room_id}/files")
    assert files.status_code == 200, files.text
    file_ids = {item["id"] for item in files.json()["items"]}
    assert {pdf_payload["id"], docx_payload["id"]}.issubset(file_ids)


def test_image_file_preview_kind_uses_extension_when_content_type_is_missing(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    upload = client.post(
        f"/api/rooms/{room_id}/files",
        files={"file": ("screenshot.png", b"\x89PNG\r\n\x1a\nsample", "application/octet-stream")},
    )
    assert upload.status_code == 200, upload.text
    payload = upload.json()
    assert payload["preview_kind"] == "image"
    assert payload["preview_url"] == payload["download_url"]


def test_video_file_preview_kind_uses_mime_and_downloads_inline(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    upload = client.post(
        f"/api/rooms/{room_id}/files",
        files={"file": ("demo.mp4", b"\x00\x00\x00\x18ftypmp42sample", "video/mp4")},
    )
    assert upload.status_code == 200, upload.text
    payload = upload.json()
    assert payload["preview_kind"] == "video"
    assert payload["preview_url"] == payload["download_url"]

    download = client.get(f"/api/rooms/{room_id}/files/{payload['id']}/download")
    assert download.status_code == 200, download.text
    assert download.headers["content-type"].startswith("video/mp4")
    assert "inline" in download.headers["content-disposition"]


def test_user_avatar_upload_and_message_avatar_url(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    avatar = client.post(
        "/api/users/me/avatar",
        files={"file": ("avatar.png", b"\x89PNG\r\n\x1a\navatar", "image/png")},
    )
    assert avatar.status_code == 200, avatar.text
    assert f"/api/users/{registered_user['user']['id']}/avatar?v=" in avatar.json()["avatar_url"]

    avatar_image = client.get(avatar.json()["avatar_url"])
    assert avatar_image.status_code == 200, avatar_image.text
    assert avatar_image.content.startswith(b"\x89PNG")

    oversized_avatar = client.post(
        "/api/users/me/avatar",
        files={"file": ("too-large.png", b"0" * (8 * 1024 * 1024 + 1), "image/png")},
    )
    assert oversized_avatar.status_code == 413, oversized_avatar.text
    avatar_after_failed_upload = client.get(avatar.json()["avatar_url"])
    assert avatar_after_failed_upload.status_code == 200, avatar_after_failed_upload.text
    assert avatar_after_failed_upload.content.startswith(b"\x89PNG")

    message = client.post(
        f"/api/rooms/{room_id}/messages",
        json={"body": "顔アイコン確認", "diagnose_after_post": False},
    )
    assert message.status_code == 200, message.text
    assert message.json()["sender_avatar_url"] == avatar.json()["avatar_url"]


def test_stamp_folder_upload_and_message_use_link_without_room_file(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    before_files = client.get(f"/api/rooms/{room_id}/files")
    assert before_files.status_code == 200, before_files.text
    before_count = len(before_files.json()["items"])

    folder = client.post("/api/stamps/folders", json={"name": "リアクション"})
    assert folder.status_code == 200, folder.text
    folder_payload = folder.json()

    uploaded = client.post(
        "/api/stamps/upload",
        data={"title": "いいね", "folder_id": folder_payload["id"]},
        files={"file": ("stamp.png", make_reference_png_bytes(), "image/png")},
    )
    assert uploaded.status_code == 200, uploaded.text
    stamp_payload = uploaded.json()
    assert stamp_payload["folder_id"] == folder_payload["id"]
    assert stamp_payload["image_url"].startswith(f"/api/stamps/{stamp_payload['id']}/image?v=")
    assert stamp_payload["image_model"] == "upload"
    assert stamp_payload["reference_used"] is False

    stamp_image = client.get(stamp_payload["image_url"])
    assert stamp_image.status_code == 200, stamp_image.text
    assert stamp_image.headers["content-type"].startswith("image/png")

    stamps = client.get("/api/stamps")
    assert stamps.status_code == 200, stamps.text
    assert stamps.json()["items"][0]["id"] == stamp_payload["id"]

    folders = client.get("/api/stamps/folders")
    assert folders.status_code == 200, folders.text
    assert folders.json()["items"][0]["stamp_count"] == 1

    message = client.post(
        f"/api/rooms/{room_id}/messages",
        json={
            "body": "スタンプ確認",
            "diagnose_after_post": False,
            "stamps": [
                {
                    "id": stamp_payload["id"],
                    "title": stamp_payload["title"],
                    "image_url": stamp_payload["image_url"],
                }
            ],
        },
    )
    assert message.status_code == 200, message.text
    assert message.json()["stamps"][0]["id"] == stamp_payload["id"]

    after_files = client.get(f"/api/rooms/{room_id}/files")
    assert after_files.status_code == 200, after_files.text
    assert len(after_files.json()["items"]) == before_count


def test_stamp_upload_and_message_use_link_without_room_file(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    before_files = client.get(f"/api/rooms/{room_id}/files")
    assert before_files.status_code == 200, before_files.text
    before_count = len(before_files.json()["items"])

    uploaded = client.post(
        "/api/stamps/upload",
        data={"title": "手元のスタンプ"},
        files={"file": ("stamp.png", make_reference_png_bytes(), "image/png")},
    )
    assert uploaded.status_code == 200, uploaded.text
    stamp_payload = uploaded.json()
    assert stamp_payload["title"] == "手元のスタンプ"
    assert stamp_payload["image_model"] == "upload"
    assert stamp_payload["reference_used"] is False
    assert stamp_payload["image_url"].startswith(f"/api/stamps/{stamp_payload['id']}/image?v=")

    stamp_image = client.get(stamp_payload["image_url"])
    assert stamp_image.status_code == 200, stamp_image.text
    assert stamp_image.headers["content-type"].startswith("image/png")
    assert stamp_image.content.startswith(b"\x89PNG")

    stamps = client.get("/api/stamps")
    assert stamps.status_code == 200, stamps.text
    assert stamps.json()["items"][0]["id"] == stamp_payload["id"]

    message = client.post(
        f"/api/rooms/{room_id}/messages",
        json={
            "body": "アップロードスタンプ確認",
            "diagnose_after_post": False,
            "stamps": [
                {
                    "id": stamp_payload["id"],
                    "title": stamp_payload["title"],
                    "image_url": stamp_payload["image_url"],
                }
            ],
        },
    )
    assert message.status_code == 200, message.text
    assert message.json()["stamps"][0]["id"] == stamp_payload["id"]

    after_files = client.get(f"/api/rooms/{room_id}/files")
    assert after_files.status_code == 200, after_files.text
    assert len(after_files.json()["items"]) == before_count


def test_stamp_image_is_visible_to_invited_room_member(client, registered_user):
    from fastapi.testclient import TestClient

    from app.main import app

    room_id = registered_user["rooms"][0]["id"]
    uploaded = client.post(
        "/api/stamps/upload",
        data={"title": "共有スタンプ"},
        files={"file": ("stamp.png", make_reference_png_bytes(), "image/png")},
    )
    assert uploaded.status_code == 200, uploaded.text
    stamp_payload = uploaded.json()

    with TestClient(app) as guest_client:
        guest = guest_client.post(
            "/api/auth/register",
            json={"name": "Stamp Receiver", "email": "stamp-receiver@example.com", "password": "password123"},
        )
        assert guest.status_code == 200, guest.text

        search = client.get(f"/api/users/search?q=stamp-receiver&exclude_room_id={room_id}")
        assert search.status_code == 200, search.text
        guest_user = next(item for item in search.json()["items"] if item["email"] == "stamp-receiver@example.com")
        added_member = client.post(
            f"/api/rooms/{room_id}/members",
            json={"user_id": guest_user["id"], "role": "member"},
        )
        assert added_member.status_code == 200, added_member.text

        stamp_image = guest_client.get(stamp_payload["image_url"])
        assert stamp_image.status_code == 200, stamp_image.text
        assert stamp_image.headers["content-type"].startswith("image/png")
        assert stamp_image.content.startswith(b"\x89PNG")


def test_stamp_delete_removes_stamp_from_library(client, registered_user):
    uploaded = client.post(
        "/api/stamps/upload",
        data={"title": "削除するスタンプ"},
        files={"file": ("stamp.png", make_reference_png_bytes(), "image/png")},
    )
    assert uploaded.status_code == 200, uploaded.text
    stamp_payload = uploaded.json()

    deleted = client.delete(f"/api/stamps/{stamp_payload['id']}")
    assert deleted.status_code == 204, deleted.text

    stamps = client.get("/api/stamps")
    assert stamps.status_code == 200, stamps.text
    assert all(item["id"] != stamp_payload["id"] for item in stamps.json()["items"])

    stamp_image = client.get(stamp_payload["image_url"])
    assert stamp_image.status_code == 404, stamp_image.text


def test_stamp_folder_delete_removes_contained_stamps(client, registered_user):
    folder = client.post("/api/stamps/folders", json={"name": "削除対象"})
    assert folder.status_code == 200, folder.text
    folder_payload = folder.json()

    uploaded = client.post(
        "/api/stamps/upload",
        data={"folder_id": folder_payload["id"]},
        files={"file": ("stamp.png", make_reference_png_bytes(), "image/png")},
    )
    assert uploaded.status_code == 200, uploaded.text
    stamp_payload = uploaded.json()

    deleted = client.delete(f"/api/stamps/folders/{folder_payload['id']}")
    assert deleted.status_code == 204, deleted.text

    folders = client.get("/api/stamps/folders")
    assert folders.status_code == 200, folders.text
    assert all(item["id"] != folder_payload["id"] for item in folders.json()["items"])

    stamps = client.get("/api/stamps")
    assert stamps.status_code == 200, stamps.text
    assert all(item["id"] != stamp_payload["id"] for item in stamps.json()["items"])

    stamp_image = client.get(stamp_payload["image_url"])
    assert stamp_image.status_code == 404, stamp_image.text


def test_message_mentions_are_serialized_in_metadata(client, registered_user):
    from fastapi.testclient import TestClient

    from app.main import app

    room_id = registered_user["rooms"][0]["id"]
    with TestClient(app) as guest_client:
        guest = guest_client.post(
            "/api/auth/register",
            json={"name": "Mention Guest", "email": "mention-guest@example.com", "password": "password123"},
        )
        assert guest.status_code == 200, guest.text
        guest_user = guest.json()["user"]

    added = client.post(
        f"/api/rooms/{room_id}/members",
        json={"user_id": guest_user["id"], "role": "member"},
    )
    assert added.status_code == 200, added.text

    message = client.post(
        f"/api/rooms/{room_id}/messages",
        json={"body": "@Mention Guest 確認お願いします。 @here", "diagnose_after_post": False},
    )
    assert message.status_code == 200, message.text
    metadata = message.json()["metadata"]
    assert metadata["mention_all"] is True
    assert metadata["mentions"][0]["id"] == guest_user["id"]


def test_message_reply_metadata_is_serialized(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    parent = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "reply-parent-001"},
        json={"body": "この資料を確認してください。", "diagnose_after_post": False},
    )
    assert parent.status_code == 200, parent.text
    parent_payload = parent.json()

    reply = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "reply-child-001"},
        json={
            "body": "確認しました。",
            "reply_to_message_id": parent_payload["id"],
            "diagnose_after_post": False,
        },
    )
    assert reply.status_code == 200, reply.text
    reply_payload = reply.json()
    assert reply_payload["reply_to"]["id"] == parent_payload["id"]
    assert reply_payload["reply_to"]["sender_name"] == parent_payload["sender_name"]
    assert "この資料" in reply_payload["reply_to"]["body"]
    assert reply_payload["metadata"]["reply_to_message_id"] == parent_payload["id"]

    history = client.get(f"/api/rooms/{room_id}/messages")
    assert history.status_code == 200, history.text
    history_reply = next(item for item in history.json()["items"] if item["id"] == reply_payload["id"])
    assert history_reply["reply_to"]["id"] == parent_payload["id"]


def test_thread_messages_are_listed_separately(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    parent = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "thread-parent-001"},
        json={"body": "スレッド元です。", "diagnose_after_post": False},
    )
    assert parent.status_code == 200, parent.text
    parent_payload = parent.json()

    child = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "thread-child-001"},
        json={
            "body": "スレッド返信です。",
            "thread_id": parent_payload["id"],
            "reply_to_message_id": parent_payload["id"],
            "diagnose_after_post": False,
        },
    )
    assert child.status_code == 200, child.text

    main_history = client.get(f"/api/rooms/{room_id}/messages")
    assert main_history.status_code == 200, main_history.text
    main_items = main_history.json()["items"]
    assert any(item["id"] == parent_payload["id"] and item["thread_reply_count"] == 1 for item in main_items)
    assert all(item["id"] != child.json()["id"] for item in main_items)

    thread_history = client.get(f"/api/rooms/{room_id}/messages?thread_id={parent_payload['id']}")
    assert thread_history.status_code == 200, thread_history.text
    thread_items = thread_history.json()["items"]
    assert [item["id"] for item in thread_items] == [child.json()["id"]]


def test_message_read_state_updates_sender_receipt(client, registered_user):
    from fastapi.testclient import TestClient

    from app.main import app

    room_id = registered_user["rooms"][0]["id"]
    with TestClient(app) as guest_client:
        guest = guest_client.post(
            "/api/auth/register",
            json={"name": "Read Guest", "email": "read-guest@example.com", "password": "password123"},
        )
        assert guest.status_code == 200, guest.text
        guest_user_id = guest.json()["user"]["id"]

        added = client.post(
            f"/api/rooms/{room_id}/members",
            json={"user_id": guest_user_id, "role": "member"},
        )
        assert added.status_code == 200, added.text

        message = client.post(
            f"/api/rooms/{room_id}/messages",
            json={"body": "既読確認をお願いします。", "diagnose_after_post": False},
        )
        assert message.status_code == 200, message.text
        message_payload = message.json()
        assert message_payload["read_status"] == "未読"
        assert message_payload["read_count"] == 0

        marked = guest_client.post(
            f"/api/rooms/{room_id}/read-state",
            json={"message_id": message_payload["id"]},
        )
        assert marked.status_code == 200, marked.text
        guest_view = next(item for item in marked.json()["items"] if item["id"] == message_payload["id"])
        assert guest_view["read_status"] == "既読"

    owner_history = client.get(f"/api/rooms/{room_id}/messages")
    assert owner_history.status_code == 200, owner_history.text
    owner_view = next(item for item in owner_history.json()["items"] if item["id"] == message_payload["id"])
    assert owner_view["read_status"] == "既読"
    assert owner_view["read_count"] == 1


def test_room_context_search_returns_messages_and_tasks(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    message = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "context-message-001"},
        json={"body": "経営者向けシステムのプレゼン資料は明日までに更新します。", "diagnose_after_post": False},
    )
    assert message.status_code == 200, message.text

    task = client.post(
        "/api/tasks",
        json={
            "room_id": room_id,
            "title": "プレゼン資料レビュー",
            "completion_condition": "経営者向けシステムの資料を確認する",
        },
    )
    assert task.status_code == 200, task.text

    contexts = client.get(f"/api/rooms/{room_id}/contexts?q=プレゼン資料&limit=5")
    assert contexts.status_code == 200, contexts.text
    items = contexts.json()["items"]
    assert {item["type"] for item in items} >= {"message", "task"}
    assert any(item["id"] == message.json()["id"] for item in items)
    assert any(item["id"] == task.json()["id"] for item in items)


def test_user_message_post_rate_limit_allows_idempotent_retry(client, registered_user):
    from app.config import settings
    from app.main import message_post_rate_windows

    room_id = registered_user["rooms"][0]["id"]
    original_limit = settings.message_post_rate_limit_per_minute
    settings.message_post_rate_limit_per_minute = 1
    message_post_rate_windows.clear()
    try:
        first = client.post(
            f"/api/rooms/{room_id}/messages",
            headers={"Idempotency-Key": "message-rate-001"},
            json={"body": "First message.", "diagnose_after_post": False},
        )
        assert first.status_code == 200, first.text

        retry = client.post(
            f"/api/rooms/{room_id}/messages",
            headers={"Idempotency-Key": "message-rate-001"},
            json={"body": "Retry should return the original message.", "diagnose_after_post": False},
        )
        assert retry.status_code == 200, retry.text
        assert retry.json()["id"] == first.json()["id"]

        limited = client.post(
            f"/api/rooms/{room_id}/messages",
            headers={"Idempotency-Key": "message-rate-002"},
            json={"body": "Second unique message.", "diagnose_after_post": False},
        )
        assert limited.status_code == 429
        assert limited.json()["detail"] == "Message post rate limit exceeded"
        assert limited.headers["Retry-After"]
    finally:
        settings.message_post_rate_limit_per_minute = original_limit
        message_post_rate_windows.clear()


def test_plain_chat_does_not_run_automatic_facilitator(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    response = client.post(
        f"/api/rooms/{room_id}/messages",
        headers={"Idempotency-Key": "plain-chat-001"},
        json={"body": "これはテストです。テストと返してください。", "diagnose_after_post": True},
    )
    assert response.status_code == 200, response.text

    history = client.get(f"/api/rooms/{room_id}/messages")
    assert history.status_code == 200, history.text
    items = history.json()["items"]
    assert len(items) == 1
    assert items[0]["sender_type"] == "user"

    diagnoses = client.get(f"/api/diagnoses?room_id={room_id}")
    assert diagnoses.status_code == 200, diagnoses.text
    assert diagnoses.json()["items"] == []


def test_assist_rewrite_only_proofreads_without_posting_facilitator(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    response = client.post(
        f"/api/rooms/{room_id}/assist/rewrite",
        json={"text": "今日は雨だ。"},
    )
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["improved_text"] == "今日は雨だ。"
    assert "対象" not in payload["improved_text"]
    assert "依頼内容" not in payload["improved_text"]
    assert payload["diagnosis_id"]

    history = client.get(f"/api/rooms/{room_id}/messages")
    assert history.status_code == 200, history.text
    facilitator_messages = [item for item in history.json()["items"] if item["sender_type"] == "facilitator"]
    assert facilitator_messages == []


def test_assist_clarify_formats_long_text_as_markdown(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    long_text = (
        "カルビーは2025年1月6日、新たに建設したせとうち広島工場を同月13日から操業開始すると発表した。\n"
        "新工場ではポテトチップスや堅あげポテトなどを製造する。\n"
        "再生可能エネルギーや循環型エネルギーを導入し、環境負荷の低減を目指す。"
    )

    response = client.post(
        f"/api/rooms/{room_id}/assist/clarify",
        json={"text": long_text},
    )
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["diagnosis_id"]
    assert "##" in payload["improved_text"]
    assert "- " in payload["improved_text"]
    assert "カルビー" in payload["improved_text"]


def test_assist_peraichi_creates_room_image_file(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    response = client.post(
        f"/api/rooms/{room_id}/assist/peraichi",
        json={"text": "結論: 提案資料を更新します。\n期限: 明日まで。\nお願い: 内容確認をお願いします。"},
    )
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["file"]["preview_kind"] == "image"
    assert payload["file"]["content_type"].startswith("image/")

    download = client.get(f"/api/rooms/{room_id}/files/{payload['file']['id']}/download")
    assert download.status_code == 200, download.text
    assert download.content.startswith(b"<svg") or download.content.startswith(b"\x89PNG")


def test_board_suggestion_heuristics():
    from app.main import should_suggest_board_for_diagnosis
    from app.models import Diagnosis

    diagnosis = Diagnosis(
        room_id="room_test",
        original_text="short",
        improved_text="short",
        message_type="request",
        clarity_score=70,
        garbage_score=10,
        context_confidence_score=90,
        reason="ok",
    )
    assert should_suggest_board_for_diagnosis(diagnosis, "short") == (False, "")

    should_suggest, reason = should_suggest_board_for_diagnosis(diagnosis, "x" * 240)
    assert should_suggest is True
    assert "長く" in reason

    diagnosis.context_confidence_score = 30
    should_suggest, reason = should_suggest_board_for_diagnosis(diagnosis, "short")
    assert should_suggest is True
    assert "確信度" in reason


def test_websocket_connection_and_typing_limits(client, registered_user):
    from starlette.websockets import WebSocketDisconnect

    from app.config import settings
    from app.main import websocket_typing_windows

    room_id = registered_user["rooms"][0]["id"]
    original_user_limit = settings.websocket_max_connections_per_user
    original_room_limit = settings.websocket_max_connections_per_room
    original_typing_limit = settings.websocket_typing_rate_limit_per_minute
    settings.websocket_max_connections_per_user = 1
    settings.websocket_max_connections_per_room = 10
    settings.websocket_typing_rate_limit_per_minute = 1
    websocket_typing_windows.clear()
    try:
        with client.websocket_connect(f"/ws/rooms/{room_id}") as websocket:
            websocket.send_json({"event": "typing.started"})
            first = websocket.receive_json()
            assert first["event"] == "typing.started"

            websocket.send_json({"event": "typing.stopped"})
            limited = websocket.receive_json()
            assert limited["event"] == "typing.rate_limited"

            try:
                with client.websocket_connect(f"/ws/rooms/{room_id}") as second_websocket:
                    second_websocket.receive_json()
                raise AssertionError("Second websocket connection should have been rejected")
            except WebSocketDisconnect as exc:
                assert exc.code == 4408
    finally:
        settings.websocket_max_connections_per_user = original_user_limit
        settings.websocket_max_connections_per_room = original_room_limit
        settings.websocket_typing_rate_limit_per_minute = original_typing_limit
        websocket_typing_windows.clear()


def test_dynamic_form_answers_remove_missing_items(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    text = "あれ、いい感じにお願いします。なる早で。"

    first = client.post(
        "/api/diagnoses",
        json={"room_id": room_id, "text": text, "source": "manual"},
    )
    assert first.status_code == 200, first.text
    first_payload = first.json()
    assert first_payload["facilitator_state"] == "unknown"
    form_ids = {field["id"] for field in first_payload["dynamic_form"]}
    assert {"subject", "expected_action", "due", "completion_condition"}.issubset(form_ids)

    second = client.post(
        "/api/diagnoses",
        json={
            "room_id": room_id,
            "text": first_payload["original_text"],
            "source": "dynamic_form",
            "form_answers": {
                "subject": "経営者向けシステム提案資料",
                "expected_action": "3ページ目の導入効果を数字で補強してください",
                "due": "明日18時まで",
                "completion_condition": "修正版PDFのURLをこのルームに共有してください",
            },
        },
    )
    assert second.status_code == 200, second.text
    second_payload = second.json()
    missing = {item["item"] for item in second_payload["missing_items"]}
    assert not ({"対象", "期待する作業内容", "期限", "完了条件"} & missing)
    assert second_payload["dynamic_form"] is None
    assert "経営者向けシステム提案資料" in second_payload["improved_text"]
    assert "明日18時まで" in second_payload["improved_text"]


def test_external_api_token_work_request_tasks_and_audit(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    api_client = client.post(
        "/api/api-clients",
        json={
            "room_id": room_id,
            "name": "Codex",
            "client_type": "codex",
            "scopes": [
                "rooms:read",
                "messages:read",
                "messages:write",
                "diagnoses:write",
                "tasks:read",
                "tasks:write",
                "webhooks:write",
            ],
            "active": True,
        },
    )
    assert api_client.status_code == 200, api_client.text
    api_client_id = api_client.json()["id"]

    token_response = client.post(f"/api/api-clients/{api_client_id}/tokens", json={"name": "pytest"})
    assert token_response.status_code == 200, token_response.text
    token = token_response.json()["token"]
    assert token.startswith("sap_")

    headers = {"Authorization": f"Bearer {token}", "Idempotency-Key": "work-request-001"}
    work_request = client.post(
        "/api/v1/work-requests",
        headers=headers,
        json={
            "room_id": room_id,
            "title": "Update proposal",
            "body": "Please revise page 3 and share the result.",
            "assignee": "Codex",
            "create_task": True,
            "diagnose_before_post": True,
            "attachments": [{"title": "source.md", "url": "https://example.com/source.md"}],
        },
    )
    assert work_request.status_code == 200, work_request.text
    work_payload = work_request.json()
    assert work_payload["message_id"]
    assert work_payload["diagnosis_id"]
    assert work_payload["task_id"]

    tasks = client.get("/api/v1/tasks", headers={"Authorization": f"Bearer {token}"})
    assert tasks.status_code == 200, tasks.text
    assert any(task["id"] == work_payload["task_id"] for task in tasks.json()["items"])

    audit_logs = client.get(f"/api/audit-logs?room_id={room_id}")
    assert audit_logs.status_code == 200, audit_logs.text
    actions = {log["action"] for log in audit_logs.json()["items"]}
    assert "work_requests.create" in actions
    assert "tasks.read" in actions


def test_external_api_room_message_and_task_listing(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    created_message = client.post(
        f"/api/rooms/{room_id}/messages",
        json={"body": "外部API一覧確認用のメッセージです"},
    )
    assert created_message.status_code == 200, created_message.text
    created_task = client.post(
        "/api/tasks",
        json={"room_id": room_id, "title": "外部API一覧確認タスク", "assignee": "Codex"},
    )
    assert created_task.status_code == 200, created_task.text

    api_client = client.post(
        "/api/api-clients",
        json={
            "room_id": room_id,
            "name": "Reader Client",
            "client_type": "codex",
            "scopes": ["rooms:read", "messages:read", "tasks:read"],
            "active": True,
        },
    )
    assert api_client.status_code == 200, api_client.text
    token_response = client.post(f"/api/api-clients/{api_client.json()['id']}/tokens", json={"name": "reader"})
    assert token_response.status_code == 200, token_response.text
    headers = {"Authorization": f"Bearer {token_response.json()['token']}"}

    rooms = client.get("/api/v1/rooms", headers=headers)
    assert rooms.status_code == 200, rooms.text
    assert [room["id"] for room in rooms.json()["items"]] == [room_id]

    messages = client.get(f"/api/v1/rooms/{room_id}/messages?limit=10", headers=headers)
    assert messages.status_code == 200, messages.text
    assert any(item["id"] == created_message.json()["id"] for item in messages.json()["items"])

    tasks = client.get("/api/v1/tasks", headers=headers)
    assert tasks.status_code == 200, tasks.text
    assert any(item["id"] == created_task.json()["id"] for item in tasks.json()["items"])


def test_external_api_webhook_create_and_list(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]

    api_client = client.post(
        "/api/api-clients",
        json={
            "room_id": room_id,
            "name": "Webhook Client",
            "client_type": "webhook",
            "scopes": ["webhooks:write"],
            "active": True,
        },
    )
    assert api_client.status_code == 200, api_client.text
    token_response = client.post(f"/api/api-clients/{api_client.json()['id']}/tokens", json={"name": "webhook-test"})
    assert token_response.status_code == 200, token_response.text
    headers = {"Authorization": f"Bearer {token_response.json()['token']}"}

    created = client.post(
        "/api/v1/webhooks",
        headers=headers,
        json={
            "room_id": room_id,
            "url": "https://example.com/peracha-webhook",
            "events": ["message.created", "task.updated"],
            "secret": "test-secret",
        },
    )
    assert created.status_code == 200, created.text
    payload = created.json()
    assert payload["room_id"] == room_id
    assert payload["events"] == ["message.created", "task.updated"]
    assert payload["active"] is True

    listed = client.get("/api/v1/webhooks", headers=headers)
    assert listed.status_code == 200, listed.text
    assert any(item["id"] == payload["id"] for item in listed.json()["items"])


def test_external_api_rate_limit(client, registered_user):
    from app.config import settings
    from app.main import api_rate_windows

    room_id = registered_user["rooms"][0]["id"]
    original_limit = settings.api_rate_limit_per_minute
    settings.api_rate_limit_per_minute = 2
    api_rate_windows.clear()
    try:
        api_client = client.post(
            "/api/api-clients",
            json={
                "room_id": room_id,
                "name": "Limited Client",
                "client_type": "codex",
                "scopes": ["rooms:read"],
                "active": True,
            },
        )
        assert api_client.status_code == 200, api_client.text
        token_response = client.post(f"/api/api-clients/{api_client.json()['id']}/tokens", json={"name": "limited"})
        assert token_response.status_code == 200, token_response.text
        token = token_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        assert client.get("/api/v1/rooms", headers=headers).status_code == 200
        assert client.get("/api/v1/rooms", headers=headers).status_code == 200
        limited = client.get("/api/v1/rooms", headers=headers)
        assert limited.status_code == 429, limited.text
        assert limited.headers["Retry-After"]
    finally:
        settings.api_rate_limit_per_minute = original_limit
        api_rate_windows.clear()


def test_user_task_update_publishes_persistent_state(client, registered_user):
    room_id = registered_user["rooms"][0]["id"]
    created = client.post(
        "/api/tasks",
        json={
            "room_id": room_id,
            "title": "Prepare executive deck",
            "assignee": "Owner",
            "completion_condition": "Share the reviewed PDF in the room",
        },
    )
    assert created.status_code == 200, created.text
    task_id = created.json()["id"]

    updated = client.patch(
        f"/api/tasks/{task_id}",
        json={"status": "確認待ち", "progress_note": "Draft is ready for review."},
    )
    assert updated.status_code == 200, updated.text
    updated_payload = updated.json()
    assert updated_payload["status"] == "確認待ち"
    assert updated_payload["progress_note"] == "Draft is ready for review."

    tasks = client.get(f"/api/tasks?room_id={room_id}")
    assert tasks.status_code == 200, tasks.text
    persisted = next(task for task in tasks.json()["items"] if task["id"] == task_id)
    assert persisted["status"] == "確認待ち"
    assert persisted["progress_note"] == "Draft is ready for review."

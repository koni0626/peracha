import os
import zipfile
from xml.etree import ElementTree

from .config import settings
from .chat_schemas import RoomFileOut
from .models import RoomFile


def room_file_path(file: RoomFile) -> str:
    return os.path.join(settings.upload_dir, file.room_id, file.stored_name)


def file_preview_kind(file: RoomFile) -> str:
    name = file.original_name.lower()
    content_type = (file.content_type or "").lower()
    if content_type == "application/pdf" or name.endswith(".pdf"):
        return "pdf"
    if name.endswith(".docx"):
        return "docx"
    if name.endswith(".xlsx"):
        return "xlsx"
    if name.endswith(".pptx"):
        return "pptx"
    if content_type.startswith("image/") or name.endswith((".avif", ".bmp", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp")):
        return "image"
    if content_type.startswith("video/") or name.endswith((".mp4", ".mov", ".m4v", ".webm", ".ogg")):
        return "video"
    return "download"


def room_file_out(file: RoomFile) -> RoomFileOut:
    download_url = f"/api/rooms/{file.room_id}/files/{file.id}/download"
    preview_kind = file_preview_kind(file)
    return RoomFileOut(
        id=file.id,
        room_id=file.room_id,
        original_name=file.original_name,
        content_type=file.content_type,
        size_bytes=file.size_bytes,
        download_url=download_url,
        preview_url=download_url if preview_kind in {"pdf", "image", "video", "docx", "xlsx", "pptx"} else None,
        preview_kind=preview_kind,
        created_at=file.created_at,
    )


def xml_text_nodes(xml_bytes: bytes) -> list[str]:
    try:
        root = ElementTree.fromstring(xml_bytes)
    except ElementTree.ParseError:
        return []
    return [(node.text or "").strip() for node in root.iter() if node.tag.endswith("}t") and (node.text or "").strip()]


def truncate_preview(text: str, limit: int = 12000) -> tuple[str, bool]:
    if len(text) <= limit:
        return text, False
    return text[:limit].rstrip() + "\n...", True


def extract_docx_preview(path: str) -> str:
    with zipfile.ZipFile(path) as archive:
        return "\n".join(xml_text_nodes(archive.read("word/document.xml")))


def extract_pptx_preview(path: str) -> str:
    lines: list[str] = []
    with zipfile.ZipFile(path) as archive:
        slide_names = sorted(name for name in archive.namelist() if name.startswith("ppt/slides/slide") and name.endswith(".xml"))
        for index, name in enumerate(slide_names[:20], start=1):
            slide_text = " ".join(xml_text_nodes(archive.read(name)))
            if slide_text:
                lines.append(f"Slide {index}: {slide_text}")
    return "\n".join(lines)


def extract_xlsx_preview(path: str) -> str:
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            shared_strings = xml_text_nodes(archive.read("xl/sharedStrings.xml"))

        rows: list[str] = []
        sheet_names = sorted(name for name in archive.namelist() if name.startswith("xl/worksheets/sheet") and name.endswith(".xml"))
        for sheet_index, name in enumerate(sheet_names[:3], start=1):
            root = ElementTree.fromstring(archive.read(name))
            rows.append(f"Sheet {sheet_index}")
            for row in root.iter():
                if not row.tag.endswith("}row"):
                    continue
                values: list[str] = []
                for cell in row:
                    if not cell.tag.endswith("}c"):
                        continue
                    value_node = next((child for child in cell if child.tag.endswith("}v")), None)
                    inline_nodes = [child for child in cell.iter() if child.tag.endswith("}t")]
                    value = ""
                    if inline_nodes:
                        value = "".join(node.text or "" for node in inline_nodes)
                    elif value_node is not None and value_node.text:
                        if cell.attrib.get("t") == "s":
                            index = int(value_node.text)
                            value = shared_strings[index] if 0 <= index < len(shared_strings) else value_node.text
                        else:
                            value = value_node.text
                    if value:
                        values.append(value)
                if values:
                    rows.append(" | ".join(values[:12]))
                if len(rows) >= 80:
                    break
    return "\n".join(rows)


def extract_file_preview(path: str, preview_kind: str) -> tuple[str, bool]:
    try:
        if preview_kind == "docx":
            text = extract_docx_preview(path)
        elif preview_kind == "xlsx":
            text = extract_xlsx_preview(path)
        elif preview_kind == "pptx":
            text = extract_pptx_preview(path)
        else:
            text = ""
    except (KeyError, OSError, ValueError, zipfile.BadZipFile, ElementTree.ParseError):
        text = ""
    return truncate_preview(text or "プレビューできる文字情報が見つかりませんでした。")

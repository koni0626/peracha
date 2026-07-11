from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import Response
from sqlalchemy import desc, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Stamp, StampFolder, User
from ..schemas import PageOut
from ..security import get_current_user
from ..stamp_serializers import stamp_out
from ..stamp_schemas import StampFolderCreateIn, StampFolderOut, StampOut
from ..stamp_service import create_uploaded_stamp, get_user_stamp_or_404, read_stamp_upload, stamp_image_response


router = APIRouter(prefix="/api/stamps", tags=["stamps"])


def get_user_stamp_folder_or_404(db: Session, folder_id: str, user_id: str) -> StampFolder:
    folder = db.scalar(select(StampFolder).where(StampFolder.id == folder_id, StampFolder.user_id == user_id))
    if not folder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stamp folder not found")
    return folder


def get_stamp_or_404(db: Session, stamp_id: str) -> Stamp:
    stamp = db.get(Stamp, stamp_id)
    if not stamp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stamp not found")
    return stamp


@router.get("/folders", response_model=PageOut[StampFolderOut])
def list_stamp_folders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[StampFolderOut]:
    rows = db.execute(
        select(StampFolder, func.count(Stamp.id))
        .outerjoin(Stamp, Stamp.folder_id == StampFolder.id)
        .where(StampFolder.user_id == current_user.id)
        .group_by(StampFolder.id)
        .order_by(StampFolder.name)
    ).all()
    return PageOut[StampFolderOut](
        items=[
            StampFolderOut(id=folder.id, name=folder.name, stamp_count=count, created_at=folder.created_at)
            for folder, count in rows
        ]
    )


@router.post("/folders", response_model=StampFolderOut)
def create_stamp_folder(
    payload: StampFolderCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StampFolderOut:
    folder = StampFolder(user_id=current_user.id, name=payload.name.strip())
    db.add(folder)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="同じ名前のスタンプフォルダが既にあります。",
        ) from exc
    db.refresh(folder)
    return StampFolderOut(id=folder.id, name=folder.name, stamp_count=0, created_at=folder.created_at)


@router.delete("/folders/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stamp_folder(
    folder_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    folder = get_user_stamp_folder_or_404(db, folder_id, current_user.id)
    stamps = db.scalars(select(Stamp).where(Stamp.user_id == current_user.id, Stamp.folder_id == folder.id)).all()
    for stamp in stamps:
        db.delete(stamp)
    db.delete(folder)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("", response_model=PageOut[StampOut])
def list_stamps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[StampOut]:
    stamps = db.scalars(
        select(Stamp).where(Stamp.user_id == current_user.id).order_by(desc(Stamp.created_at)).limit(160)
    ).all()
    return PageOut[StampOut](items=[stamp_out(stamp) for stamp in stamps])


@router.get("/{stamp_id}/image")
def get_stamp_image(
    stamp_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    stamp = get_stamp_or_404(db, stamp_id)
    return stamp_image_response(stamp)


@router.delete("/{stamp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stamp(
    stamp_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    stamp = get_user_stamp_or_404(db, stamp_id, current_user.id)
    db.delete(stamp)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/upload", response_model=StampOut)
async def upload_stamp(
    file: UploadFile = File(...),
    folder_id: str | None = Form(default=None),
    title: str | None = Form(default=None, max_length=80),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StampOut:
    normalized_folder_id = folder_id.strip() if folder_id else None
    if normalized_folder_id:
        get_user_stamp_folder_or_404(db, normalized_folder_id, current_user.id)
    content_type, image_bytes = await read_stamp_upload(file)
    stamp = create_uploaded_stamp(db, current_user.id, normalized_folder_id, file.filename, title, content_type, image_bytes)
    db.commit()
    db.refresh(stamp)
    return stamp_out(stamp)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import RoomWikiArticle, User, now_utc
from ..permissions import ensure_room_member
from ..schemas import PageOut
from ..security import get_current_user
from ..wiki_serializers import wiki_article_out
from ..wiki_schemas import WikiArticleCreateIn, WikiArticleOut, WikiArticleUpdateIn

router = APIRouter(tags=["wiki"])


def get_article_for_user(db: Session, article_id: str, user_id: str) -> RoomWikiArticle:
    article = db.get(RoomWikiArticle, article_id)
    if not article or article.deleted_at is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wiki article not found")
    ensure_room_member(db, article.room_id, user_id)
    return article


@router.get("/api/rooms/{room_id}/wiki-articles", response_model=PageOut[WikiArticleOut])
def list_room_wiki_articles(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[WikiArticleOut]:
    ensure_room_member(db, room_id, current_user.id)
    articles = db.scalars(
        select(RoomWikiArticle)
        .where(RoomWikiArticle.room_id == room_id, RoomWikiArticle.deleted_at.is_(None))
        .order_by(desc(RoomWikiArticle.updated_at), desc(RoomWikiArticle.created_at))
    ).all()
    return PageOut[WikiArticleOut](items=[wiki_article_out(article) for article in articles])


@router.post("/api/rooms/{room_id}/wiki-articles", response_model=WikiArticleOut)
def create_room_wiki_article(
    room_id: str,
    payload: WikiArticleCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WikiArticleOut:
    ensure_room_member(db, room_id, current_user.id)
    article = RoomWikiArticle(
        room_id=room_id,
        title=payload.title.strip(),
        body_markdown=payload.body_markdown,
        created_by_user_id=current_user.id,
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return wiki_article_out(article)


@router.patch("/api/wiki-articles/{article_id}", response_model=WikiArticleOut)
def update_wiki_article(
    article_id: str,
    payload: WikiArticleUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WikiArticleOut:
    article = get_article_for_user(db, article_id, current_user.id)
    if payload.title is not None:
        article.title = payload.title.strip()
    if payload.body_markdown is not None:
        article.body_markdown = payload.body_markdown
    article.updated_at = now_utc()
    db.commit()
    db.refresh(article)
    return wiki_article_out(article)


@router.delete("/api/wiki-articles/{article_id}", response_model=WikiArticleOut)
def delete_wiki_article(
    article_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WikiArticleOut:
    article = get_article_for_user(db, article_id, current_user.id)
    article.deleted_at = now_utc()
    article.updated_at = article.deleted_at
    db.commit()
    return wiki_article_out(article)

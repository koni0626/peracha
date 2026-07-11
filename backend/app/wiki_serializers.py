from .models import RoomWikiArticle
from .wiki_schemas import WikiArticleOut


def wiki_article_out(article: RoomWikiArticle) -> WikiArticleOut:
    return WikiArticleOut(
        id=article.id,
        room_id=article.room_id,
        title=article.title,
        body_markdown=article.body_markdown,
        created_by_user_id=article.created_by_user_id,
        created_at=article.created_at,
        updated_at=article.updated_at,
    )

from .models import Stamp
from .stamp_schemas import StampOut


def stamp_out(stamp: Stamp) -> StampOut:
    version = int(stamp.created_at.timestamp() * 1_000_000)
    return StampOut(
        id=stamp.id,
        folder_id=stamp.folder_id,
        title=stamp.title,
        prompt=stamp.prompt,
        image_url=f"/api/stamps/{stamp.id}/image?v={version}",
        image_model=stamp.image_model,
        reference_used=stamp.reference_used == "true",
        created_at=stamp.created_at,
    )

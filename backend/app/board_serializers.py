import json

from .board_schemas import BoardOut
from .models import NowHereBoard


def board_out(board: NowHereBoard) -> BoardOut:
    return BoardOut(
        id=board.id,
        room_id=board.room_id,
        title=board.title,
        image_url=board.image_url,
        image_model=board.image_model,
        summary_json=json.loads(board.summary_json),
        created_at=board.created_at,
    )

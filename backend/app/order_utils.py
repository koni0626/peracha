from collections.abc import Iterable, Sequence
from typing import Protocol


class HasId(Protocol):
    id: str


def ordered_existing_ids(items: Sequence[HasId], requested_ids: Iterable[str]) -> list[str]:
    items_by_id = {item.id: item for item in items}
    ordered_ids = [item_id for item_id in requested_ids if item_id in items_by_id]
    if len(ordered_ids) != len(items):
        ordered_ids.extend(item.id for item in items if item.id not in ordered_ids)
    return ordered_ids


def normalize_insert_position(position: int | None, item_count: int) -> int:
    requested_position = position or item_count + 1
    return max(1, min(requested_position, item_count + 1))


def shift_positions_for_insert(items: Iterable, insert_position: int) -> None:
    for item in items:
        if item.position >= insert_position:
            item.position += 1

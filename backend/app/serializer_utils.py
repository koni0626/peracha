import json


def json_list(value: str | None) -> list:
    if not value:
        return []
    return json.loads(value)


def json_dict(value: str | None) -> dict:
    if not value:
        return {}
    loaded = json.loads(value)
    return loaded if isinstance(loaded, dict) else {}

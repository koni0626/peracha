from sqlalchemy import Engine, inspect, text


def ensure_runtime_schema(engine: Engine) -> None:
    inspector = inspect(engine)
    table_names = inspector.get_table_names()

    with engine.begin() as connection:
        if "stamps" in table_names:
            stamp_columns = {column["name"] for column in inspector.get_columns("stamps")}
            if "folder_id" not in stamp_columns:
                connection.execute(text("ALTER TABLE stamps ADD COLUMN folder_id VARCHAR"))

        if "work_tables" in table_names:
            work_table_columns = {column["name"] for column in inspector.get_columns("work_tables")}
            if "description_markdown" not in work_table_columns:
                connection.execute(text("ALTER TABLE work_tables ADD COLUMN description_markdown TEXT"))
            if "position" not in work_table_columns:
                connection.execute(text("ALTER TABLE work_tables ADD COLUMN position INTEGER NOT NULL DEFAULT 0"))
            if "deleted_at" not in work_table_columns:
                connection.execute(text("ALTER TABLE work_tables ADD COLUMN deleted_at DATETIME"))

        if "work_table_records" in table_names:
            record_columns = {column["name"] for column in inspector.get_columns("work_table_records")}
            if "parent_record_id" not in record_columns:
                connection.execute(text("ALTER TABLE work_table_records ADD COLUMN parent_record_id VARCHAR"))

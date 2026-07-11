"""add stamp folders"""

from alembic import op
import sqlalchemy as sa


revision = "20260615_0002"
down_revision = "20260613_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "stamp_folders",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "name", name="uq_stamp_folder_user_name"),
    )
    op.create_index(op.f("ix_stamp_folders_user_id"), "stamp_folders", ["user_id"], unique=False)
    op.add_column("stamps", sa.Column("folder_id", sa.String(), nullable=True))
    op.create_index(op.f("ix_stamps_folder_id"), "stamps", ["folder_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_stamps_folder_id"), table_name="stamps")
    op.drop_column("stamps", "folder_id")
    op.drop_index(op.f("ix_stamp_folders_user_id"), table_name="stamp_folders")
    op.drop_table("stamp_folders")

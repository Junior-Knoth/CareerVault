"""create saves table

Revision ID: 20260623_0002
Revises: 20260623_0001
Create Date: 2026-06-23
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260623_0002"
down_revision: str | None = "20260623_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "saves",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("accent_color", sa.String(length=16), nullable=False),
        sa.Column("secondary_color", sa.String(length=16), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_saves_id"), "saves", ["id"], unique=False)
    op.create_index(op.f("ix_saves_slug"), "saves", ["slug"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_saves_slug"), table_name="saves")
    op.drop_index(op.f("ix_saves_id"), table_name="saves")
    op.drop_table("saves")

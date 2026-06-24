"""create players table

Revision ID: 20260623_0004
Revises: 20260623_0003
Create Date: 2026-06-23
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260623_0004"
down_revision: str | None = "20260623_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "players",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("save_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=160), nullable=False),
        sa.Column("short_name", sa.String(length=80), nullable=True),
        sa.Column("normalized_name", sa.String(length=180), nullable=False),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("nationality", sa.String(length=24), nullable=True),
        sa.Column("height_cm", sa.Integer(), nullable=True),
        sa.Column("weight_kg", sa.Integer(), nullable=True),
        sa.Column("preferred_foot", sa.String(length=16), nullable=True),
        sa.Column("academy_origin", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("photo_path", sa.String(length=255), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["save_id"], ["saves.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_players_id"), "players", ["id"], unique=False)
    op.create_index(op.f("ix_players_normalized_name"), "players", ["normalized_name"], unique=False)
    op.create_index(op.f("ix_players_save_id"), "players", ["save_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_players_save_id"), table_name="players")
    op.drop_index(op.f("ix_players_normalized_name"), table_name="players")
    op.drop_index(op.f("ix_players_id"), table_name="players")
    op.drop_table("players")

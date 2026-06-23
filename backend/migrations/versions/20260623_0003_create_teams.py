"""create teams table

Revision ID: 20260623_0003
Revises: 20260623_0002
Create Date: 2026-06-23
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260623_0003"
down_revision: str | None = "20260623_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("save_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("short_name", sa.String(length=80), nullable=True),
        sa.Column("abbreviation", sa.String(length=12), nullable=True),
        sa.Column("team_type", sa.String(length=24), nullable=False),
        sa.Column("country", sa.String(length=80), nullable=True),
        sa.Column("primary_color", sa.String(length=16), nullable=False),
        sa.Column("secondary_color", sa.String(length=16), nullable=False),
        sa.Column("logo_path", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["save_id"], ["saves.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("save_id", "name", name="uq_teams_save_id_name"),
    )
    op.create_index(op.f("ix_teams_id"), "teams", ["id"], unique=False)
    op.create_index(op.f("ix_teams_save_id"), "teams", ["save_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_teams_save_id"), table_name="teams")
    op.drop_index(op.f("ix_teams_id"), table_name="teams")
    op.drop_table("teams")

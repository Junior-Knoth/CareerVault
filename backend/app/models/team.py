from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.save import utc_now


class Team(Base):
    __tablename__ = "teams"
    __table_args__ = (UniqueConstraint("save_id", "name", name="uq_teams_save_id_name"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    save_id: Mapped[int] = mapped_column(ForeignKey("saves.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    short_name: Mapped[str | None] = mapped_column(String(80), nullable=True)
    abbreviation: Mapped[str | None] = mapped_column(String(12), nullable=True)
    team_type: Mapped[str] = mapped_column(String(24), nullable=False)
    country: Mapped[str | None] = mapped_column(String(80), nullable=True)
    primary_color: Mapped[str] = mapped_column(String(16), nullable=False, default="#ff6f61")
    secondary_color: Mapped[str] = mapped_column(String(16), nullable=False, default="#151515")
    logo_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

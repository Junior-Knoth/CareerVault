from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

PreferredFoot = Literal["right", "left", "both"]


class PlayerBase(BaseModel):
    save_id: int
    full_name: str = Field(min_length=1, max_length=160)
    short_name: str | None = Field(default=None, max_length=80)
    birth_date: date | None = None
    nationality: str | None = Field(default=None, max_length=24)
    height_cm: int | None = Field(default=None, ge=100, le=230)
    weight_kg: int | None = Field(default=None, ge=30, le=180)
    preferred_foot: PreferredFoot | None = None
    academy_origin: bool = False
    status: str = Field(default="active", max_length=32)
    photo_path: str | None = Field(default=None, max_length=255)
    notes: str | None = None


class PlayerCreate(PlayerBase):
    pass


class PlayerUpdate(BaseModel):
    save_id: int | None = None
    full_name: str | None = Field(default=None, min_length=1, max_length=160)
    short_name: str | None = Field(default=None, max_length=80)
    birth_date: date | None = None
    nationality: str | None = Field(default=None, max_length=24)
    height_cm: int | None = Field(default=None, ge=100, le=230)
    weight_kg: int | None = Field(default=None, ge=30, le=180)
    preferred_foot: PreferredFoot | None = None
    academy_origin: bool | None = None
    status: str | None = Field(default=None, max_length=32)
    photo_path: str | None = Field(default=None, max_length=255)
    notes: str | None = None


class PlayerRead(PlayerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    normalized_name: str
    created_at: datetime
    updated_at: datetime

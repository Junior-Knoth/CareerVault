from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SaveBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    slug: str | None = Field(default=None, max_length=140)
    description: str | None = None
    accent_color: str = Field(default="#ff6f61", max_length=16)
    secondary_color: str = Field(default="#151515", max_length=16)


class SaveCreate(SaveBase):
    pass


class SaveUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    slug: str | None = Field(default=None, max_length=140)
    description: str | None = None
    accent_color: str | None = Field(default=None, max_length=16)
    secondary_color: str | None = Field(default=None, max_length=16)


class SaveRead(SaveBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    created_at: datetime
    updated_at: datetime

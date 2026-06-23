from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

TeamType = Literal["club", "national_team"]


class TeamBase(BaseModel):
    save_id: int
    name: str = Field(min_length=1, max_length=120)
    short_name: str | None = Field(default=None, max_length=80)
    abbreviation: str | None = Field(default=None, max_length=12)
    team_type: TeamType = "club"
    country: str | None = Field(default=None, max_length=80)
    primary_color: str = Field(default="#ff6f61", max_length=16)
    secondary_color: str = Field(default="#151515", max_length=16)
    logo_path: str | None = Field(default=None, max_length=255)


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    save_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=120)
    short_name: str | None = Field(default=None, max_length=80)
    abbreviation: str | None = Field(default=None, max_length=12)
    team_type: TeamType | None = None
    country: str | None = Field(default=None, max_length=80)
    primary_color: str | None = Field(default=None, max_length=16)
    secondary_color: str | None = Field(default=None, max_length=16)
    logo_path: str | None = Field(default=None, max_length=255)


class TeamRead(TeamBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime

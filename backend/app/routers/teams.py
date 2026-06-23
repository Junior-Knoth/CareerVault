from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.save import Save
from app.models.team import Team
from app.schemas.team import TeamCreate, TeamRead, TeamUpdate

router = APIRouter(prefix="/teams", tags=["Teams"])


def ensure_save_exists(db: Session, save_id: int) -> None:
    if db.get(Save, save_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Save not found")


def get_team_or_404(db: Session, team_id: int) -> Team:
    team = db.get(Team, team_id)

    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    return team


def commit_or_duplicate_error(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A team with this name already exists in the selected save",
        ) from exc


@router.get("/", response_model=list[TeamRead])
def list_teams(
    save_id: int | None = Query(default=None),
    team_type: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Team]:
    statement = select(Team)

    if save_id is not None:
        statement = statement.where(Team.save_id == save_id)

    if team_type is not None:
        statement = statement.where(Team.team_type == team_type)

    statement = statement.order_by(Team.name.asc())

    return list(db.scalars(statement))


@router.post("/", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
def create_team(team_in: TeamCreate, db: Session = Depends(get_db)) -> Team:
    ensure_save_exists(db, team_in.save_id)
    team = Team(**team_in.model_dump())

    db.add(team)
    commit_or_duplicate_error(db)
    db.refresh(team)

    return team


@router.get("/{team_id}", response_model=TeamRead)
def get_team(team_id: int, db: Session = Depends(get_db)) -> Team:
    return get_team_or_404(db, team_id)


@router.patch("/{team_id}", response_model=TeamRead)
def update_team(team_id: int, team_in: TeamUpdate, db: Session = Depends(get_db)) -> Team:
    team = get_team_or_404(db, team_id)
    update_data = team_in.model_dump(exclude_unset=True)

    if "save_id" in update_data and update_data["save_id"] is not None:
        ensure_save_exists(db, update_data["save_id"])

    for field, value in update_data.items():
        setattr(team, field, value)

    commit_or_duplicate_error(db)
    db.refresh(team)

    return team


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: int, db: Session = Depends(get_db)) -> None:
    team = get_team_or_404(db, team_id)

    db.delete(team)
    db.commit()

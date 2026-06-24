from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.player import Player
from app.models.save import Save
from app.schemas.player import PlayerCreate, PlayerDuplicateCheck, PlayerRead, PlayerUpdate
from app.utils.names import normalize_name

router = APIRouter(prefix="/players", tags=["Players"])


def ensure_save_exists(db: Session, save_id: int) -> None:
    if db.get(Save, save_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Save not found")


def get_player_or_404(db: Session, player_id: int) -> Player:
    player = db.get(Player, player_id)

    if player is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")

    return player


@router.get("/", response_model=list[PlayerRead])
def list_players(
    save_id: int | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    nationality: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Player]:
    statement = select(Player)

    if save_id is not None:
        statement = statement.where(Player.save_id == save_id)

    if status_filter is not None:
        statement = statement.where(Player.status == status_filter)

    if nationality is not None:
        statement = statement.where(Player.nationality == nationality)

    if search is not None and search.strip():
        statement = statement.where(Player.normalized_name.contains(normalize_name(search)))

    statement = statement.order_by(Player.full_name.asc())

    return list(db.scalars(statement))


@router.get("/duplicates", response_model=PlayerDuplicateCheck)
def check_player_duplicates(
    save_id: int = Query(),
    full_name: str = Query(min_length=1),
    exclude_player_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> PlayerDuplicateCheck:
    ensure_save_exists(db, save_id)
    normalized_name = normalize_name(full_name)
    statement = select(Player).where(
        Player.save_id == save_id,
        Player.normalized_name == normalized_name,
    )

    if exclude_player_id is not None:
        statement = statement.where(Player.id != exclude_player_id)

    statement = statement.order_by(Player.full_name.asc())
    matches = list(db.scalars(statement))

    return PlayerDuplicateCheck(
        save_id=save_id,
        full_name=full_name,
        normalized_name=normalized_name,
        has_duplicates=len(matches) > 0,
        matches=matches,
    )


@router.post("/", response_model=PlayerRead, status_code=status.HTTP_201_CREATED)
def create_player(player_in: PlayerCreate, db: Session = Depends(get_db)) -> Player:
    ensure_save_exists(db, player_in.save_id)
    player_data = player_in.model_dump()
    player = Player(**player_data, normalized_name=normalize_name(player_in.full_name))

    db.add(player)
    db.commit()
    db.refresh(player)

    return player


@router.get("/{player_id}", response_model=PlayerRead)
def get_player(player_id: int, db: Session = Depends(get_db)) -> Player:
    return get_player_or_404(db, player_id)


@router.patch("/{player_id}", response_model=PlayerRead)
def update_player(player_id: int, player_in: PlayerUpdate, db: Session = Depends(get_db)) -> Player:
    player = get_player_or_404(db, player_id)
    update_data = player_in.model_dump(exclude_unset=True)

    if "save_id" in update_data and update_data["save_id"] is not None:
        ensure_save_exists(db, update_data["save_id"])

    if "full_name" in update_data and update_data["full_name"] is not None:
        update_data["normalized_name"] = normalize_name(update_data["full_name"])

    for field, value in update_data.items():
        setattr(player, field, value)

    db.commit()
    db.refresh(player)

    return player


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(player_id: int, db: Session = Depends(get_db)) -> None:
    player = get_player_or_404(db, player_id)

    db.delete(player)
    db.commit()

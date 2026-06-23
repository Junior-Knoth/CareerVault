import re
import unicodedata

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.save import Save
from app.schemas.save import SaveCreate, SaveRead, SaveUpdate

router = APIRouter(prefix="/saves", tags=["Saves"])


def normalize_slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value).strip("-").lower()

    return slug or "save"


def get_unique_slug(db: Session, raw_slug: str, current_save_id: int | None = None) -> str:
    base_slug = normalize_slug(raw_slug)
    candidate = base_slug
    suffix = 2

    while True:
        statement = select(Save).where(Save.slug == candidate)

        if current_save_id is not None:
            statement = statement.where(Save.id != current_save_id)

        existing_save = db.scalar(statement)

        if existing_save is None:
            return candidate

        candidate = f"{base_slug}-{suffix}"
        suffix += 1


def get_save_or_404(db: Session, save_id: int) -> Save:
    save = db.get(Save, save_id)

    if save is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Save not found")

    return save


@router.get("/", response_model=list[SaveRead])
def list_saves(db: Session = Depends(get_db)) -> list[Save]:
    statement = select(Save).order_by(Save.created_at.desc())

    return list(db.scalars(statement))


@router.post("/", response_model=SaveRead, status_code=status.HTTP_201_CREATED)
def create_save(save_in: SaveCreate, db: Session = Depends(get_db)) -> Save:
    save = Save(
        name=save_in.name,
        slug=get_unique_slug(db, save_in.slug or save_in.name),
        description=save_in.description,
        accent_color=save_in.accent_color,
        secondary_color=save_in.secondary_color,
    )

    db.add(save)
    db.commit()
    db.refresh(save)

    return save


@router.get("/{save_id}", response_model=SaveRead)
def get_save(save_id: int, db: Session = Depends(get_db)) -> Save:
    return get_save_or_404(db, save_id)


@router.patch("/{save_id}", response_model=SaveRead)
def update_save(save_id: int, save_in: SaveUpdate, db: Session = Depends(get_db)) -> Save:
    save = get_save_or_404(db, save_id)
    update_data = save_in.model_dump(exclude_unset=True)

    if "slug" in update_data and update_data["slug"] is not None:
        update_data["slug"] = get_unique_slug(db, update_data["slug"], current_save_id=save.id)
    elif "name" in update_data and save_in.slug is None:
        update_data["slug"] = get_unique_slug(db, update_data["name"], current_save_id=save.id)

    for field, value in update_data.items():
        setattr(save, field, value)

    db.commit()
    db.refresh(save)

    return save


@router.delete("/{save_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_save(save_id: int, db: Session = Depends(get_db)) -> None:
    save = get_save_or_404(db, save_id)

    db.delete(save)
    db.commit()

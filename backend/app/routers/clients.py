from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.client import (
    ClientSummary,
    ClientDetail,
    ClientFull,
    ClientCreate,
    ClientUpdate,
)
from app.crud import client as crud_client

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.get("/", response_model=List[ClientSummary])
async def read_clients(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Retreive a list of clients (Summary view).
    """
    return await crud_client.get_clients(db, skip=skip, limit=limit)


@router.get("/{client_id}", response_model=ClientDetail)
async def read_client(client_id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a specific client information (Detailed view).
    """
    db_client = await crud_client.get_client_by_id(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


@router.get("/{client_id}/full", response_model=ClientFull)
async def read_client_full(client_id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a FULL client dossier including loans and deposits.
    """
    db_client = await crud_client.get_client_full_by_id(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


# --- CREATE ---


@router.post("/", response_model=ClientSummary, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_in: ClientCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new client.
    """
    return await crud_client.create_client(db, client_in)


# --- UPDATE ---


@router.put("/{client_id}", response_model=ClientDetail)
async def update_client(
    client_id: int,
    client_in: ClientUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update an existing client.
    Only provided fields will be updated (partial update supported).
    """
    db_client = await crud_client.update_client(db, client_id, client_in)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


# --- DELETE ---


@router.delete("/{client_id}", status_code=status.HTTP_200_OK)
async def delete_client(
    client_id: int,
    force: bool = False,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a client.

    - **force=false** (default): Will fail if client has loans or deposits.
    - **force=true**: Will delete client AND all related loans/deposits.

    Returns deletion statistics.
    """
    try:
        result = await crud_client.delete_client(db, client_id, force=force)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if result is None:
        raise HTTPException(status_code=404, detail="Client not found")

    return result

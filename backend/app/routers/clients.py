from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.client import ClientSummary, ClientDetail, ClientFull
from app.crud import client as crud_client

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("/", response_model=List[ClientSummary])
async def read_clients(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
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

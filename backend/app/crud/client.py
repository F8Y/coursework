from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Optional, Sequence

from app.db.models.client import Client
from app.db.models.deposit import Deposit


async def get_clients(
    db: AsyncSession, skip: int = 0, limit: int = 100
) -> Sequence[Client]:
    """
    Get list of clients.
    Optimization: No eager loads needed if using ClientSummary schema which only uses ID/Name.
    If we want to show Job Name in the list, we would need to join Job.
    Assume ClientSummary is lightweight.
    """
    stmt = select(Client).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_client_by_id(db: AsyncSession, client_id: int) -> Optional[Client]:
    """
    Get detailed client info.
    Includes: Job, Education, MaritalStatus (Reference tables).
    Does NOT include: Loans, Deposits (to keep query lighter).
    """
    stmt = (
        select(Client)
        .options(
            selectinload(Client.job),
            selectinload(Client.education_level),
            selectinload(Client.marital_status),
        )
        .where(Client.id == client_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_client_full_by_id(db: AsyncSession, client_id: int) -> Optional[Client]:
    """
    Get FULL client info.
    Includes: References AND Loans, Deposits.
    """
    stmt = (
        select(Client)
        .options(
            selectinload(Client.job),
            selectinload(Client.education_level),
            selectinload(Client.marital_status),
            selectinload(Client.loans),
            selectinload(Client.deposits).selectinload(Deposit.type),
        )
        .where(Client.id == client_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

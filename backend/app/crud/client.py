from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Optional, Sequence, Tuple

from app.db.models.client import Client
from app.db.models.deposit import Deposit
from app.db.models.loan import Loan
from app.schemas.client import ClientCreate, ClientUpdate


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


# --- CREATE ---


async def create_client(db: AsyncSession, client_in: ClientCreate) -> Client:
    """
    Create a new client.
    """
    db_client = Client(**client_in.model_dump())
    db.add(db_client)
    await db.commit()
    await db.refresh(db_client)
    return db_client


# --- UPDATE ---


async def update_client(
    db: AsyncSession, client_id: int, client_in: ClientUpdate
) -> Optional[Client]:
    """
    Update an existing client.
    Returns None if client not found.
    """
    # First, get the client
    stmt = select(Client).where(Client.id == client_id)
    result = await db.execute(stmt)
    db_client = result.scalar_one_or_none()

    if db_client is None:
        return None

    # Update only provided fields (exclude unset)
    update_data = client_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_client, field, value)

    await db.commit()
    await db.refresh(db_client)

    # Re-fetch with relations for response
    return await get_client_by_id(db, client_id)


# --- DELETE ---


async def get_client_finance_counts(
    db: AsyncSession, client_id: int
) -> Tuple[int, int]:
    """
    Get counts of loans and deposits for a client.
    Returns (loans_count, deposits_count).
    """
    loans_result = await db.execute(
        select(Loan).where(Loan.client_id == client_id)
    )
    loans_count = len(loans_result.scalars().all())

    deposits_result = await db.execute(
        select(Deposit).where(Deposit.client_id == client_id)
    )
    deposits_count = len(deposits_result.scalars().all())

    return loans_count, deposits_count


async def delete_client(
    db: AsyncSession, client_id: int, force: bool = False
) -> Optional[dict]:
    """
    Delete a client.
    
    If force=False (default):
        - Returns None if client not found
        - Raises ValueError if client has loans/deposits
    
    If force=True:
        - Deletes client and all related loans/deposits
        - Returns dict with deletion stats
    """
    # Check if client exists
    stmt = select(Client).where(Client.id == client_id)
    result = await db.execute(stmt)
    db_client = result.scalar_one_or_none()

    if db_client is None:
        return None

    # Get finance counts
    loans_count, deposits_count = await get_client_finance_counts(db, client_id)

    if not force and (loans_count > 0 or deposits_count > 0):
        raise ValueError(
            f"Клиент имеет {loans_count} кредит(ов) и {deposits_count} депозит(ов). "
            "Используйте force=true для каскадного удаления."
        )

    # If force=True, delete related records first
    deleted_loans = 0
    deleted_deposits = 0

    if force:
        # Delete loans
        loans_to_delete = await db.execute(
            select(Loan).where(Loan.client_id == client_id)
        )
        for loan in loans_to_delete.scalars().all():
            await db.delete(loan)
            deleted_loans += 1

        # Delete deposits
        deposits_to_delete = await db.execute(
            select(Deposit).where(Deposit.client_id == client_id)
        )
        for deposit in deposits_to_delete.scalars().all():
            await db.delete(deposit)
            deleted_deposits += 1

    # Delete client
    await db.delete(db_client)
    await db.commit()

    return {
        "deleted": True,
        "client_id": client_id,
        "deleted_loans": deleted_loans,
        "deleted_deposits": deleted_deposits,
    }


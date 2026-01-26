from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Sequence, Optional

from app.db.models.loan import Loan
from app.db.models.deposit import Deposit
from app.schemas.finance import LoanCreate, LoanUpdate, DepositCreate, DepositUpdate


# ============================================================================
# LOANS
# ============================================================================


async def create_loan(db: AsyncSession, loan_in: LoanCreate) -> Loan:
    """Create a new loan."""
    db_loan = Loan(**loan_in.model_dump())
    db.add(db_loan)
    await db.commit()
    await db.refresh(db_loan)
    return db_loan


async def get_loan_by_id(db: AsyncSession, loan_id: int) -> Optional[Loan]:
    """Get a loan by ID."""
    result = await db.execute(select(Loan).where(Loan.id == loan_id))
    return result.scalar_one_or_none()


async def get_loans_by_client(db: AsyncSession, client_id: int) -> Sequence[Loan]:
    """Get all loans for a client."""
    result = await db.execute(select(Loan).where(Loan.client_id == client_id))
    return result.scalars().all()


async def update_loan(
    db: AsyncSession, loan_id: int, loan_in: LoanUpdate
) -> Optional[Loan]:
    """
    Update an existing loan.
    Returns None if loan not found.
    """
    db_loan = await get_loan_by_id(db, loan_id)
    if db_loan is None:
        return None

    update_data = loan_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_loan, field, value)

    await db.commit()
    await db.refresh(db_loan)
    return db_loan


async def delete_loan(db: AsyncSession, loan_id: int) -> bool:
    """
    Delete a loan.
    Returns True if deleted, False if not found.
    """
    db_loan = await get_loan_by_id(db, loan_id)
    if db_loan is None:
        return False

    await db.delete(db_loan)
    await db.commit()
    return True


# ============================================================================
# DEPOSITS
# ============================================================================


async def create_deposit(db: AsyncSession, deposit_in: DepositCreate) -> Deposit:
    """Create a new deposit."""
    db_deposit = Deposit(**deposit_in.model_dump())
    db.add(db_deposit)
    await db.commit()
    # Re-fetch with eager load of type relationship
    stmt = (
        select(Deposit)
        .options(selectinload(Deposit.type))
        .where(Deposit.id == db_deposit.id)
    )
    result = await db.execute(stmt)
    return result.scalar_one()


async def get_deposit_by_id(db: AsyncSession, deposit_id: int) -> Optional[Deposit]:
    """Get a deposit by ID with type relationship loaded."""
    stmt = (
        select(Deposit)
        .options(selectinload(Deposit.type))
        .where(Deposit.id == deposit_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_deposits_by_client(db: AsyncSession, client_id: int) -> Sequence[Deposit]:
    """Get all deposits for a client."""
    result = await db.execute(select(Deposit).where(Deposit.client_id == client_id))
    return result.scalars().all()


async def update_deposit(
    db: AsyncSession, deposit_id: int, deposit_in: DepositUpdate
) -> Optional[Deposit]:
    """
    Update an existing deposit.
    Returns None if deposit not found.
    """
    db_deposit = await get_deposit_by_id(db, deposit_id)
    if db_deposit is None:
        return None

    update_data = deposit_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_deposit, field, value)

    await db.commit()

    # Re-fetch with type relationship
    return await get_deposit_by_id(db, deposit_id)


async def delete_deposit(db: AsyncSession, deposit_id: int) -> bool:
    """
    Delete a deposit.
    Returns True if deleted, False if not found.
    """
    db_deposit = await get_deposit_by_id(db, deposit_id)
    if db_deposit is None:
        return False

    await db.delete(db_deposit)
    await db.commit()
    return True

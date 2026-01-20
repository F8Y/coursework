from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Sequence, Optional

from app.db.models.loan import Loan
from app.db.models.deposit import Deposit
from app.schemas.finance import LoanCreate, DepositCreate

from sqlalchemy.orm import selectinload

# --- Loans ---


async def create_loan(db: AsyncSession, loan_in: LoanCreate) -> Loan:
    db_loan = Loan(**loan_in.model_dump())
    db.add(db_loan)
    await db.commit()
    await db.refresh(db_loan)
    return db_loan


async def get_loans_by_client(db: AsyncSession, client_id: int) -> Sequence[Loan]:
    result = await db.execute(select(Loan).where(Loan.client_id == client_id))
    return result.scalars().all()


# --- Deposits ---


async def create_deposit(db: AsyncSession, deposit_in: DepositCreate) -> Deposit:
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


async def get_deposits_by_client(db: AsyncSession, client_id: int) -> Sequence[Deposit]:
    result = await db.execute(select(Deposit).where(Deposit.client_id == client_id))
    return result.scalars().all()

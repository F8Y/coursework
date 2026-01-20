from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.finance import Loan, LoanCreate, Deposit, DepositCreate
from app.crud import finance as crud_finance

router = APIRouter(prefix="/finance", tags=["Finance"])


@router.post("/loans", response_model=Loan, status_code=status.HTTP_201_CREATED)
async def create_loan(loan_in: LoanCreate, db: AsyncSession = Depends(get_db)):
    """
    Issue a new loan for a client.
    """
    return await crud_finance.create_loan(db, loan_in)


@router.post("/deposits", response_model=Deposit, status_code=status.HTTP_201_CREATED)
async def create_deposit(deposit_in: DepositCreate, db: AsyncSession = Depends(get_db)):
    """
    Open a new deposit for a client.
    """
    return await crud_finance.create_deposit(db, deposit_in)
